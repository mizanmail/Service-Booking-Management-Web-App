# Database Setup Instructions

Follow these steps to set up the database for the Service Booking & Management Web App using Supabase.

## Prerequisites
1. Create a [Supabase account](https://supabase.com/).
2. Create a new project.

## Step 1: Run the SQL Schema
1. Go to the **SQL Editor** in your Supabase dashboard.
2. Click on **New Query**.
3. Copy the contents of [`schema.sql`](./schema.sql) and paste them into the editor.
4. Click **Run**.

This will:
- Create the `profiles` table.
- Create the `bookings` table.
- Set up Row Level Security (RLS) policies.
- Create a trigger to automatically create a profile when a new user signs up.

## Step 2: Set Up Admin User
By default, all new users are created with the `user` role. To make yourself an admin:
1. Go to the **Table Editor**.
2. Select the `profiles` table.
3. Find your user ID (after you have signed up in the app).
4. Change the `role` from `user` to `admin`.

## Step 3: Get your API Keys
1. Go to **Project Settings** > **API**.
2. Copy the `Project URL` and `anon public` key.
3. You will need these for your `app.js` file.

## Data Model Overview

### `profiles`
| Field | Description |
| --- | --- |
| `id` | UUID (References Auth.Users) |
| `full_name` | User's full name |
| `role` | `user` or `admin` |

### `bookings`
| Field | Description |
| --- | --- |
| `id` | UUID (Primary Key) |
| `user_id` | UUID (Foreign Key to Auth.Users) |
| `service_type` | Type of service requested |
| `preferred_date` | Date for the service |
| `status` | `pending`, `approved`, or `rejected` |
| `notes` | Additional info |

## Step 4: Clear Data (Optional)
If you want to reset your database and delete all bookings:
1. Run this in the **SQL Editor**:
```sql
DELETE FROM bookings;
```

---

## Troubleshooting Authentication

If you get a **"400 Bad Request"** or **"Invalid login credentials"** error:

### 1. Disable Email Confirmation (Recommended for Testing)
By default, Supabase requires you to verify your email. If you want to log in immediately after signing up:
1. Go to **Authentication** > **Providers**.
2. Expand **Email**.
3. Toggle off **Confirm Email**.
4. Click **Save**.

### 2. Check User Creation
- Ensure you have signed up in the app successfully. You can verify this in the **Authentication** > **Users** tab.

### 4. Refresh Supabase Schema Cache
If you see a **"Could not find a relationship"** error in the console even after running the SQL:
1. In your Supabase Dashboard, go to **Project Settings** > **API**.
2. Scroll to the bottom and click **Reload PostgREST Config**.
3. This forces Supabase to re-scan your tables and recognize the relationships between `bookings` and `profiles`.

