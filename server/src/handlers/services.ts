import { Request, Response } from 'express';
import { prisma } from "../database/prisma";
import { Prisma } from '../../generated/prisma/client';
import { createServiceSchema, updateServiceSchema } from "../schemas/service.schema";

const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany();

        return res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services', error);

        return res.status(500).json({ error: 'Failed to fetch services' })
    }
}

const getServiceById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const service = await prisma.service.findUnique({ where: { id } });

        if (!service) {
            return res.status(404).json({ error: 'service not found' })
        }

        return res.status(200).json(service);
    } catch (error) {
        console.error('Error fetching service', error);

        return res.status(500).json({ error: 'Failed to fetch service' })
    }
}

const createService = async (req: Request, res: Response) => {
    try {
        const data = createServiceSchema.parse(req.body);
        const newService = await prisma.service.create({ data });

        return res.status(201).json({ message: 'new service created successfully', service: newService });
    } catch (error) {
        console.error('Error creating service', error);

        return res.status(400).json({ error: 'Failed to create service' })
    }
}

const updateService = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = updateServiceSchema.parse(req.body);
        const updatedService = await prisma.service.update({ where: { id }, data: data as Prisma.ServiceUpdateInput });

        return res.status(200).json({ message: 'service data updated successfully', service: updatedService });
    } catch (error) {
        console.error('Error updating service', error);

        return res.status(500).json({ error: 'Failed to update service' })
    }
}

const deleteService = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const service = await prisma.service.findUnique({ where: { id } });

        if (!service) {
            return res.status(404).json({ error: 'service not found' });
        }

        const order = await prisma.orderItem.findFirst({ where: { serviceId: id } });
        if (order) {
            return res.status(409).json({ error: 'can not delete service with existing order' });
        }

        await prisma.service.delete({ where: { id } });

        return res.status(200).json({ message: `service with id ${id} is deleted` });
    } catch (error) {
        console.error('Error deleting service', error);

        return res.status(500).json({ error: 'Failed to delete service' })
    }
}

export { getAllServices, getServiceById, createService, updateService, deleteService }