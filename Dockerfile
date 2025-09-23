# Multi-stage build for SvelteKit application

# ================================
# 1. Build stage
# ================================
FROM node:20.19.2-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build


# ================================
# 2. Production stage
# ================================
FROM node:20.19.2-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S sveltekit -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Disable husky (git hooks not needed in production)
ENV HUSKY=0

# Install only production dependencies (skip postinstall/prepare)
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/migrations ./migrations
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static

# Switch to non-root user
USER sveltekit

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["dumb-init", "node", "build"]
