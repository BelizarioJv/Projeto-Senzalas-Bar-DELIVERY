import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(100)
    .regex(/^[\p{L}\s'’-]+$/u, "Nome inválido."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(255),

  phone: z
    .string()
    .trim()
    .regex(
      /^\+55\s\d{2}\s\d{4,5}-\d{4}$/,
      "Informe um número de telefone válido.",
    ),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no máximo 72 caracteres.")
    .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
    .regex(/[a-z]/, "Inclua uma letra minúscula.")
    .regex(/[0-9]/, "Inclua um número."),
});
