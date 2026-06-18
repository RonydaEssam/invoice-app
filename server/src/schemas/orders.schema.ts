import { date, z } from 'zod';
import { prisma } from '../database/prisma';

const createOrderSchema = z.object({
    clientId: z.number(),
    orderItems: z.array(z.object({
        serviceId: z.number(),
        quantity: z.number().min(1),
    })),
});

const updateOrderSchema = z.object({
    status: z.enum(['Open', 'Closed']).optional(),
    newItems: z.array(z.object({
        serviceId: z.number(),
        quantity: z.number().min(1),
    })).optional(),
    updateItems: z.array(z.object({
        id: z.number(),
        serviceId: z.number(),
        quantity: z.number().min(1),
    })).optional(),
    deleteItemsById: z.array(z.number()).optional()
});

type CreateOrderInput = z.infer<typeof createOrderSchema>
type UpdateOrderInput = z.infer<typeof updateOrderSchema>

export { createOrderSchema, updateOrderSchema };
export type { CreateOrderInput, UpdateOrderInput };