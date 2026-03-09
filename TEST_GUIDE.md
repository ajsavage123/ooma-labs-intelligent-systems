# Ooma Workspace - Testing Guide

This guide explains how to set up and test the Ooma Workspace platform.

## 1. Environment Setup

Create a `.env` file in the root directory and add your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_partnership_notification_template_id
VITE_EMAILJS_APPROVAL_TEMPLATE_ID=your_approval_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 2. Database Initialization

1.  Go to your **Supabase Dashboard** -> **SQL Editor**.
2.  Copy the contents of `supabase_schema.sql` (found in the root directory).
3.  Run the script to create the required tables (`partnership_requests`, `users`, `projects`, `timeline_logs`, `admin_ratings`) and set up RLS policies.

## 3. Create an Admin User

Since the platform uses Supabase Auth, you must create the first admin manually:

1.  Go to **Authentication** -> **Users** -> **Add User** in Supabase.
2.  Create a user with an email (e.g., `admin@oomalabs.com`) and password.
3.  Go to the **Table Editor** -> **users** table.
4.  Find the row with the new user's ID and set:
    -   `username`: "Admin"
    -   `role`: "admin"

## 4. Testing the Flows

### Flow A: Partnership Application
1.  Open the website and click **Ooma Workspace**.
2.  You should be redirected to the **Partnership Form**.
3.  Fill out the form and submit.
4.  Check `oomalabs@gmail.com` (or your EmailJS logs) for the notification.
5.  Verify the request appears in the Supabase `partnership_requests` table.

### Flow B: Admin Approval
1.  Navigate to `/admin/applications` (Login as Admin if prompted).
2.  Find the pending application and click **Approve**.
3.  Verify the status changes to "approved".
4.  *Note*: For the user to log in, you must manually create an Auth user in Supabase with the email and password provided in the approval step (or automate this with an Edge Function).

### Flow C: Workspace & Projects
1.  Log in as a partner at `/login`.
2.  Select a **Designation** (e.g., Innovation & Research Team).
3.  Click **New Project** (available to Innovation Team) and fill out the form.
4.  Open the project and select your role.
5.  Submit stages to move the project from **Research** -> **Development** -> **Marketing** -> **Admin Review**.
6.  Verify that **Timeline Logs** are generated automatically.

### Flow D: Admin Evaluation
1.  As an Admin, navigate to `/admin/products`.
2.  Find the project in the "Pending Review" list.
3.  Rate the project across the 5 criteria.
4.  Click **Approve Launch**.
5.  Verify the project status is updated in the database.

## 5. Security Check
-   Try accessing `/admin` while logged out or as a `partner` user. You should be redirected or blocked.
-   Verify that visitors are redirected to the partnership form when clicking "Ooma Workspace".
