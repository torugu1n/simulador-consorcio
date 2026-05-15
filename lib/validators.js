import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
});

export const setupSchema = z.object({
  name: z.string().min(2, "Informe o nome do consultor."),
  email: z.string().email("Informe um email valido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
});

export const clientSchema = z.object({
  name: z.string().min(2, "Informe o nome do cliente."),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  document: z.string().optional(),
  status: z.string().min(2),
  notes: z.string().optional(),
  nextFollowUpAt: z.string().optional(),
});

export const interactionSchema = z.object({
  clientId: z.string().min(1),
  type: z.string().min(2),
  subject: z.string().min(2),
  notes: z.string().min(2),
  scheduledAt: z.string().optional(),
});

export const simulationSchema = z.object({
  clientId: z.string().optional().nullable(),
  title: z.string().min(2),
  notes: z.string().optional(),
  proposalTitle: z.string().optional(),
  clientName: z.string().optional(),
  consultantName: z.string().optional(),
  term: z.coerce.number().positive(),
  adminRate: z.coerce.number().nonnegative(),
  insuranceMonthlyRate: z.coerce.number().nonnegative(),
  assetValue: z.coerce.number().nonnegative(),
  ownResources: z.coerce.number().nonnegative(),
  embeddedBid: z.coerce.number().nonnegative(),
});
