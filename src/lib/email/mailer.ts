import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 10,
});

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';
const SUPPORT_EMAIL = 'standardsclub@vit.ac.in';
const CC_EMAIL = 'support@standardsvit.live';
const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/standardsclubvit/',
  linkedin: 'https://www.linkedin.com/in/standards-club-vit-b512a829a/',
  youtube: 'https://www.youtube.com/@IndianStandard',
  website: 'https://www.standardsvit.live/',
};

interface SendConfirmationEmailParams {
  to: string;
  name: string;
  positions: string[];
  applicationId: string;
  submittedAt: Date;
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
};

export const sendConfirmationEmail = async ({
  to,
  name,
  positions,
  applicationId,
  submittedAt,
}: SendConfirmationEmailParams): Promise<{ success: boolean; error?: string }> => {
  const positionsList = positions.map((p) => `• ${p}`).join('\n');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - BIS Standards Club VIT</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 40px 30px; text-align: center;">
        <img src="${CLUB_LOGO_URL}" alt="BIS Standards Club VIT" width="80" height="80" style="display: block; margin: 0 auto 15px auto; border-radius: 12px; background-color: #ffffff; padding: 8px;" />
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">BIS Standards Club VIT</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Board Enrollment 2025</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1E40AF; margin: 0 0 20px 0; font-size: 24px;">Application Received! 🎉</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Dear <strong>${name}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for applying to join the BIS Standards Club VIT Board! We have successfully received your application.
        </p>
        
        <div style="background-color: #F3F4F6; border-radius: 12px; padding: 25px; margin: 25px 0;">
          <h3 style="color: #1E40AF; margin: 0 0 15px 0; font-size: 18px;">Position(s) Applied For:</h3>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
            ${positions.map((p) => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background-color: #EFF6FF; border-left: 4px solid #1E40AF; padding: 20px; margin: 25px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0;">
            <strong>Application ID:</strong> ${applicationId}<br>
            <strong>Submitted On:</strong> ${formatDate(submittedAt)}
          </p>
        </div>
        
        <h3 style="color: #1E40AF; margin: 25px 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ol style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Our team will review your application carefully</li>
          <li>Shortlisted candidates will be contacted for interviews</li>
          <li>Final results will be announced by the deadline</li>
        </ol>
        
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          If you have any questions, feel free to reach out to us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #1E40AF; text-decoration: none;">${SUPPORT_EMAIL}</a> or on our social media channels.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1E293B; padding: 30px; text-align: center;">
        <img src="${CLUB_LOGO_URL}" alt="BIS Standards Club VIT" width="50" height="50" style="display: block; margin: 0 auto 15px auto; border-radius: 8px; background-color: #ffffff; padding: 5px;" />
        <p style="color: #94A3B8; font-size: 14px; margin: 0 0 15px 0;">Connect with us</p>
        <p style="margin: 0 0 10px 0;">
          <a href="${SOCIAL_LINKS.linkedin}" style="color: #3B82F6; text-decoration: none; margin: 0 10px;">LinkedIn</a>
          <a href="${SOCIAL_LINKS.instagram}" style="color: #3B82F6; text-decoration: none; margin: 0 10px;">Instagram</a>
          <a href="${SOCIAL_LINKS.youtube}" style="color: #3B82F6; text-decoration: none; margin: 0 10px;">YouTube</a>
          <a href="${SOCIAL_LINKS.website}" style="color: #3B82F6; text-decoration: none; margin: 0 10px;">Website</a>
        </p>
        <p style="margin: 0 0 15px 0;">
          <a href="mailto:${SUPPORT_EMAIL}" style="color: #3B82F6; text-decoration: none;">${SUPPORT_EMAIL}</a>
        </p>
        <p style="color: #64748B; font-size: 12px; margin: 10px 0 0 0;">
          © 2025 BIS Standards Club VIT. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Dear ${name},

Thank you for applying to join the BIS Standards Club VIT Board!

We have successfully received your application for the following position(s):
${positionsList}

Application Details:
- Application ID: ${applicationId}
- Submitted On: ${formatDate(submittedAt)}

What's Next?
1. Our team will review your application carefully
2. Shortlisted candidates will be contacted for interviews
3. Final results will be announced by the deadline

If you have any questions, feel free to reach out to us at ${SUPPORT_EMAIL} or on our social media channels.

Best regards,
BIS Standards Club VIT
  `;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'BIS Standards Club VIT <noreply@bisclub.com>',
        to,
        cc: CC_EMAIL,
        subject: 'Application Received - BIS Standards Club VIT Board Enrollment',
        text: textContent,
        html: htmlContent,
      });

      return { success: true };
    } catch (error) {
      lastError = error as Error;
      console.error(`Email attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('All email attempts failed:', lastError);
  return { 
    success: false, 
    error: lastError?.message || 'Failed to send email after multiple attempts' 
  };
};

export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email connection verification failed:', error);
    return false;
  }
};
