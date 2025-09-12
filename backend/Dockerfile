# syntax=docker/dockerfile:1

FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# Install OS deps needed by Prisma and openssl
RUN apk add --no-cache openssl

# Copy only package files first for caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY prisma ./prisma
COPY src ./src
COPY readme.md ./readme.md

# Generate Prisma client
RUN bun prisma generate

# Expose port
EXPOSE 3000

# Copy entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV NODE_ENV=production

ENTRYPOINT ["/docker-entrypoint.sh"]
