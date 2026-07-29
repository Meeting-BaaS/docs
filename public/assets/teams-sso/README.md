# Microsoft Teams authentication setup screenshots

These images are referenced by the account-provisioning walkthrough in
[`content/docs/api-v2/authenticated-bots/teams/setup.mdx`](../../../content/docs/api-v2/authenticated-bots/teams/setup.mdx)
via `<ImageZoom src={'/assets/teams-sso/<file>'} … />`.

When re-capturing, **keep the same filenames** so the docs need no edits, and **redact any
real domain names, emails, tenant IDs, or passwords** first.

| File | What it shows |
|------|---------------|
| `1-create-user-m365.png` | **Microsoft 365 admin center → Users → Active users**, with the created bot account (e.g. `bot1@…onmicrosoft.com`) in the list. |
| `2-create-user-entra.png` | **Microsoft Entra admin center → Users → All users**, with the **+ New user** button in the command bar (the alternative portal for creating the account). |
| `3-assign-license.png` | **Microsoft 365 admin center → Users → Active users** with the bot selected and **Manage product licenses** in the command bar — assign a **Microsoft Teams** license. |
| `4-disable-security-defaults.png` | **Microsoft Entra admin center → Entra ID → Overview → Properties → Manage security defaults**, set to **Disabled** (Step 2, Option A). |
| `5-per-user-mfa.png` | **Microsoft 365 admin center → Users → Active users** with the bot selected and **Multi-factor authentication** in the command bar — used to set the bot's per-user MFA state to **Disabled** (Step 2, Option B). |
