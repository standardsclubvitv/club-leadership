import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email/mailer';

export async function POST(request: NextRequest) {
  try {
    // Simple authentication check - this endpoint should only be called internally
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to, name, positions, applicationId, submittedAt } = body;

    if (!to || !name || !positions || !applicationId || !submittedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendConfirmationEmail({
      to,
      name,
      positions,
      applicationId,
      submittedAt: new Date(submittedAt),
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
