# Smart Campus — SLIIT PAF 2026

A full-stack Smart Campus management system built for the SLIIT Programming & Frameworks (PAF) module. The application provides Google OAuth2 authentication, role-based access control, resource booking, incident ticketing, and real-time notifications through a REST API backed by a React SPA.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Team & Responsibilities](#team--responsibilities)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Configuration](#setup--configuration)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Roles & Permissions](#roles--permissions)
- [Database Schema](#database-schema)

---

## Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Backend        | Spring Boot 3.5, Spring Security 6, Spring Data JPA |
| Authentication | Google OAuth 2.0 (Spring OAuth2 Client)             |
| Database       | PostgreSQL (Supabase)                               |
| Frontend       | React 19, Vite 5, Tailwind CSS 4, React Router 7    |
| HTTP Client    | Axios                                               |
| Build Tool     | Maven (backend), npm (frontend)                     |
| Java Version   | Java 17                                             |

---

## Architecture

```
Browser (React SPA — localhost:5173)
        │
        │  OAuth2 redirect / API calls (CORS allowed)
        ▼
Spring Boot (localhost:8080)
   ├── Spring Security 6  ←→  Google OAuth2
   ├── REST Controllers   (/api/**)
   ├── Service Layer
   ├── Spring Data JPA
        │
        ▼
PostgreSQL (Supabase)
   ├── user_profiles
   ├── resources
   ├── bookings
   ├── incidents + incident_images + incident_comments
   └── notifications
```

Session cookies (`JSESSIONID`) are used to maintain authentication state between the React SPA and the Spring Boot backend.

---

## Team & Responsibilities

| Member    | Domain                             | Backend                                                                                                                        | Frontend                                                   |
| --------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Member 01 | Facilities & Security              | `AuthController`, `UserController`, `SecurityConfig`, `WebConfig`                                                              | `DashboardLayout`, `LoginPage`, `ResourcesPage`, `App.jsx` |
| Member 02 | Booking Engine & Logic             | `BookingController`, `BookingService`, `Booking` entity                                                                        | `BookingsPage`, `BookingForm`                              |
| Member 03 | Incident Ticketing & Notifications | `IncidentController`, `NotificationController`, `IncidentService`, `NotificationService`, `Incident` + `Notification` entities | `TicketsPage`, `NotificationsPage`                         |

---

## Features

### Implemented

- **Google OAuth2 Login** — users authenticate with their Google account; no passwords stored.
- **DB-backed Role System** — roles (`USER`, `TECHNICIAN`, `ADMIN`) are persisted in PostgreSQL and enforced via Spring Security `@PreAuthorize`.
- **Admin Seed** — one or more Google emails can be pre-configured as ADMIN via `app.admin.emails` in `application.properties`.
- **Resource Management** — CRUD operations for campus resources (Labs, Halls, Equipment).
  - All authenticated users can view resources.
  - Only `ADMIN` can create, update, or delete resources.
  - Filter by type and minimum capacity.
- **User Management (Admin)** — admins can list all users, filter technicians, and change user roles.
- **Booking System** — users can request time-slot bookings for campus resources.
  - Conflict detection prevents double-booking of approved slots.
  - Admins can approve or reject bookings with an optional reason.
  - Notifications are sent to users when their booking status changes.
- **Incident Ticketing** — users report maintenance or facility incidents tied to a resource.
  - Supports LOW / HIGH priority and up to 3 image URL attachments.
  - Admins assign incidents to technicians; status progresses OPEN → IN_PROGRESS → RESOLVED.
  - Role-scoped views: users see their own tickets, technicians see assigned tickets, admins see all.
  - Threaded comments on each incident.
- **Notifications** — in-app notification feed per user with unread count badge.
  - Notifications auto-generated on booking status changes and incident assignments.
  - Mark individual notifications as read.
- **Dashboard Layout** — collapsible sidebar with live unread-notification count badge.
- **Global Exception Handling** — structured JSON error responses.
- **CORS Configuration** — backend permits requests from `http://localhost:5173`.

---

## Project Structure

```
it3030-paf-2026-smart-campus-prorata14/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/sliit/smartcampus/
│       ├── SmartCampusApplication.java
│       ├── config/
│       │   ├── GlobalExceptionHandler.java        # Structured error responses
│       │   ├── SecurityConfig.java                # Spring Security + OAuth2
│       │   └── WebConfig.java                     # CORS configuration
│       ├── controller/
│       │   ├── AuthController.java                # GET /api/auth/me
│       │   ├── BookingController.java             # CRUD /api/bookings
│       │   ├── IncidentController.java            # CRUD /api/incidents
│       │   ├── NotificationController.java        # GET/PUT /api/notifications
│       │   ├── ResourceController.java            # CRUD /api/resources
│       │   └── UserController.java                # Admin user management
│       ├── dto/
│       │   └── ErrorResponse.java
│       ├── entity/
│       │   ├── Booking.java                       # bookings table
│       │   ├── Incident.java                      # incidents table (+ images, comments)
│       │   ├── Notification.java                  # notifications table
│       │   ├── Resource.java                      # resources table
│       │   └── UserProfile.java                   # user_profiles table
│       ├── repository/
│       │   ├── BookingRepository.java
│       │   ├── IncidentRepository.java
│       │   ├── NotificationRepository.java
│       │   ├── ResourceRepository.java
│       │   └── UserProfileRepository.java
│       └── service/
│           ├── BookingService.java                # Conflict detection + booking lifecycle
│           ├── CustomOAuth2UserService.java       # Google login + role assignment
│           ├── IncidentService.java               # Ticket management + assignment
│           ├── NotificationService.java           # Notification creation + queries
│           └── ResourceService.java
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                                # Router configuration
        ├── context/
        │   └── UserContext.jsx                    # Logged-in user context
        ├── components/
        │   ├── BookingForm.jsx                    # Booking submission form
        │   └── DashboardLayout.jsx                # Collapsible sidebar + top navbar
        └── pages/
            ├── BookingsPage.jsx                   # Booking list + admin approve/reject
            ├── LoginPage.jsx                      # Google Sign-in button
            ├── NotificationsPage.jsx              # Notification feed + mark-as-read
            ├── ResourcesPage.jsx                  # Resource list + admin CRUD
            └── TicketsPage.jsx                    # Incident list + report form + assign
```

---

## Prerequisites

- Java 17+
- Maven 3.9+ (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- A Google Cloud project with OAuth2 credentials configured
- PostgreSQL database (Supabase or local)

---

## Setup & Configuration

### 1. Google OAuth2 Credentials

Create OAuth2 credentials in [Google Cloud Console](https://console.cloud.google.com/):

- **Authorized JavaScript origins:** `http://localhost:8080`
- **Authorized redirect URIs:** `http://localhost:8080/login/oauth2/code/google`

### 2. Backend — `application.properties`

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://<host>:5432/<db>
spring.datasource.username=<user>
spring.datasource.password=<password>

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=<your-client-id>
spring.security.oauth2.client.registration.google.client-secret=<your-client-secret>
spring.security.oauth2.client.registration.google.scope=profile,email

# Admin seed: comma-separated Google emails that receive ADMIN role on first login
app.admin.emails=your-email@gmail.com
```

> **Security note:** Do not commit real credentials to version control. Use environment variables or a secrets manager in production.

### 3. Frontend

No additional configuration is needed for local development. The API base URL is hard-coded to `http://localhost:8080` in each source file.

---

## Running the Application

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

### Login Flow

1. Open `http://localhost:5173` — you are redirected to `/login`.
2. Click **Sign in with Google**.
3. After Google authentication, the backend creates/updates your `user_profiles` record and redirects to `http://localhost:5173/dashboard`.

---

## API Reference

### Authentication

| Method | Endpoint                       | Auth          | Description                                           |
| ------ | ------------------------------ | ------------- | ----------------------------------------------------- |
| `GET`  | `/oauth2/authorization/google` | Public        | Initiates Google OAuth2 login                         |
| `GET`  | `/api/auth/me`                 | Authenticated | Returns current user's name, email, picture, and role |
| `POST` | `/api/auth/logout`             | Authenticated | Clears session and redirects to frontend              |

### Resources

| Method   | Endpoint              | Auth          | Description                                              |
| -------- | --------------------- | ------------- | -------------------------------------------------------- |
| `GET`    | `/api/resources`      | Authenticated | List all resources (optional `?type=LAB&minCapacity=30`) |
| `POST`   | `/api/resources`      | ADMIN         | Create a new resource                                    |
| `PUT`    | `/api/resources/{id}` | ADMIN         | Update an existing resource                              |
| `DELETE` | `/api/resources/{id}` | ADMIN         | Delete a resource                                        |

### Bookings

| Method | Endpoint                    | Auth          | Description                                                               |
| ------ | --------------------------- | ------------- | ------------------------------------------------------------------------- |
| `POST` | `/api/bookings`             | Authenticated | Create a booking request (conflict-checked)                               |
| `GET`  | `/api/bookings/my`          | Authenticated | List the current user's own bookings                                      |
| `GET`  | `/api/bookings/all`         | ADMIN         | List all bookings (optional `?status=PENDING`)                            |
| `PUT`  | `/api/bookings/{id}/status` | ADMIN         | Approve or reject a booking (`{ "status": "APPROVED", "reason": "..." }`) |

### Incidents

| Method | Endpoint                       | Auth          | Description                                                 |
| ------ | ------------------------------ | ------------- | ----------------------------------------------------------- |
| `POST` | `/api/incidents`               | Authenticated | Report a new incident (up to 3 image URLs)                  |
| `GET`  | `/api/incidents`               | Authenticated | List incidents — role-scoped; optional `?status=&priority=` |
| `PUT`  | `/api/incidents/{id}/assign`   | ADMIN         | Assign a technician (`{ "technicianEmail": "..." }`)        |
| `POST` | `/api/incidents/{id}/comments` | Authenticated | Add a comment to an incident (`{ "message": "..." }`)       |

### Notifications

| Method | Endpoint                          | Auth          | Description                             |
| ------ | --------------------------------- | ------------- | --------------------------------------- |
| `GET`  | `/api/notifications`              | Authenticated | List all notifications for current user |
| `GET`  | `/api/notifications/unread-count` | Authenticated | Returns `{ "count": N }`                |
| `PUT`  | `/api/notifications/{id}/read`    | Authenticated | Mark a notification as read             |

### User Management (Admin only)

| Method | Endpoint                        | Auth  | Description                                       |
| ------ | ------------------------------- | ----- | ------------------------------------------------- |
| `GET`  | `/api/admin/users`              | ADMIN | List all registered users                         |
| `GET`  | `/api/admin/users/technicians`  | ADMIN | List users with TECHNICIAN role                   |
| `PUT`  | `/api/admin/users/{email}/role` | ADMIN | Update a user's role (`{ "role": "TECHNICIAN" }`) |

---

## Roles & Permissions

| Role         | Description                                                                        | Assigned By                                                |
| ------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `USER`       | Default role for all new Google sign-ins; can book resources and report incidents  | Automatic                                                  |
| `TECHNICIAN` | Maintenance staff; sees only incidents assigned to them                            | Admin via API                                              |
| `ADMIN`      | Full access: resource CRUD, user management, booking approval, incident assignment | Seeded via `app.admin.emails` or promoted by another admin |

Role enforcement uses Spring Security's `@PreAuthorize` on controller methods. The frontend conditionally renders admin controls based on the role returned by `/api/auth/me`.

---

## Database Schema

### `user_profiles`

| Column          | Type             | Notes                                 |
| --------------- | ---------------- | ------------------------------------- |
| `id`            | BIGSERIAL (PK)   | Auto-generated                        |
| `email`         | VARCHAR (UNIQUE) | Google email — used as principal name |
| `name`          | VARCHAR          | Google display name                   |
| `picture`       | VARCHAR          | Google profile photo URL              |
| `role`          | VARCHAR          | `USER`, `TECHNICIAN`, or `ADMIN`      |
| `created_at`    | TIMESTAMP        | Set on first login                    |
| `last_login_at` | TIMESTAMP        | Updated on every login                |

### `resources`

| Column     | Type           | Notes                         |
| ---------- | -------------- | ----------------------------- |
| `id`       | BIGSERIAL (PK) | Auto-generated                |
| `name`     | VARCHAR        | Resource name                 |
| `type`     | VARCHAR        | `LAB`, `HALL`, or `EQUIP`     |
| `capacity` | INTEGER        | Seating / unit capacity       |
| `location` | VARCHAR        | Physical location description |
| `status`   | VARCHAR        | `ACTIVE` or `OUT_OF_SERVICE`  |

### `bookings`

| Column         | Type           | Notes                                          |
| -------------- | -------------- | ---------------------------------------------- |
| `id`           | BIGSERIAL (PK) | Auto-generated                                 |
| `resource_id`  | BIGINT (FK)    | References resources                           |
| `user_id`      | VARCHAR        | Email of the requesting user                   |
| `start_time`   | TIMESTAMP      | Booking start                                  |
| `end_time`     | TIMESTAMP      | Booking end                                    |
| `purpose`      | VARCHAR        | Reason for booking                             |
| `status`       | VARCHAR        | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED` |
| `admin_reason` | VARCHAR        | Optional note from admin on approve/reject     |

### `incidents`

| Column        | Type           | Notes                             |
| ------------- | -------------- | --------------------------------- |
| `id`          | BIGSERIAL (PK) | Auto-generated                    |
| `resource_id` | BIGINT (FK)    | References resources              |
| `reported_by` | VARCHAR        | Email of reporting user           |
| `description` | VARCHAR(1000)  | Issue description                 |
| `priority`    | VARCHAR        | `LOW` or `HIGH`                   |
| `status`      | VARCHAR        | `OPEN`, `IN_PROGRESS`, `RESOLVED` |
| `assigned_to` | VARCHAR        | Technician email (nullable)       |
| `created_at`  | TIMESTAMP      | Auto-set on creation              |
| `updated_at`  | TIMESTAMP      | Auto-updated on every change      |

#### `incident_images` (element collection)

| Column        | Type    | Notes                   |
| ------------- | ------- | ----------------------- |
| `incident_id` | BIGINT  | FK to incidents         |
| `image_url`   | VARCHAR | Up to 3 URLs per ticket |

#### `incident_comments` (embedded collection)

| Column        | Type      | Notes                    |
| ------------- | --------- | ------------------------ |
| `incident_id` | BIGINT    | FK to incidents          |
| `author`      | VARCHAR   | Commenter email          |
| `message`     | VARCHAR   | Comment body             |
| `posted_at`   | TIMESTAMP | Timestamp of the comment |

### `notifications`

| Column       | Type           | Notes                |
| ------------ | -------------- | -------------------- |
| `id`         | BIGSERIAL (PK) | Auto-generated       |
| `user_id`    | VARCHAR        | Recipient email      |
| `message`    | VARCHAR(500)   | Notification body    |
| `is_read`    | BOOLEAN        | Defaults to `false`  |
| `created_at` | TIMESTAMP      | Auto-set on creation |

Schema is managed by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) — tables are created automatically on first run.
