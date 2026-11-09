/**
 * Branded HFT email and SMS templates.
 *
 * Emails: HTML with a plain-text fallback. Centered on the HFT brand
 * (deep ink background, brand orange accent, Barlow-like clean typography).
 * SMS: concise, under 160 chars where possible, branded, action-oriented.
 *
 * Template functions return { subject, html, text } for email or { body } for SMS.
 * No user data is ever interpolated raw into HTML -- all values are escaped.
 */

const BRAND_ORANGE = "#e8551c";
const BRAND_ORANGE_DARK = "#c4420d";
const INK = "#030303";

const FROM_NAME = "High Frequency Trading";
const FROM_EMAIL_DEFAULT = "hello@highfrequency.vip";
const LOGIN_URL = "/login";
const DASHBOARD_URL = "/dashboard";

function escapeHtml(value: unknown): string {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailShell({
  title,
  body,
  action,
  actionUrl,
  actionLabel,
  footer,
}: {
  title: string;
  body: string;
  action?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  footer?: string;
}): { html: string; text: string } {
  const actionBlock = action && actionUrl && actionLabel
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding: 24px 0;">
            <a href="${escapeHtml(actionUrl)}"
               style="background:${BRAND_ORANGE};color:#ffffff;border:none;border-radius:6px;
                      font-display:16px;font-weight:600;text-decoration:none;
                      padding:12px 24px;display:inline-block;font-family:system-ui,-apple-system,sans-serif;">
              ${escapeHtml(actionLabel)}
            </a>
          </td>
        </tr>
      </table>
    `
    : "";

  const textAction = action && actionUrl && actionLabel
    ? `\n${actionLabel}: ${actionUrl}\n`
    : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${INK};color:#ffffff;
               font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
               line-height:1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                 style="max-width:600px;background:#0a0a0a;border:1px solid #1a1a1a;
                        border-radius:10px;">
            <tr>
              <td align="center" style="padding:32px 24px 20px;border-bottom:1px solid #1a1a1a;">
                <span style="display:inline-block;width:10px;height:10px;background:${BRAND_ORANGE};
                             border-radius:50%;"></span>
                <span style="display:inline-block;width:10px;height:10px;background:${BRAND_ORANGE};
                             border-radius:50%;margin-left:6px;"></span>
                <span style="display:inline-block;width:10px;height:10px;background:${BRAND_ORANGE};
                             border-radius:50%;margin-left:6px;"></span>
                <h1 style="margin:16px 0 0;font-size:20px;font-weight:700;letter-spacing:-0.02em;
                           color:#ffffff;font-family:system-ui,-apple-system,sans-serif;">
                  High Frequency Trading
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;">
                <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#ffffff;
                           font-family:system-ui,-apple-system,sans-serif;">
                  ${escapeHtml(title)}
                </h2>
                <p style="margin:0 0 24px;font-size:15px;color:#c9c9c9;">
                  ${body.replace(/\n/g, "<br />")}
                </p>
                ${actionBlock}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px;border-top:1px solid #1a1a1a;">
                ${footer ?? ""}
                <p style="margin:8px 0 0;font-size:12px;color:#6b6b6b;">
                  High Frequency Trading LLC &mdash; educational content only. Not financial advice.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `High Frequency Trading`,
    ``,
    escapeHtml(title),
    ``,
    body,
    textAction,
    `---`,
    `High Frequency Trading LLC`,
    `Educational content only. Not financial advice.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}

export function welcomeEmail(params: {
  name: string;
  loginUrl: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Welcome to High Frequency VIP",
    body: `Welcome to High Frequency Trading, ${escapeHtml(params.name)}. Your membership is active and your payment was successful. Log in to your dashboard to access the 3ZS strategy, live trade alerts, daily market analysis, and the High Frequency VIP private community.`,
    action: true,
    actionUrl: params.loginUrl,
    actionLabel: "Open Dashboard",
    footer: `<p style="margin:0;font-size:13px;color:#888;">Questions? Contact us at hello@highfrequency.vip.</p>`,
  });
  return {
    subject: "Welcome to High Frequency VIP — your membership is active",
    html: shell.html,
    text: shell.text,
  };
}

export function welcomeSms(params: { name: string }): { body: string } {
  return {
    body: `Hi ${escapeHtml(params.name)}, welcome to High Frequency VIP. Your membership is active and your payment was successful. Log in at https://highfrequency.vip/dashboard. Reply STOP to opt out of texts.`,
  };
}

