import { NextResponse } from "next/server";
import { emailRoutes, escapeHtml, isEmail, sendEmail } from "../email";
import { appendBetaSignup } from "../sheets";

const topicRoutes: Record<string, string> = {
  "Beta access": emailRoutes.beta,
  "General contact": emailRoutes.hello,
  Partnership: emailRoutes.hello,
  Press: emailRoutes.hello,
  Support: emailRoutes.support
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const topic = String(body.topic || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim();

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !isEmail(email) || !topic || !message) {
      return NextResponse.json({ error: "Please complete all contact fields." }, { status: 400 });
    }

    const routedTo = topicRoutes[topic] || emailRoutes.hello;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeTopic = escapeHtml(topic);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const sheetResult =
      topic === "Beta access"
        ? await appendBetaSignup({
            email,
            notes: `Name: ${name}\nMessage: ${message}`,
            source: "Contact form - Beta access",
            status: "Contact Form",
            userAgent: request.headers.get("user-agent") || ""
          }).catch((error) => {
            console.error(error);
            return { duplicate: false, stored: false };
          })
        : { duplicate: false, stored: false };

    await Promise.all([
      sendEmail({
        html: `
          <h2>New TickrMind contact request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Topic:</strong> ${safeTopic}</p>
          <p><strong>Routed to:</strong> ${escapeHtml(routedTo)}</p>
          <hr />
          <p>${safeMessage}</p>
        `,
        replyTo: email,
        subject: `TickrMind contact: ${topic}`,
        text: `New TickrMind contact request\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\nRouted to: ${routedTo}\n\n${message}`,
        to: routedTo
      }),
      sendEmail({
        html: `
          <h2>We received your TickrMind message</h2>
          <p>Hi ${safeName},</p>
          <p>Thanks for reaching out to TickrMind. We received your message and routed it to <strong>${escapeHtml(routedTo)}</strong>.</p>
          <p><strong>Topic:</strong> ${safeTopic}</p>
          <p>Our team will review it and reply by email.</p>
          <p>Not financial advice. Trade responsibly.</p>
        `,
        replyTo: routedTo,
        subject: "We received your TickrMind message",
        text: `We received your TickrMind message\n\nHi ${name},\n\nThanks for reaching out to TickrMind. We received your message and routed it to ${routedTo}.\n\nTopic: ${topic}\n\nOur team will review it and reply by email.\n\nNot financial advice. Trade responsibly.`,
        to: email
      })
    ]);

    return NextResponse.json({
      duplicate: sheetResult.duplicate,
      ok: true,
      routedTo,
      sheetStored: sheetResult.stored
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
