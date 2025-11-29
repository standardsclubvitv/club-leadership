'use client';

import { ProfileData } from '@/types';
import { Input, Select } from '@/components/ui';
import { yearOptions, branchOptions } from '@/data/positions';
import { User, Mail, Phone, Building2, GraduationCap, Hash } from 'lucide-react';

interface ProfileFormProps {
  profile: Partial<ProfileData>;
  onChange: (profile: Partial<ProfileData>) => void;
  errors: Record<string, string>;
}

export default function ProfileForm({ profile, onChange, errors }: ProfileFormProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={profile.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          error={errors.fullName}
          leftIcon={<User className="w-5 h-5" />}
          required
        />

        <Input
          label="Registration Number"
          placeholder="e.g., 21BCE1234"
          value={profile.regNumber || ''}
          onChange={(e) => handleChange('regNumber', e.target.value.toUpperCase())}
          error={errors.regNumber}
          leftIcon={<Hash className="w-5 h-5" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@vitstudent.ac.in"
          value={profile.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-5 h-5" />}
          required
          disabled={!!profile.email}
          helperText={profile.email ? 'Pre-filled from your Google account' : undefined}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="10-digit mobile number"
          value={profile.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          error={errors.phone}
          leftIcon={<Phone className="w-5 h-5" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Branch / Department"
          options={branchOptions}
          value={profile.branch || ''}
          onChange={(e) => handleChange('branch', e.target.value)}
          error={errors.branch}
          required
        />

        <Select
          label="Current Year"
          options={yearOptions}
          value={profile.year || ''}
          onChange={(e) => handleChange('year', e.target.value)}
          error={errors.year}
          required
        />
      </div>
    </div>
  );
}
