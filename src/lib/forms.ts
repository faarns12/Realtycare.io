/**
 * Every form on the site has a type. Each type becomes its own tab in your Google Sheet.
 * To add a new form: add its type here, then use `useLeadForm("your_type")` in the component.
 */
export const formTypes = {
  strategy_call: { tab: "Strategy calls", required: ["first_name", "email", "phone"] },
  consultation: { tab: "Consultations", required: ["first_name", "email"] },
  demo_call: { tab: "Demo calls", required: ["first_name", "phone", "consent"] },
  calculator: { tab: "Calculator", required: ["email"] },
} as const;

export type FormType = keyof typeof formTypes;

export const isFormType = (v: unknown): v is FormType => typeof v === "string" && v in formTypes;

/** Hidden field used to catch spam bots. Real people never see or fill it. */
export const HONEYPOT = "company_website";
