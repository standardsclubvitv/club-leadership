'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, ProtectedRoute } from '@/components/auth';
import { ApplicationsTable } from '@/components/admin';
import { Button, Card, CardContent, LoadingSpinner, useToast } from '@/components/ui';
import { Application } from '@/types';
import { auth } from '@/lib/firebase/config';
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Home,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
} from 'lucide-react';

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';

interface Stats {
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  rejected: number;
}

function AdminContent() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/admin/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(
        data.applications.map((app: Application & { submittedAt: string }) => ({
          ...app,
          submittedAt: new Date(app.submittedAt),
        }))
      );
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching applications:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch applications',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchApplications();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
    setIsRefreshing(false);
    addToast({
      type: 'success',
      title: 'Refreshed',
      message: 'Applications data updated',
    });
  };

  const handleExport = () => {
    // Generate CSV
    const headers = ['Name', 'Reg No', 'Email', 'Phone', 'Branch', 'Year', 'Positions', 'Status', 'Submitted'];
    const rows = applications.map((app) => [
      app.profile.fullName,
      app.profile.regNumber,
      app.profile.email,
      app.profile.phone,
      app.profile.branch,
      app.profile.year,
      app.positions.map((p) => p.positionName).join('; '),
      app.status,
      app.submittedAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Exported',
      message: 'Applications exported to CSV',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Applications', value: stats?.total || 0, icon: FileText, color: 'blue' },
    { label: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'yellow' },
    { label: 'Reviewed', value: stats?.reviewed || 0, icon: Users, color: 'purple' },
    { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: CheckCircle, color: 'green' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 shadow-sm hidden lg:block">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src={CLUB_LOGO_URL}
              alt="BIS Standards Club VIT"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <div>
              <h1 className="font-bold text-gray-900">BIS Club VIT</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
            Navigation
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            View Website
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{user?.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm mt-3 px-3 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src={CLUB_LOGO_URL}
              alt="BIS Standards Club VIT"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage board enrollment applications</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                leftIcon={<Download className="w-4 h-4" />}
                className="border-gray-300"
              >
                Export CSV
              </Button>
              <Button
                onClick={handleRefresh}
                isLoading={isRefreshing}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-500',
                yellow: 'bg-amber-500',
                purple: 'bg-purple-500',
                green: 'bg-emerald-500',
                red: 'bg-red-500',
              };
              const bgClasses = {
                blue: 'bg-blue-50',
                yellow: 'bg-amber-50',
                purple: 'bg-purple-50',
                green: 'bg-emerald-50',
                red: 'bg-red-50',
              };

              return (
                <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${bgClasses[stat.color as keyof typeof bgClasses]}`}>
                        <Icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'yellow' ? 'text-amber-600' : stat.color === 'purple' ? 'text-purple-600' : stat.color === 'green' ? 'text-emerald-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ApplicationsTable applications={applications} onExport={handleExport} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  );
}
