# Authentication & Complimentary Invitation Recovery (Admin)

## Affected-account recovery (safe procedure)
Use this **only** after implementation is approved/deployed as directed. **Do not delete the account, do not create a duplicate, do not manually set/overwrite the password, and do not send live recovery/reset emails until explicitly approved.**

1. **Confirm state (read-only, redacted):** Admin → Members → locate the member → use **Check status** (or the diagnostic endpoint with admin auth). Record only: account exists, credential present, complimentary active/expires, invitation redeemed/kind. Never record passwords/hashes/tokens/secrets.
2. **If invitation not redeemed but account exists:** A valid complimentary invite can be redeemed through the invite link; redemption is idempotent and will **attach complimentary entitlement when eligible without overwriting the password**. If the member cannot sign in, proceed to step 3.
3. **Restore sign-in (no password visibility):** With explicit approval to send email, use **Send reset email** for the member’s email (Better Auth secure, single-use, expiring reset). Alternatively issue **Resend invite** (new token) only if appropriate; redemption remains recoverable/idempotent.
4. **Verify:** After member resets password via the link, confirm sign-in to `/dashboard`, complimentary access active (if applicable), and role gates intact. Paid/Stripe/admin unaffected.
5. **If automated send not approved:** Provide the admin-generated invite URL or ask the owner to approve a reset-email send; share URLs securely and never via insecure channels containing secrets.

## Required production config (for reset/invite emails)
- `BETTER_AUTH_URL` = production origin (trusted origin behavior depends on this).
- `BETTER_AUTH_SECRET` set.
- `RESEND_API_KEY` and `EMAIL_FROM` configured (Resend infrastructure).
- D1 binding `DB` unchanged; **no migrations required** for this change.

## Notes
- Password reset responses are enumeration-safe; reset links are single-use and expire in 1 hour; sessions revoked on password reset.
- Rate limiting is best-effort in-isolate plus generic responses; monitor abuse.
