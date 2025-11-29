import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyIdToken } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { sendConfirmationEmail } from '@/lib/email/mailer';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    let decodedToken;
    try {
      decodedToken = await verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();

    // Get the application
    const appDoc = await db.collection('applications').doc(applicationId).get();

    if (!appDoc.exists) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const appData = appDoc.data();
    
    if (!appData) {
      return NextResponse.json(
        { error: 'Application data is empty' },
        { status: 400 }
      );
    }

    // Check if user owns this application or is admin (add admin check as needed)
    if (appData.userId !== decodedToken.uid) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not own this application' },
        { status: 403 }
      );
    }

    // Check if email was already sent
    if (appData.emailStatus?.sent) {
      return NextResponse.json(
        { error: 'Email was already sent successfully' },
        { status: 400 }
      );
    }

    // Get current attempt count
    const currentAttempts = appData.emailStatus?.attempts || 0;

    // Limit retry attempts
    if (currentAttempts >= 5) {
      return NextResponse.json(
        { error: 'Maximum retry attempts reached. Please contact support.' },
        { status: 400 }
      );
    }

    // Prepare email data
    const positionNames = appData.positions.map((p: { positionName: string }) => p.positionName);

    // Send confirmation email
    let emailSent = false;
    let emailError: string | null = null;

    try {
      const emailResult = await sendConfirmationEmail({
        to: appData.profile.email,
        name: appData.profile.fullName,
        positions: positionNames,
        applicationId,
        submittedAt: appData.submittedAt.toDate(),
      });

      if (emailResult.success) {
        emailSent = true;
        console.log(`Retry: Confirmation email sent successfully to ${appData.profile.email}`);
      } else {
        emailError = emailResult.error || 'Unknown error';
        console.error(`Retry: Failed to send confirmation email: ${emailError}`);
      }
    } catch (error) {
      emailError = error instanceof Error ? error.message : 'Email sending failed';
      console.error('Retry: Email sending error:', error);
    }

    // Update the application with new email status
    await db.collection('applications').doc(applicationId).update({
      emailStatus: {
        sent: emailSent,
        sentAt: emailSent ? Timestamp.now() : null,
        error: emailError,
        attempts: currentAttempts + 1,
      },
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully',
      });
    } else {
      return NextResponse.json(
        { error: emailError || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email retry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
