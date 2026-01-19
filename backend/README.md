---
title: Todo API Backend
emoji: ✅
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# Todo API Backend

A FastAPI backend for a full-stack Todo application.

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task

## Environment Variables

This Space requires the following secrets to be configured:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret key for JWT token signing

## Usage

Once deployed, access the API documentation at:
- Swagger UI: `https://<space-name>.hf.space/docs`
- ReDoc: `https://<space-name>.hf.space/redoc`
