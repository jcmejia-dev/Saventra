# Saventra product blueprint

Status: design prototype for owner review. Name and trademark clearance pending. No production financial functionality is represented as completed.

## Product promise
Save. Adapt. Keep going. Help people understand a savings withdrawal and choose an affordable path to rebuild afterward. Initial audience: adults managing their own savings, including workers with irregular income and family obligations, across countries.

## Signature journey
Create goal → record real contribution → preview withdrawal → compare recovery contribution and cadence → confirm withdrawal → track actual recovery contributions. Saving for an intended purchase is a completed purpose; replenishment is optional, not an assumed debt.

## Version 0.1: implemented preview
Responsive browser dashboard; in-memory goals, contributions, activity, withdrawal calculation and recovery plans; seven demo currency labels; blueprint view. Refresh resets changes. Dates and chart are sample illustrations. No login, durable storage, bank connection, exchange rates, notification delivery, or payment processing.

## Version 0.2: adaptive planning preview
Owner requested adaptive recovery, bank-style account organization, savings education, and an assistant. Implemented manual account snapshots; editable expense and income-period estimates; protected minimum and split withdrawal comparison; optional replenishment; reduced, paused, resumed, and recorded recovery contributions; surplus shared across recovery plans in display order; repeated-purpose prompts after three distinct withdrawal events; four educational lessons with checks; and a local rule-based coach. Changing budget periods does not convert expense estimates and users are prompted to review them. Everything remains in memory and resets on refresh. Split recovery contributions restore the source goals in allocation order. Recording an actual contribution reduces available income in the current period to prevent reuse.

Live AI is a prepared, disabled server integration, as selected by the owner. See [AI and banking boundaries](AI-INTEGRATION.md). No production bank integration is included.

## Production MVP after design approval
1. Accessible onboarding: locale, currency, income cadence, basic essentials, optional minimum reserve.
2. Offline durable ledger: goals, contributions, withdrawals, adjustments, and recovery allocations. Data export and user-controlled backup.
3. Deterministic withdrawal impact with protected minimum warning and optional recovery plan.
4. Weekly, biweekly, twice-monthly, monthly, and irregular-income schedules. User chooses timezone and dates. Month ends and daylight-saving changes handled explicitly.
5. Payday check-ins based on current available money and essentials. Insufficient surplus produces extend/pause choices; never fabricated funds or forced saving.
6. Optional local reminders with permission, quiet hours, timezone changes, and cancellation support.

## Global requirements
Language-independent records, English first, externalized translation strings before production, RTL layouts and tested locale formats. Support ISO currency metadata including zero- and three-decimal currencies. Store integer minor units plus currency code. Do not add unlike currencies. Conversion views must expose rate source, timestamp, rounding, and original amounts; never mutate the ledger with display FX. Currency changes on funded goals require an explicit conversion or a new goal. Accessible names, keyboard operation, screen readers, large text, reduced motion, sufficient contrast, and mobile layouts.

## Data model
Goal(id, name, currency, targetMinor, minimumReserveMinor, archivedAt); Entry(id, goalId, type, amountMinor, occurredAt, createdAt, purpose, reversalOf); RecoveryPlan(id, withdrawalEntryId, targetMinor, contributionMinor, cadence, nextDate, status); RecoveryAllocation(entryId, recoveryPlanId, amountMinor); Preferences(locale, timeZone, reminderSettings). Balance derives from ledger entries. IDs are unique and writes transactional. Recovery allocations annotate contributions without counting them twice. A transfer has paired debit/credit entries in the same currency. Never assume a transfer between a user's own accounts is new savings.

## Architecture direction
Current: dependency-free HTML/CSS/ES modules on GitHub Pages. Proposed production: TypeScript client with separated UI, domain calculations, scheduling, and repository interfaces; IndexedDB for a browser-first MVP. Mobile packaging and notification strategy require an owner decision after design approval. Optional cloud synchronization is a later milestone with explicit authentication, encryption, conflict rules, deletion, and export. GitHub Pages hosts static content only.

## Privacy and safety
No analytics, sensitive data collection, external financial APIs, or credentials in this preview. Production must disclose storage location and backup limitations, escape user strings, support deletion/export, and avoid putting private records in logs. App lock alone is not database encryption. Any future AI receives financial data only with explicit informed opt-in; core math remains deterministic. Users retain control over every withdrawal and contribution. No custody, lending, investment recommendation, or guaranteed savings claims.

## Success criteria
Users can understand a withdrawal's consequences, choose a realistic recovery plan, and return at the next income event. Measure task completion and comprehension in consented usability sessions before adding analytics. Do not optimize for balances users cannot afford to retain.

## Milestones
M0: owner reviews visual prototype. M1: approved design and tested money/scheduling domain. M2: durable offline ledger and core journey. M3: reminders, export, accessibility and privacy verification. M4: localization and broader device/currency validation. Cloud and banking integrations require separate scope.

## Open decisions
Approve visual direction and working name; select browser/PWA versus native-first production; choose first translation languages; define backup expectations and eventual pricing. These do not block the static design review.
