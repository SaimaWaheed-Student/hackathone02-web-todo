# Todo App - Full Stack Application

A modern full-stack todo application built with **Next.js** frontend and **FastAPI** backend.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **FastAPI** - Python web framework
- **SQLModel** - ORM (SQLAlchemy + Pydantic)
- **PostgreSQL** - Database (Neon Serverless)
- **JWT** - Authentication

## Features

- User Authentication (Sign Up / Sign In)
- Create, Read, Update, Delete Tasks
- Mark tasks as complete/incomplete
- Due date and time picker
- Responsive design
- Protected routes

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT & password utilities
│   │   ├── models/        # SQLModel database models
│   │   ├── routers/       # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── config.py      # Settings configuration
│   │   ├── database.py    # Database connection
│   │   └── main.py        # FastAPI app entry
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   └── hooks/         # Custom hooks
│   ├── package.json
│   └── .env.local.example
│
└── specs/                 # Project specifications
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database (or Neon account)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

6. Update `.env` with your database URL and JWT secret

7. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Screenshots

### Home Page
Landing page with features overview

### Tasks Page
Task management with CRUD operations

### Authentication
Sign up and sign in forms

## License

MIT License

## Author

**Saima Waheed**

---

Built with Next.js and FastAPI
