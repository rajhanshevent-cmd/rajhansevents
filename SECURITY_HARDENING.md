# Security Hardening Summary

## Repository hygiene

- Removed `src.zip` from the repository working tree.
- Added archive patterns to `.gitignore` (`*.zip`, `*.tar`, `*.tar.gz`, `*.tgz`, `*.rar`, `*.7z`) to prevent binary archive artifacts from bypassing normal source review.

## Security headers added

The Next.js config now adds response headers for all routes:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with conservative disabled browser features
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy-Report-Only` baseline policy (report-only to minimize breakage risk while collecting policy violations)

## Security automation enabled

- Added `.github/dependabot.yml` for weekly npm dependency update PRs.
- Added `.github/workflows/codeql.yml` for JavaScript/TypeScript analysis on push, pull request, and weekly schedule.

## Admin/login hardening

- Existing admin login flow uses Supabase client auth directly (no dedicated server login API route in this codebase).
- Added non-breaking guardrails in `src/app/admin/page.jsx`:
  - Generic authentication failure messaging (`Invalid credentials`) to reduce account/role enumeration signal.
  - Basic in-memory login attempt cooldown scaffold after repeated failures.

## Recommended next steps for production

- Replace client-side attempt cooldown with server-side rate limiting backed by shared storage (Redis or equivalent), keyed by IP + account.
- Enforce MFA for admin users.
- Tighten CSP from report-only to enforcement mode after reviewing violation reports and whitelisting required sources.
- Ensure secret rotation and periodic credential review are part of operations.
- Add WAF/bot protection rules for admin/auth endpoints.
