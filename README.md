# Service Booking & Management Web App

## Overview

This project is a full-stack service booking and management web application designed to demonstrate rapid MVP development using a modern, scalable backend. It allows users to book services and track their requests, while administrators can manage and update booking statuses through a dedicated dashboard.

The application focuses on clean architecture, secure authentication, and role-based access, making it suitable for small businesses, service providers, and internal operations.

---

## Key Features

### User Features
* Secure user authentication (sign up & login)
* Create service booking requests
* View personal booking history
* Track booking status (Pending, Approved, Rejected)

### Admin Features
* Secure admin access
* View all user bookings
* Update booking statuses in real time
* Centralized management dashboard with filtering and detailed views

---

## Tech Stack
* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Supabase (PostgreSQL + Auth)
* **Design:** Premium, modern aesthetic with glassmorphism and animations.

---

## Getting Started

### 1. Database Setup
Follow the detailed instructions in the [database/ folder](./database/README.md) to set up your Supabase project and RLS policies.

### 2. Configure the App
1.  Copy `config.example.js` to `config.js`:
    ```bash
    cp config.example.js config.js
    ```
2.  Open `config.js` and replace the placeholders with your actual Supabase URL and Anon Key:
    ```javascript
    const SUPABASE_URL = 'https://your-project.supabase.co';
    const SUPABASE_ANON_KEY = 'your-anon-key';
    ```
3.  Ensure `config.js` is NOT committed to version control (already added to `.gitignore`).

### 3. Run Locally

#### Option A: Simple (No Setup)
Simply open `index.html` in your favorite web browser.

#### Option B: Professional (With Live Reload)
This requires [Node.js](https://nodejs.org/) installed:
1. Open your terminal in the project folder.
2. Run `npm install` to install the development server (Vite).
3. Run `npm run dev` to start the app.
4. The app will open automatically at `http://localhost:3000`.


---

## How to Test

### Testing the User Flow
1. Open the app and click **Login / Sign Up**.
2. Create a new account.
3. Once logged in, use the form to submit a new service booking.
4. Verify it appears in your "Your Bookings" list.

### Testing the Admin Flow
1. After signing up, go to your **Supabase Dashboard** -> **Table Editor**.
2. Select the `profiles` table and change your `role` from `'user'` to `'admin'`.
3. Refresh the web app. You should now see the **Admin Dashboard**.
4. Create new bookings as a user, then log in as admin to manage them.
5. Approve or Reject bookings and verify the status updates in real-time.

---

## Authors
Built by **Mizan**
Focused on rapid, functional web application development using modern tools.