export function tempPasswordSms(params: {
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}): { body: string } {
  return {
    body: `🎯 Welcome to HFT, ${escapeHtml(params.name)}! Your membership is ACTIVE. 🔥\n\nLogin: ${escapeHtml(params.email)}\n\nTemporary password: ${escapeHtml(params.tempPassword)}\n\nLog in: ${escapeHtml(params.loginUrl)}\n\nYou'll be asked to create your own password after signing in.\n\nReply STOP to opt out.`,
  };
}

export function adminNewMemberEmail(params: {
  adminEmail: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string | null;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "New member signed up",
    body: `A new member just joined High Frequency Trading.\n\nName: ${escapeHtml(params.memberName)}\nEmail: ${escapeHtml(params.memberEmail)}\nPhone: ${escapeHtml(params.memberPhone ?? "—")}`,
    action: true,
    actionUrl: "/admin/users",
    actionLabel: "View Members",
    footer: `<p style="margin:0;font-size:13px;color:#888;">Sent automatically when a paid checkout completes.</p>`,
  });
  return {
    subject: "HFT: New member signed up",
    html: shell.html,
    text: shell.text,
  };
}

export function adminNewMemberSms(params: {
  memberName: string;
}): { body: string } {
  return {
    body: `💰 New HFT member: ${escapeHtml(params.memberName)} just joined. Membership active + payment successful.`,
  };
}

export function inviteEmail(params: {
  inviteUrl: string;
  kind: "admin" | "member" | "affiliate";
  inviterName?: string | null;
}): { subject: string; html: string; text: string } {
  const kindLabel = params.kind === "admin"
    ? "staff access"
    : params.kind === "affiliate"
      ? "affiliate access"
      : "member access";
  const shell = emailShell({
    title: `You're invited to High Frequency VIP — ${kindLabel}`,
    body: `${params.inviterName ? escapeHtml(params.inviterName) + " " : ""}has invited you to join High Frequency Trading with ${kindLabel}.\n\nSet your password and get started:`,
    action: true,
    actionUrl: params.inviteUrl,
    actionLabel: "Create Password & Activate Account",
    footer: `<p style="margin:0;font-size:13px;color:#888;">This link works once and expires in 14 days.</p>`,
  });
  return {
    subject: `High Frequency VIP invitation: ${kindLabel}`,
    html: shell.html,
    text: shell.text,
  };
}



export function complimentaryExistingUserEmail(params: {
  signInUrl: string;
  inviterName?: string | null;
  pending?: boolean;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: params.pending ? "Activate your complimentary High Frequency VIP access" : "Your High Frequency VIP access is ready",
    body: params.pending
      ? "You have been invited to activate complimentary High Frequency VIP access. Redeem this invitation, then sign in with your existing password. Your password will not be replaced."
      : `${params.inviterName ? escapeHtml(params.inviterName) + " " : ""}has granted you complimentary High Frequency VIP access.\n\nUse your existing password to sign in — no password change is required.`,
    action: true,
    actionUrl: params.signInUrl,
    actionLabel: params.pending ? "Activate Complimentary Access" : "Sign In",
    footer: `<p style="margin:0;font-size:13px;color:#888;">If you need help signing in, use Forgot Password on the sign-in page.</p>`,
  });
  return {
    subject: params.pending ? "Activate your complimentary High Frequency VIP access" : "High Frequency VIP access is ready — sign in",
    html: shell.html,
    text: shell.text,
  };
}

export function complimentaryExistingUserSms(params: { signInUrl: string; pending?: boolean }): { body: string } {
  return { body: params.pending ? `High Frequency VIP: Activate your complimentary access, then sign in with your existing password: ${params.signInUrl} Reply STOP to opt out.` : `High Frequency VIP: Complimentary access is ready. Sign in with your existing password: ${params.signInUrl} Reply STOP to opt out.` };
}

export function inviteSms(params: { inviteUrl: string }): { body: string } {
  return {
    body: `You're invited to High Frequency VIP. Create your password and activate your account and set your password: ${params.inviteUrl} This link works once and expires in 14 days. Reply STOP to opt out.`,
  };
}

export function paymentFailedEmail(params: {
  name: string;
  amount: string;
  retryUrl: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Payment failed — action needed",
    body: `Hey ${escapeHtml(params.name)}, your monthly HFT membership payment of ${escapeHtml(params.amount)} didn't go through. Your access may be interrupted. Please update your payment method.`,
    action: true,
    actionUrl: params.retryUrl,
    actionLabel: "Update Payment",
    footer: `<p style="margin:0;font-size:13px;color:#888;">Questions? Contact hello@highfrequency.vip.</p>`,
  });
  return {
    subject: "HFT: Payment failed — please update your card",
    html: shell.html,
    text: shell.text,
  };
}

