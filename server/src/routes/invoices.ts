import { Router } from "express";
import { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice } from "../handlers/invoices";

const invoiceRouter = Router();

invoiceRouter.get('/', getAllInvoices);
invoiceRouter.get('/:id', getInvoiceById);
invoiceRouter.post('/', createInvoice);
invoiceRouter.patch('/:id', updateInvoice);
invoiceRouter.delete('/:id', deleteInvoice);

export { invoiceRouter };