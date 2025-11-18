# Multi-stage Backend Dockerfile (FastAPI + Uvicorn)

FROM python:3.12-slim AS builder

# Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# Install build-time dependencies needed to compile wheels (bcrypt, etc.)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential \
	   libpq-dev \
	   libffi-dev \
	   libssl-dev \
	   python3-dev \
	   pkg-config \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency file and build wheels into /wheels
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Install wheels into a local prefix (/install)
RUN pip install --no-cache-dir --prefix=/install /wheels/*

# Final minimal image
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

# Runtime deps (small set) and curl for healthcheck
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   curl \
	&& rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Create app directory
WORKDIR /app

# Copy application code (do not copy build deps)
COPY . .

# Ensure pip-installed entrypoints are available
ENV PATH=/usr/local/bin:$PATH

# Expose backend port
EXPOSE 8000

# Run backend with reload in development (volumes are mounted by docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
