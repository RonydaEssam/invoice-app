import { Router } from "express";
import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../handlers/clients";

const clientRouter = Router();

clientRouter.get('/', getAllClients);
clientRouter.get('/:id', getClientById);
clientRouter.post('/', createClient);
clientRouter.put('/:id', updateClient);
clientRouter.delete('/:id', deleteClient);

export { clientRouter };
