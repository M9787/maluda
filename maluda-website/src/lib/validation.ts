import { z } from "zod";

const phonePattern = /^\+?[\d\s\-()]{5,20}$/;

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Минимум 2 символа").max(100),
  email: z.string().trim().toLowerCase().email("Некорректный email").max(120),
  phone: z.string().trim().min(5, "Введите номер телефона").max(20).regex(phonePattern, "Неверный формат номера"),
  courseInterest: z.enum(["python-sql", "data-analysis", "devops-cloud", "vibe-coding", "claude-code", "not-sure"]),
  source: z.enum(["friend", "ambassador", "instagram", "telegram", "event", "other"]).optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
