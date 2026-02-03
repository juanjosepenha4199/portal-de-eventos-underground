# Underground – Tu Portal de Eventos

MVP de plataforma web para eventos underground, alternativos, culturales e independientes.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS
- **Backend:** API Routes Next.js, Prisma ORM, SQLite (modo local)
- **Auth:** NextAuth con credenciales (email/contraseña)
- **Validación:** Zod

## Requisitos

- Node.js 18+
- SQLite (archivo local)
- npm

## Instalación y ejecución local

1. **Clonar e instalar dependencias**

   ```bash
   cd portal-de-eventos-underground
   npm install
   ```

2. **Configurar variables de entorno**

   Copia el archivo de ejemplo y ajusta los valores:

   ```bash
   cp .env.example .env
   ```

   Edita `.env`:

   - `DATABASE_URL`: ruta a SQLite (ej. `file:./dev.db`)
   - `NEXTAUTH_SECRET`: secreto para sesiones (generar con `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: URL de la app (en local: `http://localhost:3000`)

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
