import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const MIN_FOLLOWERS = 500;

const sellerApplicationSchema = z.object({
  instagramHandle: z.string().min(2, "Usuario de Instagram requerido"),
  instagramFollowers: z.number().int().min(MIN_FOLLOWERS, `Mínimo ${MIN_FOLLOWERS} seguidores`),
  idDocumentNumber: z.string().min(5, "Número de documento requerido"),
  idDocumentUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().min(1).optional(),
});

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(1, "Nombre requerido").optional(),
  registerAsSeller: z.boolean().optional(),
  sellerApplication: sellerApplicationSchema.optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name, registerAsSeller, sellerApplication } = parsed.data;

    if (registerAsSeller && !sellerApplication) {
      return NextResponse.json(
        { error: "Datos de solicitud de vendedor requeridos" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name ?? null, role: "USER" },
    });

    if (registerAsSeller && sellerApplication) {
      await prisma.sellerApplication.create({
        data: {
          userId: user.id,
          instagramHandle: sellerApplication.instagramHandle.trim(),
          instagramFollowers: sellerApplication.instagramFollowers,
          idDocumentNumber: sellerApplication.idDocumentNumber.trim(),
          idDocumentUrl: sellerApplication.idDocumentUrl?.trim() || null,
          phone: sellerApplication.phone?.trim() || null,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
