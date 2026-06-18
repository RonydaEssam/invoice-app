import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createClientSchema, updateClientSchema } from "../schemas/client.schema";
import { Prisma } from "../../generated/prisma/client";

const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await prisma.client.findMany();

        return res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);

        return res.status(500).json({ error: 'Failed to fetch clients' });
    }
}

const getClientById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const client = await prisma.client.findUnique({ where: { id } })

        if (!client) {
            return res.status(404).json({ error: 'client not found' })
        }

        return res.json(client);
    } catch (error) {
        console.error('Error fetching clients:', error);

        return res.status(500).json({ error: 'Failed to fetch client' });
    }
}

const createClient = async (req: Request, res: Response) => {
    try {
        const data = createClientSchema.parse(req.body);
        const client = await prisma.client.create({ data });

        return res.status(201).json({ message: 'new client created successfully', client: client });
    } catch (error) {
        console.error('Error creating new client:', error);

        return res.status(400).json({ error: 'Invalid input' });
    }
}

const updateClient = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const client = await prisma.client.findUnique({ where: { id } });
        const data = updateClientSchema.parse(req.body);

        if (!client) {
            return res.status(404).json({ message: 'client not found' })
        }

        const updatedClient = await prisma.client.update({ where: { id }, data: data as Prisma.ClientUpdateInput })

        return res.status(200).json({ message: 'client data updated successfully', client: updatedClient });
    } catch (error) {
        console.error('Error updating client data', error);

        return res.status(500).json({ error: 'Failed to update client data' });
    }
}

const deleteClient = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const client = await prisma.client.findUnique({ where: { id } })

        if (!client) {
            return res.status(404).json({ error: 'client not found' });
        }

        await prisma.client.delete({ where: { id } });

        return res.status(200).json({ message: `client with id ${id} is deleted` });
    } catch (error) {
        console.error('Error deleting client', error);

        return res.status(500).json({ error: 'Failed to delete client' });
    }
}

export { getAllClients, getClientById, createClient, updateClient, deleteClient }