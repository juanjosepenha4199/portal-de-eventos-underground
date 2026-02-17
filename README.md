# Underground – Tu Portal de Eventos

MVP de plataforma web para eventos underground, alternativos, culturales e independientes.

## Stack

- **Frontend:** React con Next.js (App Router), TypeScript, TailwindCSS
- **Backend:** API Routes Next.js, Prisma ORM, SQLite (modo local)
- **Auth:** NextAuth con credenciales (email/contraseña) y **Google** (OAuth)
- **Validación:** Zod

## Requisitos

- Node.js 18+
- SQLite (archivo local)
- npm

## Instalación y ejecución local

1. **Clonar e instalar dependencias**

   Si acabas de clonar el repo, entra a la carpeta del proyecto (si ya abriste el proyecto en el IDE, la terminal ya está en la raíz y **no** hace falta este `cd`):

   ```bash
   cd portal-de-eventos-underground   # solo si estás en la carpeta padre (ej. 7mo/web)
   npm install                       # instala dependencias de frontend y backend (workspaces)
   ```

   **Variables de entorno:** Copia `.env` a `frontend/` y a `backend/` (o crea un `.env` en cada uno con las mismas variables), para que tanto Next.js como los comandos de Prisma (`db:generate`, `db:push`, `db:seed`) tengan acceso.

2. **Configurar variables de entorno**

   Copia el archivo de ejemplo y ajusta los valores:

   ```bash
   cp .env.example .env
   ```

   Edita `.env`:

   - `DATABASE_URL`: ruta a SQLite (ej. `file:./dev.db`)
   - `NEXTAUTH_SECRET`: secreto para sesiones (generar con `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: URL de la app (en local: `http://localhost:3000`)
   - **Google (opcional):** `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` para iniciar sesión con cuenta de Google (crear en [Google Cloud Console](https://console.cloud.google.com/apis/credentials); URI de redirección: `NEXTAUTH_URL/api/auth/callback/google`)

3. **Crear base de datos y tablas**

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Cargar datos iniciales (opcional)**

   ```bash
   npm run db:seed
   ```

   Esto crea usuarios de prueba y dos eventos:

   - **Admin:** `admin@underground.local` / `admin123`
   - **Organizador:** `organizer@underground.local` / `organizer123`
   - **Usuario:** `user@underground.local` / `user123`

5. **Arrancar la aplicación**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

### Si en Windows PowerShell dice "la ejecución de scripts está deshabilitada"

PowerShell puede bloquear `npm` porque lo ejecuta como script. Dos opciones:

- **Opción A – Usar CMD:** En Cursor/VS Code abre una terminal **CMD** (menú desplegable de la terminal → "Command Prompt") y ejecuta ahí `npm install`, `npm run dev`, etc.
- **Opción B – Permitir scripts en PowerShell:** Abre PowerShell **como administrador**, ejecuta una sola vez:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
  Luego cierra y vuelve a abrir la terminal del proyecto.

## Ejecutar con Docker

Construcción en varias etapas (dependencias → compilado → imagen final) y ejecución con Docker Compose:

```bash
# Crear .env con NEXTAUTH_SECRET y NEXTAUTH_URL (ver .env.example)
docker compose build
docker compose up -d
```

La app queda en **http://localhost:3000**. La base SQLite se persiste en un volumen. Detalles y seed en [DOCKER.md](./DOCKER.md).

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

El proyecto está organizado en **frontend** y **backend**, cada uno con su propio `src`:

- **frontend/src/** — App Next.js: `app/` (páginas y API routes), `components/`, `lib/` (i18n, theme, cart).
- **backend/src/** — Lógica de servidor: Prisma, NextAuth, Stripe, validaciones; el frontend importa `@portal/backend`.
- **backend/prisma/** — Schema y seed de la base de datos.

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

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Servidor de producción   |
| `npm run db:push` | Sincronizar schema con la DB |
| `npm run db:seed` | Ejecutar seed            |
| `npm run db:studio` | Abrir Prisma Studio   |

## Licencia

Proyecto académico.
