# Product Requirements Document (PRD)

## Project Name

**Service Booking & Management Web Application**

---

## 1. Purpose & Portfolio Objective

This project exists to **demonstrate the ability to design and ship a real, business-ready web application end-to-end**.

It is built to answer these questions decisively:

* Can the developer design a usable system, not just write code?
* Can they handle authentication, authorization, and secure data access?
* Can they think in terms of users, admins, and business workflows?
* Can they deliver a functional MVP without overengineering?

If this project is strong, it explains the developer’s capability **without verbal justification**.

---

## 2. Problem Statement

Small service-based businesses often manage service requests manually using phone calls, messages, or spreadsheets.
This leads to:

* Poor request tracking
* Missed or delayed responses
* No centralized visibility
* Operational inefficiency

There is a need for a **simple, secure, web-based system** that allows customers to request services and allows administrators to manage those requests in a structured way.

---

## 3. Product Objective

To build a **lightweight MVP service booking system** that enables:

* Users to create service booking requests and track their status
* Administrators to review, approve, or reject bookings through a centralized dashboard

The system is intentionally minimal and extensible, designed to reflect real client work.

---

## 4. Target Users

### 1. End Users (Customers)

* Individuals requesting a service
* Logged-in users with personal dashboards
* Non-technical users who need clarity and speed

### 2. Administrators

* Business owners or managers
* Responsible for reviewing and managing bookings
* Require visibility and control

No service-provider role is included in this MVP.

---

## 5. User Journey & User Stories

### A. End User Journey

**Goal:** Request a service and track its outcome.

1. User lands on the application
2. User registers or logs in using email and password
3. User is redirected to their dashboard
4. User creates a new booking by providing:

   * Service type
   * Preferred date
   * Optional notes
5. Booking is created with status **Pending**
6. User views booking history with clear status indicators
7. User tracks booking updates (Approved / Rejected)

---

### B. Admin Journey

**Goal:** Efficiently manage service requests.

1. Admin logs in through the same authentication system
2. Admin is redirected to an admin dashboard
3. Admin views all booking requests
4. Admin filters or prioritizes pending bookings
5. Admin reviews booking details
6. Admin approves or rejects the booking
7. Status update is reflected immediately for the user

---

## 6. Core Features

### User Features

* User registration and login
* Create a service booking request
* View personal booking history
* Track booking status

### Admin Features

* Secure admin login (role-based)
* View all booking requests
* Update booking status
* Centralized dashboard for management

---

## 7. Functional Scope (Strict)

### Included

* Authentication
* Role-based access control
* Booking creation
* Booking status updates
* Secure database persistence

### Explicitly Excluded

* Payments
* Notifications (email/SMS)
* Service-provider accounts
* Reviews or ratings
* Analytics or reporting
* Scheduling automation

---

## 8. Data Model (Minimal)

### Users

Handled by Supabase Auth.

* id
* email
* role (`user` | `admin`)
* created_at

---

### Bookings

Core application table.

* id
* user_id (foreign key)
* service_type
* preferred_date
* notes (nullable)
* status (`pending | approved | rejected`)
* created_at
* updated_at

No additional tables are required for the MVP.

---

## 9. Security & Access Rules

* Users can create and view **only their own bookings**
* Administrators can view and update **all bookings**
* All access enforced via Row Level Security (RLS)

Security correctness is a non-negotiable requirement.

---

## 10. Core Application Components

### Frontend

* Landing page
* Authentication pages
* User dashboard
* Booking creation form
* Admin dashboard
* Booking detail view (admin)

### Backend

* Supabase Auth for authentication
* PostgreSQL database
* Row Level Security policies
* CRUD operations for bookings

---

## 11. Technical Overview

* Frontend: HTML, CSS, JavaScript
* Backend: Supabase
* Authentication: Supabase Auth
* Database: PostgreSQL with RLS
* Deployment: Netlify or Vercel

---

## 12. Success Criteria

The project is considered successful when:

* A user can register, create a booking, and track its status
* An admin can review and update booking statuses
* Data access is secure and role-restricted
* The application can be demoed confidently as a real business MVP

---

## 13. Final Product Philosophy

This product is valuable not because of its size, but because it:

* Mirrors real client requirements
* Demonstrates sound engineering judgment
* Avoids unnecessary complexity
* Proves execution over experimentation

