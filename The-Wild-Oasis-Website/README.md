This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase configuration

Copy `.env.example` to `.env.local` before running the app. The example contains the
Supabase project URL and publishable key; both are intended for use by the browser
client. Keep secret keys out of client-side code and source control.

Generate an Auth.js secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Set `AUTH_SECRET` in `.env.local` to the generated value. This is required to avoid
the Auth.js `Missing secret` error. `.env.local` is ignored by Git.

For Google sign-in, set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` from your Google
OAuth client. Add `http://localhost:3000/api/auth/callback/google` as an authorized
redirect URI. Set `AUTH_URL` to your website URL when deploying, and configure the
matching Google redirect URI. Set all environment variables in your hosting
provider as well; generate a separate secret for production.

In Google Cloud, open **Google Auth Platform > Clients** and use a **Web
application** client. For local development, its origin is
`http://localhost:3000` and its redirect URI is
`http://localhost:3000/api/auth/callback/google`. If the app is in Testing mode,
add your Google account under **Audience > Test users** before signing in.

Set `SUPABASE_SECRET_KEY` in `.env.local` using a Supabase secret key (or a legacy
`service_role` key). Auth.js sessions are separate from Supabase Auth sessions,
so the publishable key alone cannot access protected guest and booking tables.
The secret is used only by server code; never use a `NEXT_PUBLIC_` prefix or commit
its value. Guest and booking access is restricted to the signed-in guest.

This project lives in the `The-Wild-Oasis-Website` folder of the shared repository.
Run installation and app commands from that folder. On Vercel, select
`The-Wild-Oasis-Website` as the project's Root Directory.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
