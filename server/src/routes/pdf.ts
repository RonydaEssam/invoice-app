import { Router } from "express";
import { getPdf } from "../handlers/pdf";

const pdfRouter = Router();

pdfRouter.get("/:id/pdf", getPdf);

export { pdfRouter };