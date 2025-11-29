'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { ApplicationDetail } from '@/components/admin';
import { LoadingSpinner, useToast, Alert } from '@/components/ui';
import { Application } from '@/types';
import { auth } from '@/lib/firebase/config';

function ApplicationDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError('Not authenticated');
          return;
        }

        const token = await currentUser.getIdToken();

        const response = await fetch(`/api/admin/applications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Application not found');
          } else {
            throw new Error('Failed to fetch application');
          }
          return;
        }

        const data = await response.json();
        setApplication({
          ...data.application,
          submittedAt: new Date(data.application.submittedAt),
        });
      } catch (error) {
        console.error('Error fetching application:', error);
        setError('Failed to load application');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleUpdateStatus = async (status: Application['status'], notes?: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      setApplication((prev) =>
        prev ? { ...prev, status, adminNotes: notes } : null
      );

      addToast({
        type: 'success',
        title: 'Updated',
        message: 'Application status updated successfully',
      });
    } catch (error) {
      console.error('Error updating application:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update application',
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert type="error" title="Error">
          {error}
        </Alert>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert type="error" title="Not Found">
          Application not found
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicationDetail application={application} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute requireAdmin>
      <ApplicationDetailContent params={params} />
    </ProtectedRoute>
  );
}
