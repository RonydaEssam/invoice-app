import { z } from 'zod';

const createServiceSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    price: z.number().min(1)
})

const updateServiceSchema = createServiceSchema.partial();

type CreateServiceInput = z.infer<typeof createServiceSchema>
type UpdateServiceInput = z.infer<typeof updateServiceSchema>

export { createServiceSchema, updateServiceSchema };
export type { CreateServiceInput, UpdateServiceInput }