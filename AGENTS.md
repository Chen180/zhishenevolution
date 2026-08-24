<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version can contain breaking changes in APIs, conventions, and file
structure. Read the relevant guide in `node_modules/next/dist/docs/` before
writing Next.js code, and follow all local deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project architecture

- Read `ARCHITECTURE.md` before changing dependencies, module boundaries,
  storage, authentication, background jobs, or deployment.
- Keep Node.js 22, npm lockfile installs, Next.js App Router, strict
  TypeScript, standalone Docker builds, Docker Compose, and Caddy as the
  default baseline.
- Treat the application as one full-stack Next.js service.
- Do not split the frontend and backend without an architecture decision.
- Keep domain code independent from Next.js, React, databases, file systems,
  cloud vendors, and external SDKs.
- Route Handlers validate input, authorize requests, call application use
  cases, and translate responses.
- Put external integrations in `lib/infrastructure`.
- Keep secrets out of Git, images, logs, client bundles, and screenshots.
- Keep port 3000 private and preserve the `/app/data` persistence contract.
- Add new environment variables to `.env.example`.
- Run `npm run verify` before considering a change ready for release.
