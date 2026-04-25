# Parent Portal Workspace

This repository contains two related projects for a parent portal application:

- `parent-portal/` — frontend application built with Vite and React
- `parent-portal-backend/` — backend API server for authentication and student data

## Project structure

- `parent-portal/`
  - `src/` — React source files
  - `public/` — static assets
  - `package.json` — frontend dependencies and scripts

- `parent-portal-backend/`
  - `models/` — MongoDB schemas for student and related data
  - `routes/` — API route handlers
  - `middlewares/` — auth middleware
  - `server.js` — backend application entry point
  - `package.json` — backend dependencies and scripts

## Setup

Each project can be installed and run independently.

### Frontend

```bash
cd parent-portal
npm install
npm run dev
```

### Backend

```bash
cd parent-portal-backend
npm install
npm run dev
```

## Notes

- Add any required `.env` files inside `parent-portal-backend/` if needed for database connection or secrets.
- The root `.gitignore` excludes generated files and node modules for both subprojects.
