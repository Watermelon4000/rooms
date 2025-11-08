# Repository Guidelines

## Project Structure & Module Organization
- Sources live under `src/`, split by feature: `app/` (Next.js routes), `components/` (UI + logic), `lib/` (Supabase helpers, Zustand stores).  
- Database schema migrations are in `supabase/migrations/`.  
- Static assets are in `public/`.  
- Docs & contributor material: `WORKFLOW.md`, `AGENTS.md`.

## Build, Test, and Development Commands
- `npm run dev`: start Next.js dev server with Turbopack.  
- `npm run build`: production build.  
- `npm run start`: serve built output.  
- `npm run lint`: run ESLint (blocking on warnings).  
- `npm run db:push`: apply `supabase/migrations` to the linked Supabase project.

## Coding Style & Naming Conventions
- TypeScript + React (App Router). Prefer functional components, PascalCase for components, camelCase for functions/variables.  
- Tailwind v4 + shadcn/ui: use utility classes and keep custom CSS in `globals.css`.  
- Run `npm run lint` before committing; it enforces Next.js rules (`@next/next`, `react-hooks`, etc.).  
- Keep files primarily ASCII; add succinct comments only for non-obvious logic.

## Testing Guidelines
- No automated test suite yet; manual verification expected (editor grid interactions, Supabase queries, realtime).  
- If adding tests, colocate under `src/` near the feature and document commands in `package.json`.  
- Validate API routes and migrations with Supabase CLI (`supabase db reset`, `supabase db lint`) before deployment.

## Commit & Pull Request Guidelines
- Follow conventional, descriptive commit messages (e.g., `feat: add rooms listing page`, `fix: handle async params`).  
- PRs should include: summary of changes, testing evidence (`npm run lint` output, manual steps), screenshots for UI tweaks, and references to Supabase migrations if touched.  
- Ensure `.env.local` is documented but not committed; mention required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`).

## Security & Configuration Tips
- Never commit secrets; use Supabase CLI `supabase secrets set` or Vercel env vars.  
- After schema updates, run `supabase link --project-ref <ref>` and `npm run db:push` to keep environments in sync.  
- For local auth consistency, rely on official Supabase Auth UI component (`@supabase/auth-ui-react`).
