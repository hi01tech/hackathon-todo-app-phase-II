# Todo App Frontend

A modern, responsive todo application with user authentication and task management features.

## Features

- User authentication (signup/login)
- Secure JWT-based authentication
- Create, read, update, and delete tasks
- Toggle task completion status
- Responsive design for desktop, tablet, and mobile
- Clean, modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Access to the backend API

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the environment configuration:

```bash
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── dashboard/      # Dashboard page
├── components/         # Reusable UI components
│   └── ui/             # UI-specific components
├── lib/               # Utility functions and API client
├── styles/            # Global styles
└── public/            # Static assets
```

## Key Components

- `ProtectedRoute`: Wrapper for authenticated routes
- `TaskCard`: Display component for individual tasks
- `TaskForm`: Form for creating and updating tasks
- `api-client.ts`: Centralized API client with JWT handling

## API Integration

The frontend communicates with the backend through a centralized API client that:
- Automatically attaches JWT tokens to authenticated requests
- Handles loading and error states
- Provides consistent error handling