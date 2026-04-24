# Smart Campus — SLIIT PAF 2026

A full-stack Smart Campus management system built for the SLIIT Programming & Frameworks (PAF) module. The application provides Google OAuth2 authentication, role-based access control, and campus resource management through a REST API backed by a React SPA.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
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
   └── resources
```

Session cookies (`JSESSIONID`) are used to maintain authentication state between the React SPA and the Spring Boot backend.

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
- **Dashboard Layout** — collapsible sidebar with navigation links for Resources, Bookings, Tickets, and Notifications (placeholders ready for team members to implement).
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
│       │   ├── GlobalExceptionHandler.java   # Structured error responses
│       │   ├── SecurityConfig.java           # Spring Security + OAuth2
│       │   └── WebConfig.java                # CORS configuration
│       ├── controller/
│       │   ├── AuthController.java           # GET /api/auth/me
│       │   ├── ResourceController.java       # CRUD /api/resources
│       │   └── UserController.java           # Admin user management
│       ├── dto/
│       │   └── ErrorResponse.java
│       ├── entity/
│       │   ├── Resource.java                 # resources table
│       │   └── UserProfile.java              # user_profiles table
│       ├── repository/
│       │   ├── ResourceRepository.java
│       │   └── UserProfileRepository.java
│       └── service/
│           ├── CustomOAuth2UserService.java  # Google login + role assignment
│           └── ResourceService.java
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                           # Router configuration
        ├── context/
        │   └── UserContext.jsx               # Logged-in user context
        ├── components/
        │   └── DashboardLayout.jsx           # Sidebar + top navbar
        └── pages/
            ├── LoginPage.jsx                 # Google Sign-in button
            └── ResourcesPage.jsx             # Resource list + admin CRUD
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

No additional configuration is needed for local development. The API base URL is set to `http://localhost:8080` inside the source files.

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

### User Management (Admin only)

| Method | Endpoint                        | Auth  | Description                                       |
| ------ | ------------------------------- | ----- | ------------------------------------------------- |
| `GET`  | `/api/admin/users`              | ADMIN | List all registered users                         |
| `GET`  | `/api/admin/users/technicians`  | ADMIN | List users with TECHNICIAN role                   |
| `PUT`  | `/api/admin/users/{email}/role` | ADMIN | Update a user's role (`{ "role": "TECHNICIAN" }`) |

---

## Roles & Permissions

| Role         | Description                                        | Assigned By                                                |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------- |
| `USER`       | Default role for all new Google sign-ins           | Automatic                                                  |
| `TECHNICIAN` | Maintenance staff; handles assigned incidents      | Admin via API                                              |
| `ADMIN`      | Full access including resource and user management | Seeded via `app.admin.emails` or promoted by another admin |

Role enforcement uses Spring Security's `@PreAuthorize("hasRole('ADMIN')")` on controller methods. The frontend conditionally renders admin controls (Add / Edit / Delete buttons) based on the role returned by `/api/auth/me`.

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

Schema is managed by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) — tables are created automatically on first run.
