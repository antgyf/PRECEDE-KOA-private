# PRECEDE-TKA

## Project Overview

PRECEDE-TKA is a decision support tool designed to facilitate shared decision-making for patients considering total knee replacement surgery for knee osteoarthritis. The tool utilizes patient-reported outcomes to empower patients and enhance clinical communication.

## Tech Stack

The project is developed using TypeScript for both the frontend and backend components.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server that enhances the development experience.
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs quickly.
- **DaisyUI**: A component library built on top of Tailwind CSS that provides pre-designed components.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine for building scalable network applications.
- **Express**: A minimal and flexible Node.js web application framework for building APIs and web applications.
- **PostgreSQL**: A powerful, open-source relational database system.
- **AWS RDS**: Amazon Web Services Relational Database Service for hosting and managing PostgreSQL databases in the cloud.

### Testing

- **Frontend**:
  - **Jest**: A delightful JavaScript testing framework.
  - **React Testing Library**: A library for testing React components in a user-centric way.
- **Backend**:
  - **Jest**: Used for unit and integration testing of backend services.

## Folder Structure

## Installation Instructures

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/precede-TKA.git
   cd precede-TKA
   ```
2. Install dependencies for both frontend and backend

   ```bash
   # For frontend
   cd frontend
   npm install

   # For backend
   cd backend
   npm install
   ```

3. Set up environment variables for the backend (e.g. database connection details)
4. Start the development servers

   ```bash
   # For frontend
   npm start

   # For backend
   npm run start
   ```

## Architecture Diagram

## Features

### Staff analysis password

Before deploying the analysis gate, apply `functions/models/migrations/001_analysis_password_attempt.sql` to the target PostgreSQL database. The table tracks attempts across Netlify function instances.

Set `ANALYSIS_PASSWORD_HASH` in the Netlify Functions environment and in the backend environment used for local development. Supply a bcrypt hash of a shared staff password (1 to 72 UTF-8 bytes). From the repo root, you can generate the hash using a password supplied in the temporary shell environment variable `ANALYSIS_PASSWORD`:

```sh
node -e 'require("bcrypt").hash(process.env.ANALYSIS_PASSWORD, 12).then(console.log)'
```

Clear `ANALYSIS_PASSWORD` from the shell afterward. Share the password with authorized staff through the study team's secure channel. The app verifies it server-side and keeps the current assessment unlocked for up to 15 minutes within the staff session.
