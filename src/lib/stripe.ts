// Server only: the store's line to Stripe, through Stripe's REST API (no
// SDK, no extra dependency).
//
// EDIT: the key is STRIPE_SECRET_KEY on Vercel (new-website → Settings →
// Environment Variables). The store runs on the Stripe SANDBOX ONLY: a live
// key (sk_live_…, rk_live_…) is refused, so a slip can never charge a real
// card. Going live later means changing SANDBOX_ONLY below on purpose.
// (Only route handlers and server pages import this; the key is not a
// NEXT_PUBLIC_ variable, so it never reaches the browser.)

const SANDBOX_ONLY = true; // EDIT: false only when you mean to take real payments

export type StripeMode = "sandbox" | "off";

/** The key, when there is one the store may use. */
function key(): string | null {
  const k = process.env.STRIPE_SECRET_KEY?.trim();
  if (!k) return null;
  const test = /^(sk|rk)_test_/.test(k);
  if (SANDBOX_ONLY && !test) return null;
  return k;
}

/** Whether checkout can run, and on what. */
export function stripeMode(): StripeMode {
  return key() ? "sandbox" : "off";
}

/** Nested params → Stripe's form encoding (a[b][0][c]=…). */
function encode(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (obj === undefined || obj === null) return out;
  if (Array.isArray(obj)) obj.forEach((v, i) => encode(v, `${prefix}[${i}]`, out));
  else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) encode(v, prefix ? `${prefix}[${k}]` : k, out);
  } else out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(obj))}`);
  return out;
}

/** One call to Stripe. Throws with Stripe's own message when it says no. */
export async function stripe<T>(method: "GET" | "POST", path: string, params?: Record<string, unknown>): Promise<T> {
  const k = key();
  if (!k) throw new Error("Stripe sandbox key missing");
  const body = params ? encode(params).join("&") : undefined;
  const url = `https://api.stripe.com/v1/${path}${method === "GET" && body ? `?${body}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "POST" ? body : undefined,
    cache: "no-store",
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message ?? `Stripe ${res.status}`);
  return data;
}
