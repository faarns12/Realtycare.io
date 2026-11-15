# Connect the website forms to Google Sheets (10 minutes)

Every form on the site saves a row to a Google Sheet you own. Each form gets its own tab:

| Tab | Comes from |
|---|---|
| Strategy calls | /book page |
| Consultations | footer form on every page |
| Demo calls | “Get called by the AI” on the home page |
| Calculator | “Email me” on the calculator, with the realtor’s numbers |

## Steps

1. Create a new Google Sheet, e.g. “RealtyCare leads”.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what’s there, paste everything from `Code.gs`, and change `SHARED_SECRET` to a long random string.
   Optional: put your email in `NOTIFY_EMAIL` to get an email for every new lead.
4. Click **Deploy → New deployment**. Choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, allow the permissions, and copy the **Web app URL** (ends in `/exec`).
6. In the website’s environment variables (Vercel → Project → Settings → Environment Variables, or `.env.local` for local):
   - `GOOGLE_SHEET_WEBHOOK_URL` = the Web app URL
   - `GOOGLE_SHEET_SECRET` = the same secret as in step 3
7. Redeploy the site. Submit a form and check the sheet.

## Notes

- **Changed the script later?** Use **Deploy → Manage deployments → Edit → Version: New version**. The URL stays the same.
- “Anyone” access is needed so the website can post to it. The secret stops anyone else writing to your sheet.
- Gmail accounts can send about 100 emails a day from Apps Script; Google Workspace accounts about 1,500.
- Want a CRM instead later? Only `src/app/api/lead/route.ts` needs changing; the forms stay the same.
