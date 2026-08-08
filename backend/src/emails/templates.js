/**
 * HTML email templates for NexaInvest.
 * All templates share a common dark-glass wrapper consistent with the UI.
 */

const BASE = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NexaInvest</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0f; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 36px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .logo-text span { background: linear-gradient(135deg, #6366f1, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .body { padding: 40px; }
    .greeting { font-size: 24px; font-weight: 700; color: #f1f5f9; margin-bottom: 12px; }
    .text { font-size: 15px; line-height: 1.7; color: #94a3b8; margin-bottom: 16px; }
    .highlight { color: #e2e8f0; font-weight: 600; }
    .card { background: #1e1e2e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .card-row:last-child { border-bottom: none; }
    .card-label { font-size: 13px; color: #64748b; }
    .card-value { font-size: 14px; font-weight: 600; color: #e2e8f0; }
    .card-value.green { color: #4ade80; }
    .card-value.purple { color: #a78bfa; }
    .otp-box { background: linear-gradient(135deg, #1e1b4b, #0f0f1a); border: 2px solid #6366f1; border-radius: 20px; padding: 32px; text-align: center; margin: 28px 0; }
    .otp-label { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
    .otp-code { font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #a78bfa; font-family: 'Courier New', monospace; }
    .otp-expiry { font-size: 12px; color: #475569; margin-top: 12px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 14px; text-decoration: none; margin: 24px 0; }
    .steps { counter-reset: step-counter; list-style: none; }
    .step { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .step:last-child { border-bottom: none; }
    .step-num { width: 32px; height: 32px; min-width: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; }
    .step-content { flex: 1; }
    .step-title { font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 4px; }
    .step-desc { font-size: 13px; color: #64748b; line-height: 1.6; }
    .referral-box { background: linear-gradient(135deg, #1e1b4b, #0f172a); border: 1px solid #6366f1; border-radius: 16px; padding: 20px 24px; text-align: center; margin: 24px 0; }
    .referral-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .referral-code { font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #a78bfa; font-family: 'Courier New', monospace; }
    .footer { padding: 28px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
    .footer-text { font-size: 12px; color: #334155; line-height: 1.8; }
    .footer-text a { color: #6366f1; text-decoration: none; }
    .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 20px 0; }
    .success-icon { font-size: 48px; text-align: center; margin-bottom: 16px; }
    .badge { display: inline-block; background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); border-radius: 100px; padding: 4px 14px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <span class="logo-text">Nexa<span>Invest</span></span>
      </div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p class="footer-text">
        © ${new Date().getFullYear()} NexaInvest. All rights reserved.<br/>
        Investments are subject to market risk. Please read all scheme-related documents carefully.<br/>
        <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a> · <a href="#">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// ─── 1. Welcome + Referral Code email (sent on registration) ──────────────────
export function welcomeTemplate({ fullName, referralCode, email }) {
  return BASE(`
    <div class="success-icon">🎉</div>
    <h1 class="greeting">Welcome to NexaInvest, ${fullName.split(" ")[0]}!</h1>
    <p class="text">Your account has been created successfully. You're now part of a growing community of investors earning automated daily ROI.</p>

    <div class="referral-box">
      <div class="referral-label">Your Unique Referral Code</div>
      <div class="referral-code">${referralCode}</div>
      <p style="font-size:12px;color:#475569;margin-top:10px;">Share this code to earn level income on your referrals' investments</p>
    </div>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Registered Email</span>
        <span class="card-value">${email}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Account Status</span>
        <span class="card-value green">Active ✓</span>
      </div>
      <div class="card-row">
        <span class="card-label">Referral Levels</span>
        <span class="card-value purple">Up to 4 levels</span>
      </div>
    </div>

    <p class="text" style="font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:16px;">🚀 Get started in 3 steps:</p>
    <ul class="steps">
      <li class="step">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Choose an Investment Plan</div>
          <div class="step-desc">Starter (1% daily), Professional (1.5% daily), or Enterprise (1.8% daily). Pick what suits your goals.</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Make Your First Investment</div>
          <div class="step-desc">Invest securely via Razorpay. Your plan activates immediately after payment confirmation.</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Earn Daily ROI</div>
          <div class="step-desc">Every midnight, our scheduler credits your ROI automatically. Track everything from your dashboard.</div>
        </div>
      </li>
    </ul>

    <div style="text-align:center">
      <a href="http://localhost:5173/dashboard" class="btn">Go to Dashboard →</a>
    </div>
  `);
}

// ─── 2. Email Verification OTP ────────────────────────────────────────────────
export function emailVerificationTemplate({ fullName, otp }) {
  return BASE(`
    <h1 class="greeting">Verify your email</h1>
    <p class="text">Hi <span class="highlight">${fullName}</span>, use the code below to verify your email address. This code expires in <span class="highlight">10 minutes</span>.</p>

    <div class="otp-box">
      <div class="otp-label">Verification Code</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">⏱ Expires in 10 minutes</div>
    </div>

    <p class="text">If you didn't create a NexaInvest account, you can safely ignore this email.</p>
    <div class="divider"></div>
    <p style="font-size:12px;color:#475569;">For security, never share this code with anyone. NexaInvest will never ask for your OTP.</p>
  `);
}

// ─── 3. Payment / Investment Confirmation ─────────────────────────────────────
export function paymentConfirmationTemplate({ fullName, plan, amount, dailyRoi, startDate, endDate, paymentId, referralCode }) {
  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const dailyCredit = fmt((Number(amount) * Number(dailyRoi)) / 100);
  const expectedTotal = fmt((Number(amount) * Number(dailyRoi) / 100) * getDurationDays(plan) + Number(amount));

  return BASE(`
    <div class="success-icon">✅</div>
    <span class="badge">Payment Successful</span>
    <h1 class="greeting" style="margin-top:16px;">Investment Activated!</h1>
    <p class="text">Hi <span class="highlight">${fullName}</span>, your payment has been verified and your <span class="highlight">${plan}</span> investment plan is now active. Daily ROI will be credited to your wallet every midnight.</p>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Plan</span>
        <span class="card-value purple">${plan}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Amount Invested</span>
        <span class="card-value">${fmt(amount)}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Daily ROI Rate</span>
        <span class="card-value green">${dailyRoi}% / day</span>
      </div>
      <div class="card-row">
        <span class="card-label">Daily Credit</span>
        <span class="card-value green">${dailyCredit}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Start Date</span>
        <span class="card-value">${new Date(startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Maturity Date</span>
        <span class="card-value">${new Date(endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Expected Returns</span>
        <span class="card-value green">${expectedTotal}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Payment ID</span>
        <span class="card-value" style="font-family:monospace;font-size:12px;">${paymentId}</span>
      </div>
    </div>

    <p class="text" style="font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:16px;">💡 What happens next:</p>
    <ul class="steps">
      <li class="step">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Daily ROI at Midnight</div>
          <div class="step-desc">Every day at 12:00 AM, ${dailyCredit} will be credited automatically to your wallet.</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Invite & Earn More</div>
          <div class="step-desc">Share your referral code <strong style="color:#a78bfa">${referralCode}</strong> to earn level income on your downline's investments.</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Track in Dashboard</div>
          <div class="step-desc">Monitor ROI history, wallet balance, and referral earnings in real time from your dashboard.</div>
        </div>
      </li>
    </ul>

    <div style="text-align:center">
      <a href="http://localhost:5173/dashboard" class="btn">View Dashboard →</a>
    </div>
  `);
}

// ─── helper ───────────────────────────────────────────────────────────────────
function getDurationDays(plan) {
  const map = { Starter: 90, Professional: 120, Enterprise: 180 };
  return map[plan] ?? 90;
}

// ─── 4. Newsletter subscription confirmation ──────────────────────────────────
export function subscribeConfirmTemplate({ email }) {
  return BASE(`
    <div class="success-icon">📬</div>
    <h1 class="greeting">You're subscribed!</h1>
    <p class="text">Thanks for joining <span class="highlight">30,000+ investors</span> who receive NexaInvest market insights and product updates.</p>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Subscribed Email</span>
        <span class="card-value">${email}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Updates</span>
        <span class="card-value green">Market insights · Product news · ROI tips</span>
      </div>
      <div class="card-row">
        <span class="card-label">Frequency</span>
        <span class="card-value">Weekly digest</span>
      </div>
    </div>

    <p class="text" style="font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:16px;">🚀 While you're here — start investing:</p>
    <ul class="steps">
      <li class="step">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Starter Plan — 1% daily ROI</div>
          <div class="step-desc">Min. ₹5,000 · 90-day duration · Level 1 referral income</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Professional Plan — 1.5% daily ROI</div>
          <div class="step-desc">Min. ₹50,000 · 120-day duration · Level 1–3 referral income</div>
        </div>
      </li>
      <li class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Enterprise Plan — 1.8% daily ROI</div>
          <div class="step-desc">Min. ₹5,00,000 · 180-day duration · Full 4-level referral network</div>
        </div>
      </li>
    </ul>

    <div style="text-align:center">
      <a href="http://localhost:5173/#plans" class="btn">View Investment Plans →</a>
    </div>

    <div class="divider"></div>
    <p style="font-size:11px;color:#334155;text-align:center;">
      Don't want these emails? <a href="#" style="color:#6366f1;">Unsubscribe</a>
    </p>
  `);
}
