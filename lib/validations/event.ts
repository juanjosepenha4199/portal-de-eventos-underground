import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  description: z.string().min(1, "Descripción requerida"),
  category: z.string().min(1, "Categoría requerida"),
  dateTime: z.string().datetime({ message: "Fecha y hora inválidas" }),
  location: z.string().min(1, "Ubicación requerida"),
  image: z.string().url().optional().or(z.literal("")),
  price: z.string().max(32).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "CANCELLED"]).optional().default("ACTIVE"),
});

export type EventFormData = z.infer<typeof eventSchema>;
