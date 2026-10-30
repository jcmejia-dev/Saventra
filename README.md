# Saventra

**Save. Adapt. Keep going.** A global savings companion to build goals, plan unexpected withdrawals, and rebuild savings with flexible recovery plans.

## Design review

First interactive design prototype, awaiting owner feedback. [Open the preview](https://jcmejia-dev.github.io/Saventra/).

Try adding savings, creating a goal, changing the demo currency, and planning a withdrawal. The dashboard uses illustrative data; changes are in memory and reset on refresh. Currency selection relabels sample values rather than converting them. No accounts, bank connections, real transfers, durable storage, or reminders are implemented. The brand name remains subject to clearance.

## Project documents

- [Product blueprint](docs/BLUEPRINT.md)
- [Development workflow](docs/WORKFLOW.md)
- [CI and publishing pipeline](docs/PIPELINE.md)

## Run locally

Node 22+. No dependencies to install.

```sh
npm start
npm test
npm run build
```

Local preview: http://127.0.0.1:4173. Main publishes to GitHub Pages after checks. Production implementation starts after design review.
