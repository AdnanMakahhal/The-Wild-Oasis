"use server";

import { auth, signIn, signOut } from "./auth";
import { getBookings, getCabin, getSettings } from "./data-service";
import { getSupabaseServer } from "./supabase-server";
import { differenceInDays, isValid, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await getSupabaseServer()
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  const [cabin, settings] = await Promise.all([
    getCabin(bookingData.cabinId),
    getSettings(),
  ]);
  const startDate = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);
  const numNights = differenceInDays(endDate, startDate);
  const numGuests = Number(formData.get("numGuests"));
  if (!isValid(startDate) || !isValid(endDate) || startDate < startOfDay(new Date()) ||
      numNights < settings.minBookingLength || numNights > settings.maxBookingLength)
    throw new Error("Please select valid reservation dates");
  if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > cabin.maxCapacity)
    throw new Error("Please select a valid number of guests");
  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);

  const newBooking = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    numNights,
    cabinId: cabin.id,
    cabinPrice,
    guestId: session.user.guestId,
    numGuests,
    observations: String(formData.get("observations") ?? "").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await getSupabaseServer().from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await getSupabaseServer()
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await getSupabaseServer()
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET || !process.env.SUPABASE_SECRET_KEY)
    redirect("/login?error=Configuration");
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
