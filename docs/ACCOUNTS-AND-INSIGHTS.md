# Accounts, onboarding, planning and savings insights

## Authentication
Email/password registration, sign-in, sign-out, and session restoration use Managed Neon Auth through `@neondatabase/auth`. No password or provider credential is stored in app localStorage, committed, or handled by GitHub Actions. Only the public branch Auth URL is bundled. Current project: `weathered-river-78309154`, branch `br-soft-math-aoif2sv1` (development), AWS Singapore. Public origin: `https://jcmejia-dev.github.io`; local QA origin: `http://127.0.0.1:4173`. The project had no IP allowlist or private networking restrictions before Auth was enabled.

The public demo remains usable without an account. Authenticated users start with a zero-balance personal goal, never the demo's money. The account overlay supports loading/error states, password visibility, and password-reset UI. Registration and login use the provider's real APIs; no simulated acceptance of credentials.

The provider's existing defaults allow email/password registration and do not require email verification. Those defaults were retained. Shared provider SMTP remains configured. Before marketing this as a production finance product, evaluate verified email and custom SMTP, documented privacy/retention policies, support, monitoring, and account lifecycle requirements. Password-reset delivery has not been end-to-end tested with a real mailbox.

## Storage boundary
Identity is online; financial workspace and country/currency preferences are stored on this device under keys containing the authenticated user id. There is no cloud financial synchronization or protected financial API in this version. Loading personal saved data requires a successful provider session lookup. Sign-out reloads the app, removes personal data from the active UI, and returns to the demo; it does not erase saved device records. This is not encrypted local storage and cannot protect records from someone with access to the same browser profile. Do not claim cross-device recovery, a remote private database, or offline account authentication.

## Country and currency
After registration, users select a nationality/home country and get a currency suggestion. They can override the suggestion. No IP lookup or location permission is used. Country/currency mapping is vendored from Unicode CLDR supplemental currencyData, with its license in UNICODE-LICENSE.txt. Some territories use multiple currencies; the first active tender is a suggestion only. Runtime internationalization supplies formatting and fraction digits, including zero-decimal JPY and three-decimal BHD. The selectable currency set includes current CLDR currencies even when the browser's supported-values list is older.

Personal currency is locked once the workspace holds balances or activity, avoiding silent relabeling. Changing a preference does not perform foreign exchange. Demo currency changes relabel and round sample amounts and are explicitly identified as non-FX behavior. Country preferences are saved on this device, not in a custom Auth profile field.

## Guided withdrawal planner
The old long form is replaced by three steps: need → option comparison → review. It compares one goal with amounts above protected minima across goals. Crossing a primary goal's minimum requires explicit acknowledgement. No balance changes until final confirmation. Insufficient options produce an error without mutation. Recovery is optional; a plan starts paused if the entered budget has no surplus. The final screen lists source allocations and remaining balances. This is bookkeeping and never moves bank funds.

## Savings insights
Charts derive from timestamped contributions and withdrawals, including opening balance. Range filters: 30 days, 90 days, all time. Goal cards link to a filtered detail view. The page includes a balance line, savings allocation donut, inflow/outflow bars, contribution/withdrawal/net totals and an accessible exact-activity table. New activity updates charts immediately, and signed-in workspaces restore after reload. Opening balances are not falsely counted as period contributions. Transfers between account snapshots are not counted as new savings. The dashboard sparkline now also derives from recorded activity.

## Validation
Tests cover arithmetic, overdraft prevention, shared recovery surplus, zero/two/three decimal currency amounts, country suggestions, chart reconciliation, date/goal filtering, and disabled AI adapter boundaries. Generated QA account browser checks cover real registration, PH → PHP onboarding, zero initial personal balance, adding 1,200 PHP, refresh restoration, sign-out, sign-in, protected withdrawal of 200 PHP, and matching chart totals. Passwords and tokens are not written to test fixtures. Test accounts use reserved example.invalid addresses.

The Managed SDK currently depends on UI/server packages not used in the bundle. Pin overrides patch high/critical advisories in Better Auth and Zod. The package audit retains low-severity advisories in unused transitive UI/email dependencies; only the vanilla managed-auth client is bundled. Review updates to the SDK rather than replacing the managed wrapper with an incompatible client.
