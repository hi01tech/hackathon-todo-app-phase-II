# Todo Full-Stack Web Application

A modern, multi-user task management web application built with Next.js 16, FastAPI, and Neon Serverless PostgreSQL. This project demonstrates full-stack development with secure authentication, user isolation, and a responsive UI.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth (JWT-based)
- **State Management:** React Hooks

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** JWT token validation
- **API:** RESTful with OpenAPI documentation

### Development Tools
- **Methodology:** Spec-Driven Development (SDD) with Claude Code
- **Testing:** Pytest (backend), Jest (frontend)
- **Version Control:** Git

## 📋 Features

- ✅ **User Authentication:** Secure signup/signin with Better Auth
- ✅ **Task Management:** Full CRUD operations (Create, Read, Update, Delete)
- ✅ **User Isolation:** Tasks are scoped to authenticated users
- ✅ **Responsive UI:** Modern, accessible interface with dark mode
- ✅ **Real-time Updates:** Instant UI feedback on task operations
- ✅ **Data Persistence:** PostgreSQL database with proper indexing
- ✅ **API Documentation:** Auto-generated OpenAPI/Swagger docs

## 🛠️ Prerequisites

- **Node.js:** 18.x or higher
- **Python:** 3.9 or higher
- **Database:** Neon Serverless PostgreSQL account
- **Package Managers:** npm (frontend), pip (backend)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd phase-II
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your:
# - DATABASE_URL (Neon PostgreSQL connection string)
# - JWT_SECRET (shared secret with frontend)
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your:
# - NEXT_PUBLIC_API_URL (backend URL, default: http://localhost:8000)
# - BETTER_AUTH_SECRET (JWT secret matching backend)
# - BETTER_AUTH_URL (frontend URL, default: http://localhost:3000)
```

## 🚀 Running the Application

### Option 1: Using Convenience Scripts (Windows)

```bash
# Terminal 1: Start Backend
scripts\start-backend.bat

# Terminal 2: Start Frontend
scripts\start-frontend.bat
```

### Option 2: Manual Start

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📚 Project Structure

```
phase-II/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── auth/              # Authentication logic
│   │   ├── models/            # SQLModel schemas
│   │   ├── routers/           # API endpoints
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # Database connection
│   │   └── main.py            # FastAPI app entry
│   ├── tests/                 # Backend tests
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Backend documentation
├── frontend/                   # Next.js frontend
│   ├── app/                   # App Router pages
│   │   ├── dashboard/         # Main task dashboard
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── components/            # React components
│   ├── lib/                   # Utilities & API client
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   └── README.md              # Frontend documentation
├── tests/                      # Integration tests
│   └── integration/
├── docs/                       # Project documentation
│   ├── history/               # Development history
│   └── frontend/              # Frontend design docs
├── scripts/                    # Utility scripts
│   ├── start-backend.bat      # Start backend server (Windows)
│   └── start-frontend.bat     # Start frontend server (Windows)
├── specs/                      # Feature specifications (SDD)
├── history/                    # Prompt history records
├── .claude/                    # Claude Code agents & skills
├── .specify/                   # Spec-Kit Plus templates
├── CLAUDE.md                   # AI assistant instructions
├── QUICKSTART.md               # Quick setup guide
└── README.md                   # This file
```

## 🔐 Authentication Flow

1. **User Signup/Login:** Better Auth creates a session and issues a JWT token
2. **Token Storage:** Frontend stores JWT in HTTP-only cookies
3. **API Requests:** Frontend includes JWT in `Authorization: Bearer <token>` header
4. **Backend Validation:** FastAPI verifies JWT signature using shared secret
5. **User Identification:** Backend extracts user ID from token and filters data
6. **Data Isolation:** All database queries include user_id filter for security

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
cd tests/integration
python test_integration.py
```

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Key endpoints:
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task
- `PATCH /api/tasks/{task_id}/complete` - Toggle task completion

## 🎯 Development Methodology

This project was built using **Spec-Driven Development (SDD)** with Claude Code:

1. **Specification:** Clear feature requirements documented in `specs/`
2. **Planning:** Architectural decisions and implementation plans
3. **Tasks:** Break down into testable, atomic tasks
4. **Implementation:** Test-driven development with continuous validation
5. **Documentation:** Automatic prompt history records in `history/`

See `CLAUDE.md` for AI assistant guidelines and `QUICKSTART.md` for detailed setup.

## 🤝 Contributing

This is a hackathon project. For development workflow:

1. Read `CLAUDE.md` for project conventions
2. Check `specs/` for feature specifications
3. Review `docs/history/` for implementation notes
4. Follow existing code patterns and structure

## 📄 License

[Add your license here]

## 👥 Authors

[Add author information here]

## 🙏 Acknowledgments

- Built with Claude Code and Spec-Kit Plus
- Inspired by modern full-stack development practices
- Part of [Hackathon Name] Phase II

---

**Quick Start:** See [QUICKSTART.md](./QUICKSTART.md) for step-by-step setup instructions.
