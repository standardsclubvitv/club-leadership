import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyIdToken } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
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

    // Check if user is admin
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const position = searchParams.get('position');
    const status = searchParams.get('status');

    // Build query
    let query = db.collection('applications').orderBy('submittedAt', 'desc');

    // Get all applications (we'll filter on the client side for complex queries)
    const snapshot = await query.get();

    let applications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        profile: data.profile,
        positions: data.positions,
        submittedAt: data.submittedAt?.toDate()?.toISOString() || new Date().toISOString(),
        status: data.status,
        adminNotes: data.adminNotes,
      };
    });

    // Filter by position if specified
    if (position) {
      applications = applications.filter((app) =>
        app.positions.some((p: { positionId: string }) => p.positionId === position)
      );
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      applications = applications.filter((app) => app.status === status);
    }

    // Apply pagination
    const paginatedApplications = applications.slice(offset, offset + limit);

    // Get statistics
    const stats = {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      reviewed: applications.filter((a) => a.status === 'reviewed').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };

    return NextResponse.json({
      applications: paginatedApplications,
      pagination: {
        total: applications.length,
        limit,
        offset,
        hasMore: offset + limit < applications.length,
      },
      stats,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
