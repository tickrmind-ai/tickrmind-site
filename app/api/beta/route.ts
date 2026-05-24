import { NextResponse } from "next/server";
import { emailRoutes, escapeHtml, isEmail, sendEmail } from "../email";
import { appendBetaSignup } from "../sheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const source = String(body.source || "Landing page").trim();

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const safeEmail = escapeHtml(email);
    const sheetResult = await appendBetaSignup({
      email,
      source,
      userAgent: request.headers.get("user-agent") || ""
    }).catch((error) => {
      console.error(error);
      return { duplicate: false, stored: false };
    });

    if (!sheetResult.duplicate) {
      await Promise.all([
        sendEmail({
          html: `
            <h2>New TickrMind beta request</h2>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Route:</strong> beta invites & onboarding</p>
          `,
          replyTo: email,
          subject: "New TickrMind beta request",
          text: `New TickrMind beta request\n\nEmail: ${email}\nRoute: beta invites & onboarding`,
          to: emailRoutes.beta
        }),
        sendEmail({
          html: `
            <h2>You're on the TickrMind beta list</h2>
            <p>Thanks for requesting access to TickrMind.</p>
            <p>We received your beta request and will follow up with onboarding details as beta invites open.</p>
            <p>In the meantime, keep an eye on this inbox for updates from the TickrMind team.</p>
            <p>Not financial advice. Trade responsibly.</p>
          `,
          replyTo: emailRoutes.beta,
          subject: "You're on the TickrMind beta list",
          text:
            "You're on the TickrMind beta list\n\nThanks for requesting access to TickrMind.\n\nWe received your beta request and will follow up with onboarding details as beta invites open.\n\nIn the meantime, keep an eye on this inbox for updates from the TickrMind team.\n\nNot financial advice. Trade responsibly.",
          to: email
        })
      ]);
    }

    return NextResponse.json({
      duplicate: sheetResult.duplicate,
      ok: true,
      routedTo: emailRoutes.beta,
      sheetStored: sheetResult.stored
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to send beta request right now." }, { status: 500 });
  }
}
