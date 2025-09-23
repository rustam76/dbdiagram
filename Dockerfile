# ==================================
# 1. Build stage (Node 20.19.2 full)
# ==================================
FROM node:20.19.2 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

# copy semua source termasuk config
COPY . .

RUN npx svelte-kit sync
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


# ==================================
# 2. Production stage (Node 20.19.2-alpine)
# ==================================
FROM node:20.19.2-alpine AS production
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S sveltekit -u 1001
WORKDIR /app

COPY package*.json ./
ENV HUSKY=0
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# 👇 copy hasil build + config (supaya lengkap)
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/migrations ./migrations
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static
COPY --from=builder --chown=sveltekit:nodejs /app/postcss.config.cjs ./postcss.config.cjs
COPY --from=builder --chown=sveltekit:nodejs /app/tailwind.config.cjs ./tailwind.config.cjs

USER sveltekit
EXPOSE 3000
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0

CMD ["dumb-init", "node", "build"]
