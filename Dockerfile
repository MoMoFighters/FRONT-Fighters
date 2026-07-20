# ---- deps: install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: build the Next.js app ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* 값은 빌드 시점에 코드에 인라인되므로 build-arg로 받아야 함
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_STOMP_URL
ARG NEXT_PUBLIC_STOMP_TRANSPORT
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_STOMP_URL=$NEXT_PUBLIC_STOMP_URL \
    NEXT_PUBLIC_STOMP_TRANSPORT=$NEXT_PUBLIC_STOMP_TRANSPORT

RUN npm run build

# ---- runner: minimal runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV PORT=4444
EXPOSE 4444

CMD ["node", "server.js"]
