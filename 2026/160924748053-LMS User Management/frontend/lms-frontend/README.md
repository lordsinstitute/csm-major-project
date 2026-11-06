# LMS User Management - Frontend

React app for the LMS User Management System.

## Tech Stack
- React 18
- React Router v6
- Axios

## Setup

```bash
cd lms-frontend
npm install
npm start
```

The app will run on **http://localhost:3000** and talk to the backend at
**http://localhost:8080/api** (see `src/api/axiosConfig.js` if you need to change this).

Make sure the backend (`lms-backend`) is running first — CORS is pre-configured on
the backend to allow `http://localhost:3000`.

## Features
- **Register / Login** with JWT authentication (token stored in `localStorage`)
- **Dashboard** — shows the logged-in user's profile
- **Manage Users** (Admin only) — list, edit, and delete users
- Route protection: `/dashboard` requires login, `/users` requires the `ADMIN` role

## Folder structure
```
src/
  api/axiosConfig.js       - axios instance with JWT interceptor
  context/AuthContext.js   - global auth state (login/register/logout)
  components/              - Navbar, ProtectedRoute
  pages/                   - Home, Login, Register, Dashboard, UserManagement
  App.js                   - route definitions
  index.js                 - app entry point
```

## Test flow
1. Start the backend, then run `npm start` here.
2. Go to **Register**, create an account with role `ADMIN` (this becomes your admin login).
3. Log in — you'll land on the Dashboard and see a "Manage Users" link in the navbar.
4. Register a couple more accounts with roles `STUDENT` / `INSTRUCTOR` to see them listed
   in **Manage Users**, where you can edit or delete them.
