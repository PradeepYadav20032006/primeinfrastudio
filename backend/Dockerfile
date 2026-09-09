# Use lightweight official Node.js Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install curl for optional container healthchecks
RUN apk add --no-cache curl

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Create directory for persistent uploads
RUN mkdir -p uploads

# Expose backend API port
EXPOSE 5000

# Health check to ensure container is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
