import { optional, z } from 'zod';
import { EnumInvoiseStatusFilter } from '../../generated/prisma/commonInputTypes';

const createClientSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    address: z.string().min(2)
})

const updateClientSchema = createClientSchema.partial();

type CreateClientInput = z.infer<typeof createClientSchema>
type UpdateClientInput = z.infer<typeof updateClientSchema>

export { createClientSchema, updateClientSchema }
export type { CreateClientInput, UpdateClientInput }