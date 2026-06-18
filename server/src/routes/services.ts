import { Router } from "express";
import { getAllServices, getServiceById, createService, updateService, deleteService } from "../handlers/services";

const serviceRouter = Router();

serviceRouter.get('/', getAllServices);
serviceRouter.get('/:id', getServiceById);
serviceRouter.post('/', createService);
serviceRouter.put('/:id', updateService);
serviceRouter.delete('/:id', deleteService);

export { serviceRouter };