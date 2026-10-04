# The Wild Oasis

The Wild Oasis is a cabin hospitality project made up of two connected web apps: a
guest-facing booking website and an internal hotel management dashboard. Both apps
use Supabase for their data.

## Live apps

| App | Purpose | Live site |
| --- | --- | --- |
| **The Wild Oasis Dashboard** | Staff dashboard for managing day-to-day cabin operations. | [adnan-the-wild-oasis.vercel.app](https://adnan-the-wild-oasis.vercel.app/) |
| **The Wild Oasis Website** | Guest site for discovering cabins and making and managing reservations. | [adnan-the-wild-oasis-website.vercel.app](https://adnan-the-wild-oasis-website.vercel.app/) |

## Projects

### The Wild Oasis Dashboard

Located in [`The-Wild-Oasis/`](./The-Wild-Oasis/), this staff-facing app provides:

- An overview dashboard with operational and booking information.
- Cabin and booking management, including check-in workflows.
- User, account, and hotel settings management.
- Protected routes and a responsive interface with dark mode.

**Stack:** React 18, Vite, Supabase, TanStack Query, React Router, Styled Components,
React Hook Form, Recharts, and date-fns.

### The Wild Oasis Website

Located in [`The-Wild-Oasis-Website/`](./The-Wild-Oasis-Website/), this guest-facing
Next.js app lets visitors:

- Browse cabins and view cabin details.
- Sign in with Google.
- Make and manage reservations and update their profile.

**Stack:** Next.js 14 (App Router), React 18, Supabase, Auth.js (NextAuth), Tailwind
CSS, React Day Picker, and date-fns.
