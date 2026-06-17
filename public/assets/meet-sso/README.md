# Google Meet SSO setup screenshots

These images are referenced by the "Configure the Legacy SSO profile" walkthrough in
[`content/docs/api-v2/getting-started/meet/setup.mdx`](../../../content/docs/api-v2/getting-started/meet/setup.mdx)
via `<ImageZoom src={'/assets/meet-sso/<file>'} … />`.

These are real captures from the Google Admin Console. When replacing or re-capturing
them, keep the same filenames so the docs need no edits, and **redact any real domain
names, emails, or certificate contents** before committing.

| File | What it shows |
|------|---------------|
| `1-find-sso-setting.png` | Admin Console → **Security → Authentication → SSO with third party IdP** (the left-nav entry point). |
| `2-open-legacy-profile.png` | **Third-party SSO profiles** list with the **Legacy SSO Profile** (type `SAML`). |
| `3-configure-profile.png` | The **Legacy SSO profile** form: *Enable legacy SSO profile* checked, **Sign-in page URL** = `https://api.meetingbaas.com/v2/meet-sso/sign-in`, **Sign-out page URL** = `https://api.meetingbaas.com/v2/meet-sso/sign-out`, the verification certificate uploaded, and **Use a domain specific issuer** checked. |
| `4-assign-select-group.png` | **Manage SSO profile assignments** → selecting the bot **group** (or OU) as the scope, with **Select SSO profile: None**. |
| `5-assign-legacy-profile.png` | The same scope with **Select SSO profile: Legacy SSO profile** and the **Override** button. |
