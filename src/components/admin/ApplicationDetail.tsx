'use client';

import { useState } from 'react';
import { Application } from '@/types';
import { formatDate } from '@/lib/utils/helpers';
import { Button, Card, CardContent, Textarea } from '@/components/ui';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Hash,
  Calendar,
  FileText,
  Save,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ApplicationDetailProps {
  application: Application;
  onUpdateStatus: (status: Application['status'], notes?: string) => Promise<void>;
}

export default function ApplicationDetail({
  application,
  onUpdateStatus,
}: ApplicationDetailProps) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.adminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await onUpdateStatus(status, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (s: Application['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      shortlisted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[s];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.profile.fullName}
            </h1>
            <p className="text-gray-500">Application ID: {application.id}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
            application.status
          )}`}
        >
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="space-y-4">
                <InfoItem
                  icon={<User className="w-4 h-4" />}
                  label="Full Name"
                  value={application.profile.fullName}
                />
                <InfoItem
                  icon={<Hash className="w-4 h-4" />}
                  label="Registration No"
                  value={application.profile.regNumber}
                />
                <InfoItem
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={application.profile.email}
                />
                <InfoItem
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={application.profile.phone}
                />
                <InfoItem
                  icon={<Building2 className="w-4 h-4" />}
                  label="Branch"
                  value={application.profile.branch}
                />
                <InfoItem
                  icon={<GraduationCap className="w-4 h-4" />}
                  label="Year"
                  value={application.profile.year}
                />
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Submitted"
                  value={formatDate(application.submittedAt)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Update Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Application['status'])}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <Textarea
                  label="Admin Notes"
                  placeholder="Add notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleUpdate}
                  isLoading={isUpdating}
                  className="w-full"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Position Applications */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Position Applications</h2>
          {application.positions.map((pos, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{pos.positionName}</h3>
                </div>
                <div className="space-y-6">
                  {pos.answers.map((answer, ansIdx) => (
                    <div key={ansIdx}>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Q{ansIdx + 1}: {answer.question}
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm whitespace-pre-wrap">
                        {answer.answer || 'No answer provided'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
