import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json();

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Name, email, and company are required fields." },
        { status: 400 }
      );
    }

    const recipient = process.env.CONTACT_EMAIL_TO || "partners@streamstellar.com";
    const sender = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
    const apiKey = process.env.RESEND_API_KEY;

    const emailSubject = `StreamStellar Project Inquiry — ${company}`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #333333;">
        <h2 style="color: #000000; border-bottom: 1px solid #eaeaea; padding-bottom: 12px; font-weight: 600; margin-top: 0;">StreamStellar Project Inquiry</h2>
        <p style="font-size: 15px; color: #666666; line-height: 1.5;">You have received a new project request from the StreamStellar portal:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f5f5f5;">
            <td style="padding: 10px 0; font-weight: 600; width: 160px; color: #111111; font-size: 14px;">Contact Name:</td>
            <td style="padding: 10px 0; color: #444444; font-size: 14px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f5f5f5;">
            <td style="padding: 10px 0; font-weight: 600; color: #111111; font-size: 14px;">Work Email:</td>
            <td style="padding: 10px 0; color: #444444; font-size: 14px;"><a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f5f5f5;">
            <td style="padding: 10px 0; font-weight: 600; color: #111111; font-size: 14px;">Company & Industry:</td>
            <td style="padding: 10px 0; color: #444444; font-size: 14px;">${company}</td>
          </tr>
        </table>
        
        <div style="margin-top: 24px; padding: 18px; background-color: #f9f9f9; border-left: 4px solid #8b5cf6; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: #111111; font-size: 14px; font-weight: 600;">Project Brief:</h4>
          <p style="margin: 0; color: #444444; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message || "No project brief provided."}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 32px; margin-bottom: 16px;" />
        <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">Sent via StreamStellar Web System</p>
      </div>
    `;

    // If API key is present, send the live email via Resend
    if (apiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: sender,
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resend API error:", errorData);
        return NextResponse.json(
          { error: "Failed to dispatch email via provider." },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, message: "Email sent successfully." });
    }

    // In local dev environment / simulation mode (when RESEND_API_KEY is not defined)
    console.log("==========================================");
    console.log("SIMULATED EMAIL DELIVERY (NO API KEY SET)");
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body:\n- Name: ${name}\n- Email: ${email}\n- Company: ${company}\n- Brief: ${message}`);
    console.log("==========================================");

    return NextResponse.json({
      success: true,
      simulated: true,
      message: "Form submission simulated successfully. Set RESEND_API_KEY to send actual emails.",
    });
  } catch (error) {
    console.error("Inquiry form submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during submission." },
      { status: 500 }
    );
  }
}
