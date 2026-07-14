# 1. 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL
RUN npm run build

# 2. Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV PORT=4444
ENV HOSTNAME="0.0.0.0"
EXPOSE 4444

CMD ["node", "server.js"]