import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createInvoiceSchema, updateInvoiceSchema } from "../schemas/invoice.schema";

const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await prisma.invoice.findMany();

        return res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices', error);

        return res.status(500).json('Failed to fetch invoices')
    }
}

const getInvoiceById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { order: { include: { orderItems: true } } }
        });

        if (!invoice) {
            return res.status(404).json({ error: 'invoice not found' });
        }
        return res.status(200).json(invoice);
    } catch (error) {
        console.error('Error fetching invoice', error);

        return res.status(500).json('Failed to fetch invoice')
    }
}

const createInvoice = async (req: Request, res: Response) => {
    try {
        const { orderId } = createInvoiceSchema.parse(req.body);

        const oldInvoice = await prisma.invoice.findUnique({ where: { orderId: orderId } });
        if (oldInvoice) {
            return res.status(409).json({ error: `invoice with order id ${orderId} is already there`, invoice: oldInvoice });
        }

        const orderItems = await prisma.orderItem.findMany({ where: { orderId: orderId }, include: { service: true } });

        const totalPrice = orderItems.reduce((sum, item) => sum + (item.quantity * item.service.price), 0);

        const newInvoice = await prisma.invoice.create({
            data: {
                orderId: orderId,
                status: 'Draft',
                totalPrice: totalPrice
            }
        });

        return res.status(201).json({ message: 'new invoice created successfully', invoice: newInvoice });
    } catch (error) {
        console.error('Error creating invoice', error);

        return res.status(500).json('Failed to create invoice');
    }
}

const updateInvoice = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = updateInvoiceSchema.parse(req.body);
        const invoice = await prisma.invoice.findUnique({ where: { id } });

        if (!invoice) {
            return res.status(404).json({ error: 'invoice not found' });
        }

        const updatedInvoice = await prisma.invoice.update({ where: { id }, data: { status: status } })

        return res.status(200).json({ message: 'invoice data updated successfully', invoice: updatedInvoice });
    } catch (error) {
        console.error('Error updating invoice', error);

        return res.status(500).json('Failed to update invoice');
    }
}

const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const invoice = await prisma.invoice.findUnique({ where: { id } });

        if (!invoice) {
            return res.status(404).json({ error: 'invoice not found' });
        }

        await prisma.invoice.delete({ where: { id } });

        return res.status(200).json({ message: `invoice with id ${id} is deleted` });
    } catch (error) {
        console.error('Error deleting invoice', error);

        return res.status(500).json('Failed to delete invoice');
    }
}

export { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };