# BIS Standards Club VIT - Board Enrollment System

A professional board enrollment web application for BIS Standards Club VIT with Firebase authentication, Firestore database, role-based access control, and email notifications.

## 🚀 Features

- **Google Authentication** - Secure sign-in with Google accounts
- **Multi-step Application Form** - Profile, position selection, and custom questions
- **Position Management** - Apply for up to 3 board positions
- **Admin Dashboard** - Manage and review all applications
- **Email Notifications** - Automatic confirmation emails
- **Role-based Access Control** - Admin-only access to management features
- **Responsive Design** - Works on all devices

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Email**: Nodemailer
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Gmail account for email notifications (with App Password)

### 1. Clone and Install

```bash
cd bis-board-enrollment
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing: `standards-club-leadership`
3. Enable **Authentication** > **Sign-in method** > **Google**
4. Create **Firestore Database** in production mode
5. Go to **Project Settings** > **Service Accounts** > **Generate new private key**
6. Save the JSON file securely

### 3. Configure Environment Variables

Update the `.env.local` file with your credentials:

```env
# Already configured from your Firebase project:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDKlRV1YB_IO_htCFS6N-3ZNQsVxSoy51s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=standards-club-leadership.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=standards-club-leadership
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=standards-club-leadership.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=862767529116
NEXT_PUBLIC_FIREBASE_APP_ID=1:862767529116:web:f36af51f03c1076cf20159

# Firebase Admin SDK - Get from service account JSON:
FIREBASE_ADMIN_PROJECT_ID=standards-club-leadership
FIREBASE_ADMIN_CLIENT_EMAIL=<from-service-account.json>
FIREBASE_ADMIN_PRIVATE_KEY="<from-service-account.json>"

# Email Configuration (Gmail):
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use App Password, not regular password

# App URL:
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change for production
```

### 4. Set Up Firestore Security Rules

In Firebase Console > Firestore > Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Positions collection
    match /positions/{positionId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Create Admin User

After signing in with Google for the first time:

1. Go to Firebase Console > Firestore
2. Find your user document in the `users` collection
3. Edit the document and change `role` from `"user"` to `"admin"`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── auth/page.tsx       # Authentication page
│   ├── apply/page.tsx      # Application form
│   ├── admin/
│   │   ├── page.tsx        # Admin dashboard
│   │   └── applications/[id]/page.tsx  # Application detail
│   └── api/
│       ├── applications/submit/route.ts
│       ├── admin/applications/route.ts
│       ├── admin/applications/[id]/route.ts
│       └── email/confirmation/route.ts
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── forms/              # Form components
│   └── admin/              # Admin components
├── lib/
│   ├── firebase/           # Firebase configuration
│   ├── email/              # Email utilities
│   └── utils/              # Helper functions
├── types/                  # TypeScript types
└── data/                   # Static data (positions)
```

## 🚀 Deployment to Vercel

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel

Add all the variables from `.env.local` to Vercel:
- Settings > Environment Variables
- Make sure to properly escape the private key

## 📧 Email Configuration

### Using Gmail

1. Enable 2-Step Verification on your Google account
2. Go to Security > App passwords
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

### Email Template

The confirmation email includes:
- Application confirmation
- Selected positions
- Application ID
- Next steps information
- Social media links

## 🔐 Security Features

- Firebase Authentication for secure sign-in
- Server-side token verification
- Role-based access control
- Input validation on client and server
- Firestore security rules
- No sensitive data exposed to client

## 📱 Pages Overview

### Landing Page (/)
- Hero section with CTA
- About the club
- Available positions
- Timeline
- Eligibility criteria
- Footer with social links

### Auth Page (/auth)
- Google Sign-In
- Redirects authenticated users

### Application Page (/apply)
- Step 1: Profile information
- Step 2: Position selection (max 3)
- Step 3: Position-specific questions
- Step 4: Review and submit
- Success confirmation

### Admin Dashboard (/admin)
- Statistics overview
- Applications table with search/filter
- Export to CSV
- View application details
- Update status and add notes

## 🧪 Testing Checklist

- [ ] Google Sign-In works
- [ ] Profile form validates correctly
- [ ] Position selection limited to 3
- [ ] Questions appear for selected positions
- [ ] Form submission works
- [ ] Email confirmation sent
- [ ] Admin can view all applications
- [ ] Admin can update status
- [ ] CSV export works
- [ ] Responsive on all devices

## 📄 License

MIT License - BIS Standards Club VIT

---

Built with ❤️ for BIS Standards Club VIT
