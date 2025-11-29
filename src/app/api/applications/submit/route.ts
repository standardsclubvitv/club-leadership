import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyIdToken } from '@/lib/firebase/admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
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

    const userId = decodedToken.uid;
    const db = getAdminFirestore();

    // Parse request body
    const body = await request.json();
    const { profile, positions } = body;

    // Validate required fields
    if (!profile || !positions || !Array.isArray(positions)) {
      return NextResponse.json(
        { error: 'Invalid request body - profile and positions are required' },
        { status: 400 }
      );
    }

    // Validate registration number
    if (!profile.regNumber || typeof profile.regNumber !== 'string') {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    // Use registration number as application ID (sanitize for Firestore)
    const applicationId = profile.regNumber.trim().toUpperCase();

    // Check if application with this reg number already exists
    const existingApp = await db
      .collection('applications')
      .doc(applicationId)
      .get();

    if (existingApp.exists) {
      return NextResponse.json(
        { error: 'An application with this registration number already exists' },
        { status: 400 }
      );
    }

    // Also check if user (by userId) already has an application
    const existingUserApps = await db
      .collection('applications')
      .where('userId', '==', userId)
      .get();

    if (!existingUserApps.empty) {
      return NextResponse.json(
        { error: 'You have already submitted an application' },
        { status: 400 }
      );
    }

    // Create the application with registration number as document ID
    const submittedAt = Timestamp.now();
    const applicationData = {
      userId,
      profile,
      positions,
      submittedAt,
      status: 'pending',
      emailStatus: {
        sent: false,
        attempts: 0,
        error: null,
      },
    };

    await db.collection('applications').doc(applicationId).set(applicationData);

    // Update user's hasApplied flag
    await db.collection('users').doc(userId).update({
      hasApplied: true,
    });

    // Prepare email data
    const positionNames = positions.map((p: { positionName: string }) => p.positionName);

    // Send confirmation email and update database with result
    let emailSent = false;
    let emailError: string | null = null;

    try {
      const emailResult = await sendConfirmationEmail({
        to: profile.email,
        name: profile.fullName,
        positions: positionNames,
        applicationId,
        submittedAt: submittedAt.toDate(),
      });

      if (emailResult.success) {
        emailSent = true;
        console.log(`Confirmation email sent successfully to ${profile.email}`);
      } else {
        emailError = emailResult.error || 'Unknown error';
        console.error(`Failed to send confirmation email: ${emailError}`);
      }
    } catch (error) {
      emailError = error instanceof Error ? error.message : 'Email sending failed';
      console.error('Email sending error:', error);
    }

    // Update the application with email status
    await db.collection('applications').doc(applicationId).update({
      emailStatus: {
        sent: emailSent,
        sentAt: emailSent ? Timestamp.now() : null,
        error: emailError,
        attempts: 1,
      },
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
      emailSent,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
