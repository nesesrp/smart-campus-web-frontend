# Development Dockerfile for Next.js Frontend with Hot Reload
# Uses development server with turbo mode for fast refresh

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy source code (this layer will be overwritten by volume mount)
COPY . .

# Environment variables for hot reload in Docker
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

# Run development server with turbo mode for faster hot reload
CMD ["npm", "run", "dev", "--", "--turbo"]