export function paymentFailedSms(params: { name: string; amount: string }): { body: string } {
  return {
    body: `Hi ${escapeHtml(params.name)}, your HFT membership payment of ${escapeHtml(params.amount)} failed. Update your card at https://highfrequency.vip/account to keep access. Reply STOP to opt out.`,
  };
}

export function passwordResetEmail(params: {
  name: string;
  resetUrl: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Reset your password",
    body: `Hey ${escapeHtml(params.name)}, we received a request to reset your High Frequency Trading password.\n\nIf you made this request, use the secure link below to choose a new password. This link expires in 1 hour and can be used only once.\n\nIf you did not request a password reset, you can ignore this email — your password will not change.`,
    action: true,
    actionUrl: params.resetUrl,
    actionLabel: "Reset Password",
    footer: `<p style="margin:0;font-size:13px;color:#888;">For your security, this link expires soon and works only once.</p>`,
  });
  return {
    subject: "Reset your HFT password",
    html: shell.html,
    text: shell.text,
  };
}

export function passwordSetupInviteEmail(params: {
  name: string;
  setupUrl: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Set up your HFT password",
    body: `Hey ${escapeHtml(params.name)}, use the secure link below to create your password and activate your High Frequency Trading account.\n\nThis link expires in 1 hour and can be used only once.`,
    action: true,
    actionUrl: params.setupUrl,
    actionLabel: "Create Password & Activate Account",
    footer: `<p style="margin:0;font-size:13px;color:#888;">If you did not expect this email, you can ignore it.</p>`,
  });
  return {
    subject: "Set up your HFT password",
    html: shell.html,
    text: shell.text,
  };
}

export function subscriptionCanceledEmail(params: {
  name: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Membership canceled",
    body: `Hey ${escapeHtml(params.name)}, your HFT membership has been canceled. You're welcome back anytime — just resubscribe to regain access to the 3ZS strategy and community.`,
    action: true,
    actionUrl: "/join",
    actionLabel: "Rejoin",
    footer: `<p style="margin:0;font-size:13px;color:#888;">Questions? Contact hello@highfrequency.vip.</p>`,
  });
  return {
    subject: "HFT: Your membership has been canceled",
    html: shell.html,
    text: shell.text,
  };
}

export function affiliateInviteEmail(params: {
  inviteUrl: string;
  inviterName?: string | null;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Join HFT as an affiliate",
    body: `${params.inviterName ? escapeHtml(params.inviterName) + " " : ""}invites you to become an HFT affiliate. Share your referral link and earn a commission on every member who joins through you.\n\nAccept your invite:`,
    action: true,
    actionUrl: params.inviteUrl,
    actionLabel: "Set Up Affiliate Account",
    footer: `<p style="margin:0;font-size:13px;color:#888;">This link works once and expires in 14 days.</p>`,
  });
  return {
    subject: "HFT: Affiliate invitation",
    html: shell.html,
    text: shell.text,
  };
}

export function affiliatePayoutEmail(params: {
  name: string;
  amount: string;
}): { subject: string; html: string; text: string } {
  const shell = emailShell({
    title: "Affiliate payout sent",
    body: `Hey ${escapeHtml(params.name)}, your affiliate payout of ${escapeHtml(params.amount)} has been sent to your connected Stripe account. It should arrive shortly.`,
    footer: `<p style="margin:0;font-size:13px;color:#888;">Track your earnings in your HFT affiliate dashboard.</p>`,
  });
  return {
    subject: "HFT: Affiliate payout sent",
    html: shell.html,
    text: shell.text,
  };
}

export function affiliatePayoutSms(params: { name: string; amount: string }): { body: string } {
  return {
    body: `Hi ${escapeHtml(params.name)}, your HFT affiliate payout of ${escapeHtml(params.amount)} has been sent. Check your Stripe connected account. Reply STOP to opt out.`,
  };
}

/** Customer consultation confirmation email. */
export function consultationConfirmedEmail(params: {
  customerName: string;
  consultationType: string;
  appointmentAt: string; // ISO-8601 in America/Chicago
  durationMin: number;
  timezone: string;
  amountCents: number;
}): { subject: string; html: string; text: string } {
  const dollars = (params.amountCents / 100).toFixed(2);
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: params.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(params.appointmentAt));

  const shell = emailShell({
    title: "Your HFT consultation is booked 🎯",
    body: `Hey ${escapeHtml(params.customerName)}, your private consultation with Demi is confirmed.\n\nConsultation: ${escapeHtml(params.consultationType)}\nDuration: ${params.durationMin} minutes\nDate & time: ${local} (${escapeHtml(params.timezone)})\nAmount paid: $${dollars}\n\nYour payment was successful and your appointment is reserved. We&apos;ll see you then.\n\nThis is educational content only — no trading results or income are promised.`,
    action: false,
    footer: `<p style="margin:0;font-size:13px;color:#888;">Questions? Contact us at hello@highfrequency.vip.</p>`,
  });
  return {
    subject: "Your HFT consultation is booked 🎯",
    html: shell.html,
    text: shell.text,
  };
}

