const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const vm = require("node:vm");

async function loadModule(file, mocks) {
  const context = vm.createContext({ console, process, Date });
  const source = await fs.readFile(path.join(__dirname, "..", file), "utf8");
  const module = new vm.SourceTextModule(source, { context });
  await module.link(async (specifier) => {
    assert.ok(specifier in mocks, `Unexpected import: ${specifier}`);
    const values = mocks[specifier];
    const dependency = new vm.SyntheticModule(Object.keys(values), function () {
      for (const [name, value] of Object.entries(values)) this.setExport(name, value);
    }, { context });
    return dependency;
  });
  await module.evaluate();
  return module.namespace;
}

test("Google login accepts verified identities and stores the guest ID once", async () => {
  let config;
  let guestCalls = 0;
  await loadModule("app/_lib/auth.js", {
    "next-auth": { default: (value) => {
      config = value;
      return { auth() {}, signIn() {}, signOut() {}, handlers: { GET() {}, POST() {} } };
    } },
    "./auth.config": { default: { callbacks: {} } },
    "./guest-service": { ensureGuest: async () => { guestCalls++; return { id: 42 }; } },
  });
  const user = { email: "guest@example.com", name: "Guest" };
  assert.equal(config.callbacks.signIn({ account: { provider: "google" }, profile: { email_verified: true }, user }), true);
  assert.equal(config.callbacks.signIn({ account: { provider: "google" }, profile: { email_verified: false }, user }), false);
  assert.equal(config.callbacks.signIn({ account: { provider: "other" }, profile: { email_verified: true }, user }), false);
  const token = await config.callbacks.jwt({ token: {}, user });
  assert.equal(token.guestId, 42);
  assert.equal((await config.callbacks.jwt({ token })).guestId, 42);
  assert.equal(guestCalls, 1);
});

test("Guest database errors do not create duplicate accounts", async () => {
  let inserted = false;
  const service = await loadModule("app/_lib/guest-service.js", {
    "server-only": {},
    "./supabase-server": { getSupabaseServer: () => ({ from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: { message: "denied" } }) }) }),
      insert: () => { inserted = true; },
    }) }) },
  });
  await assert.rejects(service.ensureGuest({ email: "guest@example.com" }), /could not be loaded/);
  assert.equal(inserted, false);
});

test("Private data queries reject unsigned-in visitors and other guests", async () => {
  let session = null;
  let accessedDatabase = false;
  const service = await loadModule("app/_lib/data-service.js", {
    "next/navigation": { notFound() {} },
    "date-fns": { eachDayOfInterval() {} },
    "./supabase": { supabase: {} },
    "./auth": { auth: async () => session },
    "./guest-service": { findGuestByEmail: async () => { accessedDatabase = true; } },
    "./supabase-server": { getSupabaseServer: () => { accessedDatabase = true; throw new Error("Unexpected access"); } },
  });
  await assert.rejects(service.getBooking(1), /logged in/);
  await assert.rejects(service.getBookings(42), /not allowed/);
  session = { user: { guestId: 42, email: "guest@example.com" } };
  await assert.rejects(service.getBookings(43), /not allowed/);
  await assert.rejects(service.getGuest("other@example.com"), /not allowed/);
  assert.equal(accessedDatabase, false);
});
