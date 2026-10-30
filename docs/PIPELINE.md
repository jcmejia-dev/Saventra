# CI and GitHub Pages pipeline

Pull request / main push → checkout → Node setup → domain tests → syntax checks → static build.

On main only: upload the dist artifact → deploy to the github-pages environment using GitHub's short-lived OIDC token. Pull requests cannot deploy. Deployment permissions are scoped to the deployment job. Concurrency avoids simultaneous Pages deployments. No paid services or manually stored deployment keys are required.

Repository Pages source must be GitHub Actions. Expected URL: https://jcmejia-dev.github.io/Saventra/. All local assets use relative URLs to work under the repository subpath. Actual publication must be verified through the Actions deployment result and HTTP response, not merely assumed from a successful push.

Checks cover recovery arithmetic, invalid withdrawals, and JavaScript syntax. Visual and interaction checks supplement them. Future production work must add meaningful ledger, scheduling, currency precision, storage failure, and accessibility verification.

If a workflow fails, inspect the failed job; fix the cause and publish a normal commit. Do not disable failing checks to make the pipeline green. Revert a bad change to publish a rollback. Repository settings and runtime deployment status should be reported separately from source configuration.
