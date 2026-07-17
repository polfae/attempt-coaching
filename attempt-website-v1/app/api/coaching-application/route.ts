import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/firestore";
import type { CoachingApplication } from "@/lib/firestore";

type ApplicationPayload = CoachingApplication & {
  submittedAt?: string;
};

const notificationRecipient =
  process.env.APPLICATION_NOTIFICATION_EMAIL ||
  process.env.ADMIN_NOTIFICATION_EMAIL ||
  "";

const notificationSender =
  process.env.APPLICATION_NOTIFICATION_FROM ||
  "Attempt Coaching <onboarding@resend.dev>";

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function adminUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return `${baseUrl.replace(/\/$/, "")}/admin/applications`;
}

async function sendApplicationNotification(
  application: ApplicationPayload,
  submittedAt: Date,
) {
  if (!process.env.RESEND_API_KEY || !notificationRecipient) {
    console.warn(
      "Application notification email skipped. Configure RESEND_API_KEY and APPLICATION_NOTIFICATION_EMAIL.",
    );
    return false;
  }

  const applicantName = `${application.firstName} ${application.lastName}`.trim();
  const body = [
    "A new coaching application has been received.",
    "",
    `Applicant name: ${applicantName}`,
    `Applicant email: ${application.email}`,
    `Country: ${application.country}`,
    `Submitted: ${formatSubmittedAt(submittedAt)} UTC`,
    "",
    `Log in to the Attempt admin panel to review the full application: ${adminUrl()}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: notificationSender,
      to: [notificationRecipient],
      subject: `New coaching application from ${applicantName}`,
      text: body,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email notification failed: ${errorText}`);
  }

  return true;
}

export async function POST(request: Request) {
  const application = (await request.json()) as ApplicationPayload;

  if (
    !application.firstName ||
    !application.lastName ||
    !application.email ||
    !application.country ||
    !application.countryCode
  ) {
    return NextResponse.json(
      { error: "First name, last name, email, and country are required." },
      { status: 400 },
    );
  }

  const submittedAt = new Date();

  await submitApplication({
    ...application,
    name: `${application.firstName} ${application.lastName}`.trim(),
  });

  let notificationSent = false;

  try {
    notificationSent = await sendApplicationNotification(
      application,
      submittedAt,
    );
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({
    ok: true,
    notificationSent,
  });
}
