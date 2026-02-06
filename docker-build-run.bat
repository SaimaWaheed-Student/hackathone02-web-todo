@echo off
REM Docker build and run script for Todo Application (Windows)

echo Building Docker images for Todo Application...

REM Build the images
docker-compose build

echo Starting containers...
docker-compose up -d

echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Show running containers
echo Running containers:
docker-compose ps

echo.
echo Services are now running:
echo Frontend: http://localhost:7860
echo Backend: http://localhost:7861
echo Database: localhost:5432 (internal: db:5432)

echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down