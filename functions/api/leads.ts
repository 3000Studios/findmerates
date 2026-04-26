/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  RESEND_API_KEY?: string;
  ADMIN_EMAIL?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const body = await request.json() as any;
  const { loanType, creditTier, zip, email, phone } = body;

  const id = crypto.randomUUID();
  const ts = Date.now();

  try {
    await env.DB.prepare(
      "INSERT INTO leads (id, loan_type, credit_tier, zip, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, loanType, creditTier, zip, email, phone, ts).run();

    // Notify via email if configured
    if (env.RESEND_API_KEY && env.ADMIN_EMAIL) {
      // resend notification logic here
    }

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
