# Development and review workflow

1. Owner reviews the public prototype and supplies screen-specific feedback.
2. Translate feedback into bounded issues with expected behavior and acceptance criteria.
3. Create a feature branch from current main. Inspect local status first; preserve other work.
4. Implement one reviewable change. Keep domain math separate from presentation.
5. Run `npm test` and `npm run build`; verify desktop/mobile layouts and keyboard interactions for changed flows.
6. Push branch and open a pull request describing behavior, validation, limitations, and screenshots for visual changes.
7. Review and merge after checks and the applicable owner instruction. Main automatically deploys the review site.
8. Verify the published revision. Roll back by reverting a commit through a normal reviewed change; never force-push shared history.

The owner authorized pushing the initial blueprint, prototype, and publishing setup to this repository. That authorization does not grant unrelated access or imply permanent platform credentials. Stop production implementation after this design release until the owner reviews it.

## Product states
Planned → Designed → In review → Approved → Implemented → Verified. Mark placeholders and simulations explicitly. A planned contribution is not an actual ledger entry. A UI preview is not a production release.

## Local development
Node 22 or later. No package installation required. `npm start` serves http://127.0.0.1:4173. Use `npm test` and `npm run build`. The output is `dist/`; source remains in the repository root. Never commit secrets, personal financial records, or environment files.
