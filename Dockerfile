# deps
FROM oven/bun:1-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl build-base python3 py3-setuptools
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# build
FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build

# runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile --production && \
    bun pm cache rm

COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs
EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && node dist/main.js"]
