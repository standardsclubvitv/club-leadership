'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui';
import { defaultPositions } from '@/data/positions';
import {
  ArrowRight,
  Target,
  Users,
  Award,
  Calendar,
  CheckCircle,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { useState } from 'react';

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';
const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/standardsclubvit/',
  linkedin: 'https://www.linkedin.com/in/standards-club-vit-b512a829a/',
  youtube: 'https://www.youtube.com/@IndianStandard',
  website: 'https://www.standardsvit.live/',
  email: 'standardsclub@vit.ac.in',
};

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image
                src={CLUB_LOGO_URL}
                alt="BIS Standards Club VIT Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-xl text-gray-900">BIS Club VIT</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#positions" className="text-gray-600 hover:text-gray-900 transition-colors">
                Positions
              </a>
              <a href="#timeline" className="text-gray-600 hover:text-gray-900 transition-colors">
                Timeline
              </a>
              <a href="#eligibility" className="text-gray-600 hover:text-gray-900 transition-colors">
                Eligibility
              </a>
              {loading ? (
                <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href="/apply">
                    <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      {user.hasApplied ? 'View Application' : 'Apply Now'}
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Apply Now
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-4">
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#positions" className="text-gray-600 hover:text-gray-900">Positions</a>
                <a href="#timeline" className="text-gray-600 hover:text-gray-900">Timeline</a>
                <a href="#eligibility" className="text-gray-600 hover:text-gray-900">Eligibility</a>
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/apply">
                      <Button className="w-full">
                        {user.hasApplied ? 'View Application' : 'Apply Now'}
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Board Enrollment 2025 is Open!
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Shape the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Standards Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the BIS Standards Club VIT Board and lead initiatives that bridge industry standards 
              with academic excellence. Be part of something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={user ? '/apply' : '/auth'}>
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {user?.hasApplied ? 'View Your Application' : 'Start Your Application'}
                </Button>
              </Link>
              <a href="#about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '70+', label: 'Active Members' },
              { number: '30+', label: 'Events Conducted' },
              { number: '2+', label: 'Industry Partners' },
              { number: '16', label: 'Board Positions' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About BIS Standards Club
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a student-led initiative at VIT, dedicated to promoting awareness about 
              standardization and quality management in collaboration with the Bureau of Indian Standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Our Mission',
                description:
                  'To create awareness about Indian Standards among students and help them understand the importance of standardization in industry.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Our Vision',
                description:
                  'To be the premier student organization bridging the gap between academic learning and industry-standard practices.',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Our Values',
                description:
                  'Excellence, integrity, collaboration, and innovation drive everything we do as a community of future leaders.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section id="positions" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Available Board Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the leadership opportunities available. Each role offers unique challenges 
              and the chance to make a lasting impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{position.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{position.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={user ? '/apply' : '/auth'}>
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Apply for a Position
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Enrollment Timeline
            </h2>
            <p className="text-xl text-gray-600">
              Important dates for the board enrollment process
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                date: 'November 30, 2025',
                title: 'Applications Open',
                description: 'Start submitting your applications for board positions.',
                status: 'current',
              },
              {
                date: 'December 10, 2025',
                title: 'Application Deadline',
                description: 'Last date to submit your application.',
                status: 'upcoming',
              },
              {
                date: 'December 12-14, 2025',
                title: 'Interview Round',
                description: 'Shortlisted candidates will be interviewed.',
                status: 'upcoming',
              },
              {
                date: 'December 20, 2025',
                title: 'Results Announcement',
                description: 'Final board members will be announced.',
                status: 'upcoming',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      item.status === 'current'
                        ? 'bg-blue-600 ring-4 ring-blue-100'
                        : 'bg-gray-300'
                    }`}
                  />
                  {idx !== 3 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">{item.date}</span>
                    {item.status === 'current' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section id="eligibility" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Eligibility Criteria
            </h2>
            <p className="text-xl text-gray-600">
              Make sure you meet these requirements before applying
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="space-y-4">
              {[
                'Must be a currently enrolled student at VIT',
                'Minimum CGPA of 7.0 or equivalent',
                'Demonstrated interest in standards and quality management',
                'Strong communication and leadership skills',
                'Commitment to dedicate time for club activities',
                'Available to serve for a minimum of one academic year',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Lead?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join us in shaping the future of standardization at VIT. 
            Your journey to leadership starts here.
          </p>
          <Link href={user ? '/apply' : '/auth'}>
            <Button
              size="lg"
              variant="secondary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Start Your Application
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Image
                src={CLUB_LOGO_URL}
                alt="BIS Standards Club VIT Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-xl text-white">BIS Standards Club VIT</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Main Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="text-gray-400 hover:text-white transition-colors"
                title="Email Us"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BIS Standards Club VIT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
