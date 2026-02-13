# -----------------------------------------------------------------------------
# Etapa 1: Dependencias
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# -----------------------------------------------------------------------------
# Etapa 2: Compilado (Prisma generate + Next.js build)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar cliente Prisma (necesario para el build y el runtime)
RUN npx prisma generate

# Build de Next.js (output standalone para imagen mínima)
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

# Copiar salida standalone de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma: schema para db push en arranque (el cliente ya va en standalone)
COPY --from=builder /app/prisma ./prisma
RUN npm install prisma@6 --no-save --ignore-scripts

# Directorio para SQLite (se monta como volumen en docker-compose)
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

# Aplicar schema a la DB (idempotente) y arrancar el servidor
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["npx prisma db push --accept-data-loss --schema=/app/prisma/schema.prisma 2>/dev/null || true && node server.js"]