/** Admin notification email for a new booking. */
export function consultationAdminEmail(params: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  consultationType: string;
  appointmentAt: string; // ISO-8601 in America/Chicago
  durationMin: number;
  timezone: string;
  amountCents: number;
  questions: Record<string, string>;
  adminBookingUrl: string;
}): { subject: string; html: string; text: string } {
  const dollars = (params.amountCents / 100).toFixed(2);
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: params.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(params.appointmentAt));

  const q = Object.entries(params.questions)
    .map(([k, v]) => `• ${escapeHtml(k)}: ${escapeHtml(v)}`)
    .join("\n");

  const shell = emailShell({
    title: "New HFT consultation booked 💰",
    body: `A new consultation has been booked and paid.\n\nCustomer: ${escapeHtml(params.customerName)}\nEmail: ${escapeHtml(params.customerEmail)}\nPhone: ${escapeHtml(params.customerPhone)}\nConsultation: ${escapeHtml(params.consultationType)}\nDuration: ${params.durationMin} minutes\nDate & time: ${local} (${escapeHtml(params.timezone)})\nAmount paid: $${dollars}\n\nQuestionnaire answers:\n${q}\n\nView appointment: ${escapeHtml(params.adminBookingUrl)}`,
    action: true,
    actionUrl: params.adminBookingUrl,
    actionLabel: "View Appointment",
    footer: `<p style="margin:0;font-size:13px;color:#888;">Sent automatically when a booking payment is confirmed.</p>`,
  });
  return {
    subject: "New HFT consultation booked 💰",
    html: shell.html,
    text: shell.text,
  };
}

/** Customer consultation confirmation SMS (template only — not wired yet). */
export function consultationConfirmedSms(params: {
  customerName: string;
  consultationType: string;
  appointmentAt: string;
  durationMin: number;
  timezone: string;
}): { body: string } {
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: params.timezone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(params.appointmentAt));
  return {
    body: `🎯 Your HFT consultation with Demi is confirmed for ${local} CT. Duration: ${params.durationMin} minutes. Reply STOP to opt out.`,
  };
}

/** Admin consultation booked SMS (template only — not wired yet). */
export function consultationAdminSms(params: {
  customerName: string;
  amountCents: number;
  durationMin: number;
  appointmentAt: string;
  timezone: string;
  adminBookingUrl: string;
}): { body: string } {
  const dollars = (params.amountCents / 100).toFixed(2);
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: params.timezone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(params.appointmentAt));
  return {
    body: `💰 New HFT consultation booked! ${escapeHtml(params.customerName)} paid $${dollars} for a ${params.durationMin}-minute call. ${local} CT. View appointment: ${escapeHtml(params.adminBookingUrl)} Reply STOP to opt out.`,
  };
}


/** Secure complimentary setup/access notice. No passwords or student financial data. */
export function academyComplimentaryEmail(params: { url: string; access: string; existing: boolean; pendingExisting?: boolean; invitationExpiresAt?: string | null }) {
  const setup = params.pendingExisting ? "Activate your complimentary HFT Academy access using this secure invitation, then sign in with your existing account. Your existing password has not been changed." : params.existing
    ? "Your complimentary HFT Academy access is active. Sign in with your existing account. If you need help signing in, use Forgot Password; your existing password has not been changed."
    : "You have been invited to complimentary HFT Academy access. Follow the secure invitation to activate your account and choose your own password.";
  const expiry = params.invitationExpiresAt ? `\nActivation link expires: ${params.invitationExpiresAt.slice(0,10)}. This is separate from your Academy access duration.` : "";
  return { subject: params.existing ? "Your complimentary HFT Academy access is ready" : "Activate your complimentary HFT Academy access", ...emailShell({title:"Complimentary HFT Academy access",body:`${setup}\n\n${params.access}${expiry}`,action:true,actionUrl:params.url,actionLabel:params.existing&&!params.pendingExisting?"Sign in to HFT Academy":"Activate your account",footer:"This message contains a secure account link. Do not forward it to others."}) };
}
export function academyComplimentarySms(params: { url: string; access: string; existing: boolean; pendingExisting?: boolean }) {
  return { body: `HFT Academy: Complimentary access. ${params.access} ${params.pendingExisting ? "Activate access, then sign in with your existing account:" : params.existing ? "Sign in with your existing account:" : "Activate your account and choose your password:"} ${params.url} Reply STOP to opt out.` };
}
