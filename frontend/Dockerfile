# --- Frontend Dockerfile (React + Vite) ---

FROM node:18-slim

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application
COPY . .

# Expose frontend dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]