/**
 * @portal/backend – Lógica de servidor, Prisma, auth y validaciones.
 * Consumido por el frontend (Next.js) en las API routes.
 */

export { prisma } from "./lib/prisma";
export { authOptions } from "./lib/auth";
export { eventSchema, type EventFormData } from "./lib/validations/event";
export {
  stripe,
  parsePriceToCents,
  isPaidEvent,
  getEventAmountCents,
} from "./lib/stripe";
