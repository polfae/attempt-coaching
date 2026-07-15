# Attempt Website v1

A Next.js + Firebase starter for the Attempt brand website.

## What is included

- Public pages:
  - `/`
  - `/coaching`
  - `/apply`
  - `/app`
  - `/programs`
  - `/about`
  - `/contact`
- Admin routes:
  - `/admin/login`
  - `/admin`
  - `/admin/homepage`
  - `/admin/coaching`
  - `/admin/app`
  - `/admin/programs`
  - `/admin/testimonials`
  - `/admin/applications`
  - `/admin/newsletter`
  - `/admin/media`
  - `/admin/settings`
- Firebase-ready setup:
  - Authentication
  - Firestore
  - Storage
  - Firestore rules
  - Storage rules
- Coaching application form that saves to `coachingApplications` when Firebase is configured.
- Admin application view with status updates.
- Programs page with Firestore fallback to seed programs.
- Automatic footer year: `© [current year] Attempt`.
- Footer copyright routes to admin login/admin dashboard.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add Firebase config:

```bash
cp .env.example .env.local
```

3. Run locally:

```bash
npm run dev
```

4. Open:

```bash
http://localhost:3000
```

## Firebase admin setup

1. Create a Firebase project.
2. Enable Email/Password in Firebase Authentication.
3. Create the admin user.
4. Copy the user's UID.
5. Create this Firestore document:

Collection: `admins`
Document ID: `{uid}`

```json
{
  "email": "your@email.com",
  "name": "Pól Hendrikur Andreasen",
  "role": "owner",
  "active": true,
  "createdAt": "timestamp"
}
```

6. Publish `firestore.rules` and `storage.rules` in Firebase.

## Notes

This is the first build foundation. The next development step is to replace the scaffolded admin content pages with full CRUD forms for homepage sections, coaching page content, app page content, programs, testimonials, media, and settings.
