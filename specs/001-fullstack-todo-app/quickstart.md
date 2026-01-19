# Quickstart Guide: Full-Stack Todo Application

**Feature Branch**: `001-fullstack-todo-app`
**Date**: 2026-01-13

## Prerequisites

- Python 3.11+
- Node.js 18+ (for Next.js 16+)
- pnpm or npm
- Neon PostgreSQL account (free tier available)

## Environment Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd web-todo-2phase
git checkout 001-fullstack-todo-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Backend Environment Configuration

Create `backend/.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440  # 24 hours

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

**Important**: Get your `DATABASE_URL` from Neon dashboard.

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
pnpm install
# or
npm install
```

### 5. Frontend Environment Configuration

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running the Application

### Start Backend

```bash
cd backend
# Activate virtual environment if not active
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API documentation at: `http://localhost:8000/docs`

### Start Frontend

```bash
cd frontend
pnpm dev
# or
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Verification Steps

### 1. Verify Backend Health

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 3. Test User Login

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
# Expected: {"access_token": "...", "token_type": "bearer"}
```

### 4. Test Task Creation (with token)

```bash
# Replace <TOKEN> with actual token from signin
curl -X POST http://localhost:8000/api/1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title": "My first task", "description": "Test description"}'
```

### 5. Test Frontend Flow

1. Open `http://localhost:3000`
2. Navigate to Sign Up page
3. Create an account
4. Sign in with credentials
5. Create, view, edit, complete, and delete tasks

## Common Issues

### Database Connection Failed

- Verify `DATABASE_URL` is correct in `.env`
- Ensure Neon project is active
- Check SSL mode is set to `require`

### JWT Token Invalid

- Ensure `JWT_SECRET_KEY` is set in backend `.env`
- Check token hasn't expired
- Verify token is being sent in `Authorization: Bearer <token>` format

### CORS Errors

Backend should have CORS configured for frontend origin:

```python
# In backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Port Already in Use

```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/signup | Register user | No |
| POST | /api/auth/signin | Login user | No |
| GET | /api/{user_id}/tasks | List tasks | Yes |
| POST | /api/{user_id}/tasks | Create task | Yes |
| GET | /api/{user_id}/tasks/{id} | Get task | Yes |
| PUT | /api/{user_id}/tasks/{id} | Update task | Yes |
| DELETE | /api/{user_id}/tasks/{id} | Delete task | Yes |
| PATCH | /api/{user_id}/tasks/{id}/complete | Toggle complete | Yes |

## Next Steps

After verifying the quickstart:

1. Run `/sp.tasks` to generate implementation tasks
2. Execute tasks sequentially following dependency order
3. Validate against spec acceptance criteria
4. Run security tests for user isolation
