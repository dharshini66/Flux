# Multi-Stage Dockerfile for FLUX Market Intelligence
# Stage 1: Compile React Frontend SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci || npm install

COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./

RUN npm run build

# Stage 2: Production Python Backend + Static Files
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    HOST=0.0.0.0 \
    ENVIRONMENT=production \
    DEBUG=false

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# Copy compiled frontend assets from Stage 1 into expected locations
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 8000

WORKDIR /app/backend

# Run uvicorn on dynamic port assigned by Render ($PORT)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
