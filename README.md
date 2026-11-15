# RealtyCare.io website

Next.js (App Router) + TypeScript + Tailwind CSS. Every form saves to a Google Sheet.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Node 20 or newer. `npm run build` checks everything compiles; `npm run lint` checks code style.

## Deploy (Vercel, about 5 minutes)

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project**, import the repo. Framework is detected automatically.
3. Add the environment variables from `.env.example` (Settings → Environment Variables).
4. Deploy, then add your domain under **Settings → Domains** and point realtycare.io to it.

## Connect the forms to Google Sheets

Follow `google-apps-script/README.md`. Each form gets its own tab: Strategy calls, Consultations, Demo calls, Calculator.
Every row includes the page, time, and any `utm_*`, `fbclid` or `gclid` from the visitor’s link, so you can see which ad brought them.

## Where to edit things

| I want to change… | Edit |
|---|---|
| Prices, plan limits, what each plan includes | `src/content/plans.ts` (pricing page **and** calculator read from here) |
| Booking link, email, company details, social links | `src/content/site.ts` |
| Navigation and footer links | `src/content/site.ts` |
| FAQ questions | `src/content/faqs.ts` |
| Testimonials (real ones only) | `src/content/testimonials.ts`, then `showTestimonials: true` in `site.ts` |
| Colours, fonts, corner radius | `src/app/globals.css` (the `@theme` block) |
| Calculator maths and default assumptions | `src/lib/calculator.ts` |
| Home page section order | `src/app/page.tsx` |
| A home page section | `src/components/home/*.tsx` |
| Logo | `src/components/layout/Logo.tsx` (site) and `public/brand/` (files) |
| Consent wording on forms | `consentText` in `src/components/forms/fields.tsx` |

## Folder map

```
src/
  app/                  one folder per page (page.tsx), plus api/lead (form handler)
    page.tsx            Home
    product/            Product
    pricing/            Pricing
    calculator/         Calculator
    book/               Strategy call form
    thank-you/          After booking
    privacy/, terms/    Legal templates (have a lawyer review)
    api/lead/route.ts   Receives every form → Google Sheets (+ optional Vapi demo call)
  components/
    layout/             Header, Footer, Logo
    ui/                 Buttons, Container, Section, Card, icons
    forms/              Form fields and each form
    home/, pricing/, product/, calculator/   page sections
  content/              text, prices and settings (edit here first)
  lib/                  calculator maths, form helpers
google-apps-script/     Code.gs to paste into your Google Sheet
public/brand/           logo SVG/PNG, app icon, social share image
```

## Adding a new form

1. Add its type to `src/lib/forms.ts` (choose the sheet tab name and required fields).
2. In your component: `const { status, error, onSubmit, honeypotName } = useLeadForm("your_type")`.
3. Give each input a `name`. That name becomes the column in the sheet.

## Optional: real AI demo calls

Set `VAPI_API_KEY`, `VAPI_ASSISTANT_ID` and `VAPI_PHONE_NUMBER_ID`. The “Get called by the AI” form on the home page then starts a Vapi call to the number entered (after saving the row). Leave them empty to only save the request.

## Before launch checklist

- [ ] `bookingUrl`, `contactEmail`, `legalName`, `companyNumber`, `address` in `src/content/site.ts`
- [ ] Supported CRMs listed on `/product` (search for `[LIST SUPPORTED CRMs]`)
- [ ] Consent wording and the privacy/terms pages reviewed by a US lawyer
- [ ] Google Sheet connected and a test submission received
- [ ] Testimonials only from real clients with written permission
- [ ] Every “60 seconds” claim keeps its footnote (`sixtySecondFootnote`)
