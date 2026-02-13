# Ejecutar con Docker

## Requisitos

- Docker y Docker Compose instalados.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (junto a `docker-compose.yml`) con al menos:

```env
NEXTAUTH_SECRET=tu-secreto-generado
NEXTAUTH_URL=http://localhost:3000
```

Para generar un secreto:

```bash
openssl rand -base64 32
```

Opcionales: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc. (ver `.env.example`).

## Build e imagen

```bash
docker compose build
```

La imagen se construye en varias etapas: dependencias → compilado (Prisma + Next.js) → imagen final mínima.

## Arrancar la aplicación

```bash
docker compose up -d
```

La app queda en **http://localhost:3000**.

- La base de datos SQLite se persiste en el volumen `app-data`.
- En el primer arranque se aplica el schema de Prisma (`prisma db push`) automáticamente.

## Poblar datos (seed)

La imagen de producción no incluye `tsx`. Para cargar eventos y usuarios de ejemplo tienes dos opciones:

**Opción A – Desde el host** (con la app parada y el volumen creado):

```bash
# Crear el volumen y la DB
docker compose run --rm app npx prisma db push --accept-data-loss --schema=/app/prisma/schema.prisma

# Copiar el archivo de DB al host, ejecutar seed, volver a subir (o usar un volumen nombrado y ejecutar desde el host con Prisma)
# Más simple: ejecutar el seed en tu máquina antes de usar Docker, luego copiar prisma/dev.db al volumen o usar el mismo archivo.
```

**Opción B – Contenedor temporal con dependencias de desarrollo** (solo para seed inicial):

```bash
docker run --rm -v portal-de-eventos-underground_app-data:/data -v "$(pwd)":/app -w /app -e DATABASE_URL=file:/data/db.sqlite node:20-alpine sh -c "npm ci && npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts"
```

(Ajusta el nombre del volumen si usas otro.)

## Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `docker compose up -d` | Arrancar en segundo plano |
| `docker compose down` | Parar y quitar contenedores |
| `docker compose logs -f app` | Ver logs de la app |
| `docker compose build --no-cache` | Reconstruir sin caché |

## Solo Dockerfile (sin Compose)

```bash
docker build -t portal-underground .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=tu-secreto \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e DATABASE_URL=file:/app/data/db.sqlite \
  -v portal-data:/app/data \
  portal-underground
```
