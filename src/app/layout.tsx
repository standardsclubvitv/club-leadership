import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth";
import { ToastProvider } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://apply.standardsvit.live';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E40AF',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BIS Standards Club VIT - Board Enrollment 2025",
    template: "%s | BIS Standards Club VIT",
  },
  description: "Apply to join the Board of BIS Standards Club VIT. We are looking for passionate individuals to lead and grow our community. Join us in promoting standardization excellence.",
  keywords: [
    "BIS",
    "Standards Club",
    "VIT",
    "Vellore Institute of Technology",
    "Board Enrollment",
    "Leadership",
    "Bureau of Indian Standards",
    "Student Club",
    "VIT Vellore",
    "Campus Club",
    "Technical Club",
  ],
  authors: [{ name: "BIS Standards Club VIT", url: SITE_URL }],
  creator: "BIS Standards Club VIT",
  publisher: "BIS Standards Club VIT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: CLUB_LOGO_URL, sizes: '32x32', type: 'image/png' },
      { url: CLUB_LOGO_URL, sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: CLUB_LOGO_URL, sizes: '180x180', type: 'image/png' },
    ],
    shortcut: CLUB_LOGO_URL,
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "BIS Standards Club VIT",
    title: "BIS Standards Club VIT - Board Enrollment 2025",
    description: "Apply to join the Board of BIS Standards Club VIT. We are looking for passionate individuals to lead and grow our community.",
    images: [
      {
        url: CLUB_LOGO_URL,
        width: 512,
        height: 512,
        alt: "BIS Standards Club VIT Logo",
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bisclubvit",
    creator: "@bisclubvit",
    title: "BIS Standards Club VIT - Board Enrollment 2025",
    description: "Apply to join the Board of BIS Standards Club VIT. Lead and grow our community.",
    images: [CLUB_LOGO_URL],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'education',
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
