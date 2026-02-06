# Docker Setup for Todo Application

This guide explains how to build and run the Todo application using Docker and Docker Compose.

## Prerequisites

- Docker Engine installed and running
- Docker Compose installed
- At least 4GB of RAM available for all containers

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web-todo-2phase
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit the `.env` file and set your actual values:

- `JWT_SECRET_KEY`: Generate a strong secret key for JWT authentication
- `OPENROUTER_API_KEY`: Your OpenRouter API key for AI chatbot integration

### 3. Build and Run with Docker Compose

For Linux/Mac:
```bash
chmod +x docker-build-run.sh
./docker-build-run.sh
```

For Windows:
```cmd
docker-build-run.bat
```

Or run manually:
```bash
# Build the images
docker-compose build

# Start the services
docker-compose up -d
```

### 4. Access the Applications

Once all services are running:

- **Frontend**: [http://localhost:7860](http://localhost:7860)
- **Backend API**: [http://localhost:7861](http://localhost:7861)
- **Database**: Available internally at `db:5432`, mapped to `localhost:5432`

## Service Details

The Docker Compose setup includes three services:

### Database (PostgreSQL)
- Image: `postgres:15`
- Persistent volume for data storage
- Health check to ensure readiness
- Internal port: 5432
- External port: 5432

### Backend (FastAPI)
- Built from the `./backend` directory
- Port mapped to 7861 (to avoid conflicts with frontend)
- Depends on database health
- Health check endpoint
- Environment variables for database and API keys

### Frontend (Next.js)
- Built from the `./frontend` directory
- Port mapped to 7860
- Points to local backend at `http://localhost:7861/api`
- Depends on backend availability
- Health check endpoint

## Management Commands

### View Logs
```bash
# View all service logs
docker-compose logs

# Follow logs continuously
docker-compose logs -f

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Containers (including volumes)
```bash
docker-compose down -v
```

### Restart Specific Service
```bash
docker-compose restart backend
```

### Scale Services
```bash
# Run multiple instances of backend
docker-compose up -d --scale backend=2
```

### Rebuild Images
```bash
# Rebuild specific service
docker-compose build backend

# Rebuild all services
docker-compose build --no-cache
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Make sure ports 7860, 7861, and 5432 are available
   - Check with `netstat -an | grep :7860` (or respective port)

2. **Permission Errors**
   - On Unix systems, ensure you have permission to run Docker commands
   - Add your user to the docker group: `sudo usermod -aG docker $USER`

3. **Database Connection Issues**
   - Verify the database is healthy: `docker-compose ps`
   - Check the logs: `docker-compose logs db`

4. **Environment Variables Not Loading**
   - Ensure your `.env` file is in the same directory as `docker-compose.yml`
   - Verify variable names match exactly

### Health Checks

All services have health checks configured:
- Database: Uses `pg_isready` to check PostgreSQL status
- Backend: Checks `/health` endpoint
- Frontend: Checks `/healthz` endpoint

You can inspect health status with:
```bash
docker-compose ps
```

## Development Notes

### For Developers

- The setup supports hot-reloading for development if volumes are mounted
- For production deployments, consider using secrets management
- Monitor resource usage as all services run simultaneously
- The database volume persists data between container restarts

### Customization

You can customize the setup by:

1. Modifying the `docker-compose.yml` file
2. Adjusting environment variables in `.env`
3. Changing port mappings as needed
4. Adding additional services like Redis, monitoring, etc.

## Security Considerations

- Never commit actual API keys to version control
- Use strong passwords for database access
- Regularly update base images for security patches
- Consider using Docker secrets for sensitive data in production
- Restrict network access as appropriate

## Cleanup

To completely remove all containers, networks, and volumes:

```bash
docker-compose down -v --remove-orphans
```

To remove built images:
```bash
docker-compose down --rmi all
```

---

That's it! Your Todo application should now be running in Docker containers with full orchestration.