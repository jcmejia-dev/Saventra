# AI and banking integration boundaries

## Available now
The public GitHub Pages preview has a working local, rule-based coach. It calculates affordability from the active income-period plan, identifies the largest expense the user marked flexible, and explains recovery options. It does not send questions or budgets anywhere. It is explicitly labeled as a local coach, not a connected model. Its limited intent matching provides a clear fallback for unsupported questions.

Accounts are manually entered nicknames, types, and balances. They are separate from goal allocations and never summed with them. Contributions and withdrawals adjust goal balances only; account balances remain manual snapshots and must be updated independently. There is no bank authorization, rate lookup, reconciliation, transfer, or custody. Currency selection remains a demo relabeling control, not real exchange conversion.

## Prepared server adapter
`server/ai-coach.mjs` exports a standard Request-to-Response handler using the installed AI SDK. It is excluded from the static build. It requires server-side AI_GATEWAY_API_KEY, SAVENTRA_AI_MODEL, and COACH_ACCESS_TOKEN. No model is selected until deployment, so supported models can be checked then. The adapter validates input size and integer amounts, requires explicit data-sharing consent and bearer authentication, computes affordability itself, limits output, and times out provider calls. It accepts only a minimal numeric budget summary and question, not raw accounts, credentials, or transaction histories. No write tools are exposed. Provider failures return a clear local-coach fallback.

The access token is for a private integration test, not a credential to embed in public JavaScript. No live endpoint is configured in the browser. To enable public AI, deploy an authenticated server route, replace shared-token auth with per-user sessions, add a durable user quota and provider spending limits, implement a consent UI showing the exact summary and provider, review retention/deletion terms, and connect the browser only after those controls are verified. Never store a model-provider key in GitHub Pages or request it in chat.

## Real banking later
Choose countries and read-only account aggregation providers first. Use provider-hosted authorization and server-side token storage, scoped consent, revocation, reconciliation and transfer deduplication, currency metadata, audit controls, and appropriate compliance review. No single connection can be assumed to work with every bank in every country. Bank suggestions and deposit protections require current local sources; the local coach does not invent them.

## Verification limits
Automated tests verify the disabled integration, authentication rejection, consent, and invalid-budget rejection without making paid provider calls. No live model invocation or bank connection has been tested or represented as complete.
