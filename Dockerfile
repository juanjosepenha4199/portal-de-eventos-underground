# -----------------------------------------------------------------------------
# Etapa 1: Dependencias (monorepo frontend + backend)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY frontend ./frontend
COPY backend ./backend
RUN npm install

# -----------------------------------------------------------------------------
# Etapa 2: Compilado (Prisma generate en backend + Next.js build en frontend)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/package-lock.json* ./
COPY frontend ./frontend
COPY backend ./backend

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar cliente Prisma en backend (el frontend lo consume vía @portal/backend)
WORKDIR /app/backend
RUN npx prisma generate

WORKDIR /app
# Build de Next.js en frontend (output standalone)
RUN npm run build

# -----------------------------------------------------------------------------
# Etapa 3: Ejecución
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar salida standalone del frontend
COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

# Prisma para db push en arranque
COPY --from=builder /app/backend/prisma ./prisma
RUN npm install prisma@6 --no-save --ignore-scripts

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["npx prisma db push --accept-data-loss --schema=/app/prisma/schema.prisma 2>/dev/null || true && node server.js"]
