# Stage 1: Dependency resolution and build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production runtime image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN apk add --no-cache curl tini

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY . .

# Run under non-root node user for security
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/healthz || exit 1

# Tini forwards OS signals properly to Node.js
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
