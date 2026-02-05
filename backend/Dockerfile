FROM python:3.11-slim

WORKDIR /code

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY wait-for-db.py ./wait-for-db.py

# Install psycopg2 for the wait script
RUN pip install psycopg2-binary

# Expose port for Hugging Face Spaces
EXPOSE 7860

# Add health check for Kubernetes
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7860/health || exit 1

# Run the application after waiting for database
CMD ["sh", "-c", "python wait-for-db.py && exec uvicorn app.main:app --host 0.0.0.0 --port 7860 --workers 1"]
