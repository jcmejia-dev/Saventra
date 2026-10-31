# Saventra

**Save. Adapt. Keep going.** A global savings companion to build goals, plan unexpected withdrawals, and rebuild savings with flexible recovery plans.

## Design review

First interactive design prototype, awaiting owner feedback. [Open the preview](https://jcmejia-dev.github.io/Saventra/).

Try the public demo, or register for a separate personal workspace. Registration is followed by nationality/home-country selection with a suggested currency and manual override. Signed-in savings records and preferences are saved on this device for your account; there is no cloud synchronization. Demo changes reset on refresh.

The guided withdrawal planner compares options before confirmation. Savings insights include balance history, allocation, contributions and withdrawals, date/goal filters, and exact activity details. Bank/e-wallet accounts remain manual snapshots with no bank connections or real transfers. Demo currency changes are not exchange conversion. The brand name remains subject to clearance.

The working local coach uses rules and calculations, not a connected AI model. A secure server integration is prepared but inactive; see [AI integration](docs/AI-INTEGRATION.md).

## Project documents

- [Product blueprint](docs/BLUEPRINT.md)
- [Development workflow](docs/WORKFLOW.md)
- [CI and publishing pipeline](docs/PIPELINE.md)
- [Accounts, currency onboarding and savings insights](docs/ACCOUNTS-AND-INSIGHTS.md)

## Run locally

Node 22+. Install the server-side AI SDK dependency for tests; the browser uses native modules.

```sh
npm ci
npm run build
npm start
npm test
npm run build
```

Local preview: http://127.0.0.1:4173. Main publishes to GitHub Pages after checks. Production implementation starts after design review.

Bank savings update: contributions can be assigned to a named manual bank/wallet account (including custom names). Goal cards, activity, accounts, and insights display those allocations. Legacy balances remain unassigned. Withdrawals reduce allocations in listed order, then unassigned funds; recovery contributions can select an account. Account snapshots remain separate and are never counted twice. Entry forms and the withdrawal planner now use full-page responsive layouts. Bank conservation tests supplement manual UI checks.
