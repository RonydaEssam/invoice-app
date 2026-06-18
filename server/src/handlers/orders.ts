import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { Prisma } from '../../generated/prisma/client';
import { createOrderSchema, updateOrderSchema } from '../schemas/orders.schema';

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({ include: { orderItems: true } });

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders', error);

        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

const getOrderById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await prisma.order.findUnique({ where: { id }, include: { orderItems: true } });

        if (!order) {
            return res.status(404).json({ error: 'order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order', error);

        return res.status(500).json({ error: 'Failed to fetch order' });
    }
}

const createOrder = async (req: Request, res: Response) => {
    try {
        const data = createOrderSchema.parse(req.body);
        const newOrder = await prisma.order.create({
            data: {
                clientId: data.clientId,
                status: 'Open',
                orderItems: {
                    create: data.orderItems.map(item => ({
                        serviceId: item.serviceId,
                        quantity: item.quantity
                    }))
                }
            },
            include: {
                orderItems: true
            }
        })

        return res.status(201).json({ message: 'new order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order', error);

        return res.status(400).json({ error: 'Failed to create order' });
    }
}

const updateOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await prisma.order.findUnique({ where: { id } });
        const data = updateOrderSchema.parse(req.body);

        if (!order) {
            return res.status(404).json({ error: 'ordernot found' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: data.status,
                orderItems: {
                    create: data.newItems?.map(item => ({
                        serviceId: item.serviceId,
                        quantity: item.quantity
                    })),
                    update: data.updateItems?.map(item => ({
                        where: { id: item.id },
                        data: {
                            serviceId: item.serviceId,
                            quantity: item.quantity
                        }
                    })),
                    delete: data.deleteItemsById?.map(id => ({ id }))
                }
            } as Prisma.OrderUpdateInput,
            include: { orderItems: true }
        });

        return res.status(200).json({ message: 'order data updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order', error);

        return res.status(500).json({ error: 'Failed to update order' });
    }
}

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await prisma.order.findUnique({ where: { id } });

        if (!order) {
            return res.status(404).json({ error: 'order not found' });
        }

        await prisma.order.delete({ where: { id } });

        return res.status(200).json({ message: `order with id ${id} is deleted` });
    } catch (error) {
        console.error('Error deleting order', error);

        return res.status(500).json({ error: 'Failed to delete order' });
    }

}

export { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };