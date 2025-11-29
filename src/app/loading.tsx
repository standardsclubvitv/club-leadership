import { LoadingSpinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
