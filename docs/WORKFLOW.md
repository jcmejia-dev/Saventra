# Development and review workflow

1. Owner reviews the public prototype and supplies screen-specific feedback.
2. Translate feedback into bounded issues with expected behavior and acceptance criteria.
3. Create a feature branch from current main. Inspect local status first; preserve other work.
4. Implement one reviewable change. Keep domain math separate from presentation.
5. Run `npm test` and `npm run build`; verify desktop/mobile layouts and keyboard interactions for changed flows.
6. Push branch and open a pull request describing behavior, validation, limitations, and screenshots for visual changes.
7. Review and merge after checks and the applicable owner instruction. Main automatically deploys the review site.
8. Verify the published revision. Roll back by reverting a commit through a normal reviewed change; never force-push shared history.

The owner authorized pushing this app and publishing the review site, and subsequently requested adaptive planning, account organization, lessons, a prepared AI integration, violet/blue styling, real registration/login, country/currency onboarding, a guided planner and savings charts. This authorizes publishing those scoped additions. It does not grant unrelated access or imply permanent platform credentials. Production banking, cloud financial synchronization and live AI hosting remain separately scoped.

## Product states
Planned → Designed → In review → Approved → Implemented → Verified. Mark placeholders and simulations explicitly. A planned contribution is not an actual ledger entry. A UI preview is not a production release.

## Local development
Node 22 or later. Run `npm ci`, `npm test`, and `npm run build`. The build bundles the managed-auth SDK for the browser. `npm start` serves the built dist/ at http://127.0.0.1:4173. Rebuild after source edits. Never commit secrets, personal financial records, or environment files.
