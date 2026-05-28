import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

serve(async (req) => {
  try {
    // Read the payload from the Database Webhook trigger
    const payload = await req.json()
    const record = payload.record

    // Fetch the company email (using Supabase REST or fetching directly if passed in payload)
    // For this example, we assume we fetch the liaison_email based on record.company_id
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "értesítés@yourplatform.hu",
        to: "liaison@company.hu", // Replace with dynamic liaison_email
        subject: `Új Panaszbejelentés: ${record.subject}`,
        html: `<p>Új bejelentés érkezett a rendszerbe.</p><p>Tárgy: <strong>${record.subject}</strong></p>`
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})