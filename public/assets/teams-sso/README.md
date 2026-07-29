# Microsoft Teams authentication setup screenshots

These images are referenced by the account-provisioning walkthrough in
[`content/docs/api-v2/authenticated-bots/teams/setup.mdx`](../../../content/docs/api-v2/authenticated-bots/teams/setup.mdx)
via `<ImageZoom src={'/assets/teams-sso/<file>'} … />`.

**The files currently committed are solid-colour placeholders.** Replace them with real
captures from the Microsoft Entra / Microsoft 365 admin centers. When you do, **keep the
same filenames** so the docs need no edits, and **redact any real domain names, emails,
tenant IDs, or passwords** before committing.

| File | What it should show |
|------|---------------------|
| `1-create-user.png` | Microsoft Entra admin center → **Identity → Users → New user → Create new user** (creating the bot account, e.g. `bot1@acme.onmicrosoft.com`). |
| `2-assign-license.png` | Microsoft 365 admin center → **Users → Active users → the bot → Licenses and apps**, with a **Microsoft Teams** license assigned. |
| `3-disable-security-defaults.png` | Entra admin center → **Identity → Overview → Properties → Manage security defaults**, with **Security defaults = Disabled** (Option A — dedicated bot tenant). |
| `4-conditional-access-exclude.png` | Entra → **Protection → Conditional Access** → the "require MFA" policy → **Assignments → Users → Exclude**, with the `svc-teams-bots` group excluded (Option B — mixed tenant, requires Entra ID P1). |
| `5-complete-first-signin.png` | An interactive sign-in at `login.microsoftonline.com` reaching the **"Stay signed in?"** prompt with **no** "Let's keep your account secure" / security-info registration page in between. |
