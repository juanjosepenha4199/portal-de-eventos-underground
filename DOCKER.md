# Ejecutar con Docker

## Requisitos

- Docker y Docker Compose instalados.

## Publicación automática (GitHub Actions)

El workflow `.github/workflows/publish.yml` construye y publica la imagen en **GitHub Packages** (ghcr.io) cuando haces push a `master` o abres un PR hacia `master`.

### Qué necesitas para que las imágenes aparezcan en Paquetes

1. **Rama por defecto**  
   En GitHub el repo debe tener como rama por defecto la que usa el workflow (`master`). Si usas `main`, cambia en el workflow `branches: [master]` por `branches: [main]` y la condición de `latest` a `refs/heads/main`.

2. **Disparar el workflow**  
   Haz **push a `master`** (o merge de un PR a `master`). La primera vez que termine bien, se creará el paquete en tu cuenta.

3. **Dónde ver el paquete**  
   - En GitHub: tu perfil → **Packages**, o en el repo en la columna derecha en “Packages”.  
   - La imagen queda en: **`ghcr.io/juanjosepenha4199/portal-de-eventos-underground`** (tags: `latest`, `master`).

4. **Vincular paquete al repo (opcional)**  
   Entra al paquete → **Package settings** → **Manage repository access** / **Link repository** y asocia `juanjosepenha4199/portal-de-eventos-underground` para que se vea desde el repo.

5. **Repositorio privado**  
   Si el repo es privado, el paquete también. Para hacer `docker pull` desde otra máquina necesitas:
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u juanjosepenha4199 --password-stdin
   ```
   (Token con permiso `read:packages`.)

### Usar la imagen publicada sin construir en local

```yaml
# En docker-compose.yml:
services:
  app:
    image: ghcr.io/juanjosepenha4199/portal-de-eventos-underground:latest
    # ... resto igual (ports, env, volumes)
```

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
