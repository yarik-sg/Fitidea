# --- Backend Dockerfile (FastAPI + Uvicorn) ---

FROM python:3.12-slim

# Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# Install system deps
RUN apt-get update && apt-get install -y build-essential libpq-dev && apt-get clean

# Create app directory
WORKDIR /app

# Copy dependency file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose backend port
EXPOSE 8000

# Run backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
