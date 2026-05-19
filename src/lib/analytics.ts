import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type AnalyticsEventName =
  | "page_view"
  | "outbound_click"
  | "lead_submit"
  | "lead_error"
  | "checkout_click"
  | "pro_signup_start"
  | "pro_signup_success"
  | "rate_alert_signup";

export type AnalyticsEventPayload = Record<string, unknown>;

function analyticsEnabled() {
  return import.meta.env.VITE_ENABLE_ANALYTICS !== "FALSE";
}

export async function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsEventPayload = {},
) {
  if (!analyticsEnabled()) return;

  const event = {
    name,
    payload,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    href: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "events"), event);
  } catch {
    // Firestore rules may block; analytics should never break UX.
  }
}
