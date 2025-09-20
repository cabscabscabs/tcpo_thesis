# Multi-stage Dockerfile for USTP TPCO application

# Stage 1: Build the React frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Setup the Node.js backend server
FROM node:18-alpine AS server

WORKDIR /app

# Copy server package files
COPY server/package*.json ./
COPY server/package-lock.json ./

# Install server dependencies
RUN npm ci

# Copy server source code
COPY server/. ./

# Stage 3: Production image
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files from server stage
COPY --from=server /app ./server

# Expose ports
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV SERVE_FRONTEND=true
ENV PORT=3001

# Start the server
CMD ["node", "server/server.js"]