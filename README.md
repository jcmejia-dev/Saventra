# Saventra

**Save. Adapt. Keep going.** A global savings companion to build goals, plan unexpected withdrawals, and rebuild savings with flexible recovery plans.

## Design review

First interactive design prototype, awaiting owner feedback. [Open the preview](https://jcmejia-dev.github.io/Saventra/).

Try adding savings, comparing protected withdrawals, adapting recovery plans, planning expenses, tracking manual account balances, completing savings lessons, and asking the local coach. The dashboard uses illustrative data; changes are in memory and reset on refresh. Currency selection relabels sample values rather than converting them. Accounts are manual snapshots, not bank connections. There are no real transfers, durable storage, or reminders. The brand name remains subject to clearance.

The working local coach uses rules and calculations, not a connected AI model. A secure server integration is prepared but inactive; see [AI integration](docs/AI-INTEGRATION.md).

## Project documents

- [Product blueprint](docs/BLUEPRINT.md)
- [Development workflow](docs/WORKFLOW.md)
- [CI and publishing pipeline](docs/PIPELINE.md)

## Run locally

Node 22+. Install the server-side AI SDK dependency for tests; the browser uses native modules.

```sh
npm ci
npm start
npm test
npm run build
```

Local preview: http://127.0.0.1:4173. Main publishes to GitHub Pages after checks. Production implementation starts after design review.
