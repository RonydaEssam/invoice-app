import { z } from 'zod';

const createInvoiceSchema = z.object({
    orderId: z.number(),
});

const updateInvoiceSchema = z.object({
    status: z.enum(['Draft', 'Sent', 'Paid'])
})

type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

export { createInvoiceSchema, updateInvoiceSchema };
export type { CreateInvoiceInput, UpdateInvoiceInput };