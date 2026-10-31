# CI and GitHub Pages pipeline

Pull request / main push → checkout → Node setup → locked dependency installation → domain tests → syntax checks → static build. esbuild bundles the vanilla Managed Neon Auth client and application modules into a browser ESM file; provider and server credentials are never part of the static build. Public configuration includes only the branch Auth URL.

On main only: upload the dist artifact → deploy to the github-pages environment using GitHub's short-lived OIDC token. Pull requests cannot deploy. Deployment permissions are scoped to the deployment job. Concurrency avoids simultaneous Pages deployments. No paid services or manually stored deployment keys are required.

Repository Pages source must be GitHub Actions. Expected URL: https://jcmejia-dev.github.io/Saventra/. All local assets use relative URLs to work under the repository subpath. Actual publication must be verified through the Actions deployment result and HTTP response, not merely assumed from a successful push.

Checks cover recovery arithmetic, invalid withdrawals, and JavaScript syntax. Visual and interaction checks supplement them. Future production work must add meaningful ledger, scheduling, currency precision, storage failure, and accessibility verification.

If a workflow fails, inspect the failed job; fix the cause and publish a normal commit. Do not disable failing checks to make the pipeline green. Revert a bad change to publish a rollback. Repository settings and runtime deployment status should be reported separately from source configuration.

Bank savings update: contributions can be assigned to a named manual bank/wallet account (including custom names). Goal cards, activity, accounts, and insights display those allocations. Legacy balances remain unassigned. Withdrawals reduce allocations in listed order, then unassigned funds; recovery contributions can select an account. Account snapshots remain separate and are never counted twice. Entry forms and the withdrawal planner now use full-page responsive layouts. Bank conservation tests supplement manual UI checks.
