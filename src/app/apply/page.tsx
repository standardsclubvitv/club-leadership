'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, ProtectedRoute } from '@/components/auth';
import { ProfileForm, PositionSelector, QuestionForm } from '@/components/forms';
import { Button, Card, CardContent, Alert, LoadingSpinner, useToast } from '@/components/ui';
import { defaultPositions } from '@/data/positions';
import { ProfileData, PositionApplication, Position } from '@/types';
import { validateProfile, validatePositionApplications } from '@/lib/utils/validation';
import { getUserApplication } from '@/lib/firebase';
import { auth } from '@/lib/firebase/config';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle,
  User,
  Briefcase,
  FileText,
  Home,
} from 'lucide-react';

type Step = 'profile' | 'positions' | 'questions' | 'review' | 'success';

function ApplyContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [selectedPositionIds, setSelectedPositionIds] = useState<string[]>([]);
  const [positionApplications, setPositionApplications] = useState<PositionApplication[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for existing application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (user) {
        try {
          const app = await getUserApplication(user.uid);
          if (app) {
            setExistingApplication(true);
            setApplicationId(app.id);
            setProfile(app.profile);
            setPositionApplications(app.positions);
            setSelectedPositionIds(app.positions.map((p) => p.positionId));
            setCurrentStep('success');
          } else {
            // Pre-fill profile from user data
            setProfile({
              fullName: user.displayName,
              email: user.email,
            });
          }
        } catch (error) {
          console.error('Error checking existing application:', error);
        }
        setIsLoading(false);
      }
    };

    checkExistingApplication();
  }, [user]);

  const selectedPositions: Position[] = defaultPositions.filter((p) =>
    selectedPositionIds.includes(p.id)
  );

  const handlePositionSelect = (positionId: string) => {
    const isSelected = selectedPositionIds.includes(positionId);
    
    if (isSelected) {
      setSelectedPositionIds(selectedPositionIds.filter((id) => id !== positionId));
      setPositionApplications(positionApplications.filter((p) => p.positionId !== positionId));
    } else if (selectedPositionIds.length < 3) {
      setSelectedPositionIds([...selectedPositionIds, positionId]);
      const position = defaultPositions.find((p) => p.id === positionId);
      if (position) {
        setPositionApplications([
          ...positionApplications,
          {
            positionId: position.id,
            positionName: position.title,
            answers: position.questions.map((q) => ({ question: q, answer: '' })),
          },
        ]);
      }
    }
  };

  const handlePositionAnswerChange = (positionId: string, application: PositionApplication) => {
    setPositionApplications(
      positionApplications.map((p) =>
        p.positionId === positionId ? application : p
      )
    );
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'profile':
        const profileErrors = validateProfile(profile);
        profileErrors.forEach((error) => {
          newErrors[error.field] = error.message;
        });
        break;

      case 'positions':
        if (selectedPositionIds.length === 0) {
          newErrors.positions = 'Please select at least one position to continue';
        }
        break;

      case 'questions':
        positionApplications.forEach((posApp) => {
          posApp.answers.forEach((answer, ansIndex) => {
            const wordCount = answer.answer.trim().split(/\s+/).filter(Boolean).length;
            if (!answer.answer || answer.answer.trim().length === 0) {
              newErrors[`position_${posApp.positionId}_answer_${ansIndex}`] =
                `Please provide an answer for this question`;
            } else if (wordCount < 50) {
              newErrors[`position_${posApp.positionId}_answer_${ansIndex}`] =
                `Your answer needs at least 50 words. Currently: ${wordCount} words. Please elaborate more on your response.`;
            }
          });
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      addToast({
        type: 'error',
        title: 'Please Complete All Fields',
        message: 'Some required information is missing or incomplete. Please check the highlighted fields.',
      });
      return;
    }

    const steps: Step[] = ['profile', 'positions', 'questions', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['profile', 'positions', 'questions', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Final validation
    const allErrors = [
      ...validateProfile(profile),
      ...validatePositionApplications(positionApplications),
    ];

    if (allErrors.length > 0) {
      addToast({
        type: 'error',
        title: 'Application Incomplete',
        message: 'Please make sure all required fields are filled correctly before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: profile as ProfileData,
          positions: positionApplications,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplicationId(data.applicationId);
      setCurrentStep('success');

      addToast({
        type: 'success',
        title: 'Application Submitted!',
        message: 'Check your email for confirmation',
      });
    } catch (error) {
      console.error('Submission error:', error);
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  const steps = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'positions', label: 'Positions', icon: Briefcase },
    { id: 'questions', label: 'Questions', icon: FileText },
    { id: 'review', label: 'Review', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">Board Enrollment</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      {currentStep !== 'success' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = currentStepIndex > index;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 hidden sm:block ${
                          isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 sm:w-24 h-0.5 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Step */}
        {currentStep === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600 mt-1">
                Tell us about yourself. This information helps us know you better.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <ProfileForm profile={profile} onChange={setProfile} errors={errors} />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Positions
              </Button>
            </div>
          </div>
        )}

        {/* Positions Step */}
        {currentStep === 'positions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Select Positions</h1>
              <p className="text-gray-600 mt-1">
                Choose up to 3 positions you&apos;re interested in applying for.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <PositionSelector
                  positions={defaultPositions}
                  selectedPositions={selectedPositionIds}
                  onSelect={handlePositionSelect}
                  error={errors.positions}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Questions
              </Button>
            </div>
          </div>
        )}

        {/* Questions Step */}
        {currentStep === 'questions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Position Questions</h1>
              <p className="text-gray-600 mt-1">
                Answer the questions for each position you&apos;ve selected.
              </p>
            </div>

            {selectedPositions.map((position) => {
              const application = positionApplications.find(
                (p) => p.positionId === position.id
              );
              if (!application) return null;

              return (
                <QuestionForm
                  key={position.id}
                  position={position}
                  application={application}
                  onChange={(app) => handlePositionAnswerChange(position.id, app)}
                  errors={errors}
                />
              );
            })}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Review Application
              </Button>
            </div>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Your Application</h1>
              <p className="text-gray-600 mt-1">
                Please review all information before submitting.
              </p>
            </div>

            <Alert type="info">
              Once submitted, you cannot edit your application. Make sure all information is correct.
            </Alert>

            {/* Profile Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{profile.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Registration Number</p>
                    <p className="font-medium text-gray-900">{profile.regNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Branch</p>
                    <p className="font-medium text-gray-900">{profile.branch}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{profile.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Positions Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Positions</h2>
                <div className="flex flex-wrap gap-2">
                  {positionApplications.map((pos) => (
                    <span
                      key={pos.positionId}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {pos.positionName}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {existingApplication ? 'Application Already Submitted' : 'Application Submitted!'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {existingApplication
                ? 'You have already submitted your application. Our team will review it and contact you soon.'
                : 'Thank you for applying! A confirmation email has been sent to your email address. Our team will review your application and get back to you.'}
            </p>

            {applicationId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-mono font-medium text-gray-900">{applicationId}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Applied Positions</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {positionApplications.map((pos) => (
                  <span
                    key={pos.positionId}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {pos.positionName}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/">
                <Button variant="outline" leftIcon={<Home className="w-4 h-4" />}>
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <ProtectedRoute>
      <ApplyContent />
    </ProtectedRoute>
  );
}
