import SignInButton from "../_components/SignInButton";

export const metadata = {
  title: "Login",
};

export default function Page({ searchParams }) {
  const error = searchParams?.error;
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        Sign in to access your guest area
      </h2>

      {error && (
        <p role="alert" className="text-accent-400 text-center">
          {error === "Configuration"
            ? "Google sign-in is temporarily unavailable. Please try again later."
            : "We couldn’t sign you in with Google. Please try again."}
        </p>
      )}

      <SignInButton />
    </div>
  );
}
