#!/usr/bin/env python3
"""
Simple script to wait for database connectivity before starting the main application.
"""

import os
import time
import logging
from urllib.parse import urlparse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database_connection():
    """Check if the database is accessible."""
    import psycopg2

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        logger.error("DATABASE_URL environment variable not set")
        return False

    try:
        # Parse the database URL
        parsed = urlparse(database_url)
        host = parsed.hostname
        port = parsed.port or 5432
        database = parsed.path[1:]  # Remove leading slash
        user = parsed.username
        password = parsed.password

        # Attempt connection
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            connect_timeout=5
        )
        conn.close()
        return True
    except Exception as e:
        logger.warning(f"Database connection failed: {e}")
        return False

def main():
    """Wait for database to be ready before exiting."""
    max_attempts = 30
    attempt = 0

    logger.info("Waiting for database connection...")

    while attempt < max_attempts:
        if check_database_connection():
            logger.info("Database is ready!")
            return 0
        else:
            attempt += 1
            logger.info(f"Attempt {attempt}/{max_attempts} failed. Waiting 5 seconds...")
            time.sleep(5)

    logger.error("Could not connect to database after maximum attempts")
    return 1

if __name__ == "__main__":
    exit(main())