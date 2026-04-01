# ==========================================
# Build stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all packages
COPY packages/ ./packages/
COPY api/ ./api/
COPY web/ ./web/

# Install dependencies (only production for api)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd api && pnpm exec prisma generate

# Build API
RUN cd api && pnpm run build

# ==========================================
# Production stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built files and necessary workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY api/ ./api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema and generate client
COPY api/prisma/ ./api/prisma/
RUN cd api && pnpm exec prisma generate

# Expose port (Koyeb will override with PORT env var)
EXPOSE 3001

CMD ["node", "api/dist/main.js"]
