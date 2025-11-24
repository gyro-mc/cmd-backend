import z from "zod";

export const CreateDoctorDtoSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["DOCTOR"]),
  salary: z.number().positive().optional(),
  isMedicalDirector: z.boolean().optional(),
  specialization: z.string().min(3).max(255).optional(),
});

export type createDoctorDto = z.infer<typeof CreateDoctorDtoSchema>;
