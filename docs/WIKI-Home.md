# Underground – Tu Portal de Eventos

MVP de plataforma web para eventos underground, alternativos, culturales e independientes.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS
- **Backend:** API Routes Next.js, Prisma ORM, SQLite (modo local)
- **Auth:** NextAuth con credenciales (email/contraseña)
- **Validación:** Zod

## Requisitos

- Node.js 18+ (instalar desde [nodejs.org](https://nodejs.org) si no está en el PATH)
- SQLite (archivo local, no requiere instalación aparte)
- npm (incluido con Node.js)

## Instalación y ejecución local

Sigue estos pasos **en orden**. Todos han sido verificados en entorno local.

### 1. Clonar e instalar dependencias

Si acabas de clonar el repo, entra a la carpeta del proyecto. Si ya abriste el proyecto en el IDE, la terminal suele estar en la raíz y **no** hace falta el `cd`:

```bash
cd portal-de-eventos-underground   # solo si estás en la carpeta padre (ej. 7mo/web)
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

- **Linux / macOS:** `cp .env.example .env`
- **Windows (CMD):** `copy .env.example .env`
- **Windows (PowerShell):** `Copy-Item .env.example .env`

Edita `.env` y configura al menos:

- `DATABASE_URL`: ruta a SQLite (ej. `file:./dev.db`)
- `NEXTAUTH_SECRET`: secreto para sesiones (generar con `openssl rand -base64 32` o cualquier string seguro)
- `NEXTAUTH_URL`: URL de la app (en local: `http://localhost:3000`)

### 3. Crear base de datos y tablas

```bash
npm run db:generate
npm run db:push
```

- `db:generate` genera el cliente de Prisma (necesario para que no aparezca error en `lib/prisma.ts`).
- `db:push` crea o actualiza las tablas en la base SQLite según el schema.

### 4. Cargar datos iniciales (opcional)

```bash
npm run db:seed
```

Esto crea usuarios de prueba y eventos de ejemplo:

- **Admin:** `admin@underground.local` / `admin123`
- **Organizador:** `organizer@underground.local` / `organizer123`
- **Usuario:** `user@underground.local` / `user123`
- Varios eventos de ejemplo

### 5. Arrancar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La aplicación quedará corriendo en esa URL.

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Error en `lib/prisma.ts` con `PrismaClient` | Ejecutar `npx prisma generate` y volver a arrancar con `npm run dev`. |
| `npm` o `node` no reconocido | Instalar Node.js desde [nodejs.org](https://nodejs.org) y **reiniciar la terminal** (o Cursor). |
| La app se queda cargando | Asegurarse de haber ejecutado `npm run db:generate` y `npm run db:push`; no tener otra instancia (otra terminal con `npm run dev` o Prisma Studio) usando la misma base de datos. |
| Puerto 3000 en uso | Cerrar el otro proceso que usa el puerto 3000 o usar otra terminal para el proyecto. |

---

## Ejecutar con Docker

Construcción en varias etapas y ejecución con Docker Compose:

```bash
# Crear .env con NEXTAUTH_SECRET y NEXTAUTH_URL (ver .env.example)
docker compose build
docker compose up -d
```

La app queda en **http://localhost:3000**. La base SQLite se persiste en un volumen. Detalles y seed en [DOCKER.md](../DOCKER.md).

---

## Estructura del proyecto

```
/app
  /api          → API Routes (auth, events, favorites)
  /auth         → Login y registro
  /events       → Listado, detalle, crear, editar, favoritos, “mis eventos”
  /admin        → Panel admin (solo ADMIN)
/components     → Componentes reutilizables
/lib            → Prisma, NextAuth, validaciones
/prisma         → Schema y seed
```

## Roles

- **USER:** Asistente; puede ver eventos, guardar favoritos.
- **ORGANIZER:** Publica y gestiona sus propios eventos.
- **ADMIN:** Gestiona todo el contenido y ve usuarios registrados.

## Funcionalidades MVP

- Autenticación: registro, login, logout, protección por rol
- Eventos: crear, editar, eliminar, listar, ver detalle (con categoría, fecha, ubicación, imagen, estado)
- Exploración: listado con filtros por fecha y categoría
- Favoritos: guardar evento y ver lista de guardados
- Admin: ver todos los eventos y usuarios, eliminar eventos

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Sincronizar schema con la DB |
| `npm run db:seed` | Ejecutar seed |
| `npm run db:studio` | Abrir Prisma Studio |

## Licencia

Proyecto académico.
