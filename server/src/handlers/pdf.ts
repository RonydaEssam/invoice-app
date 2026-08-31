import { Request, Response } from 'express';
import { prisma } from "../database/prisma";
import PDFDocument from "pdfkit";

const getPdf = async (req: Request, res: Response) => {
    const invoiceId = Number(req.params.id);

    if (Number.isNaN(invoiceId)) {
        return res.status(400).json({ error: "Invalid invoice id" });
    }

    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: { service: true },
                    },
                },
            },
        },
    });

    if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoiceId}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // --- Header ---
    doc.fontSize(20).text("Invoice Receipt", { align: "right" });
    doc.moveDown();
    doc.fontSize(10).text(`Invoice #: ${invoice.id}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`);
    doc.moveDown();

    // --- Client info ---
    const client = invoice.order.client;
    doc.fontSize(12).text("Bill to:", { underline: true });
    doc.fontSize(10).text(client.name);
    doc.text(client.email);
    doc.text(client.address);
    doc.moveDown();

    // --- Order items ---
    doc.fontSize(12).text("Items:", { underline: true });
    doc.moveDown(0.5);

    for (const item of invoice.order.orderItems) {
        const lineTotal = item.quantity * item.service.price;
        doc.fontSize(10).text(
            `${item.service.name}  x${item.quantity}  —  ${lineTotal}`
        );
        if (item.service.description) {
            doc.fontSize(8).fillColor("gray").text(item.service.description, { indent: 10 });
            doc.fillColor("black");
        }
    }

    doc.moveDown();
    doc.fontSize(12).text(`Total: ${invoice.totalPrice}`, { align: "right" });

    doc.end();
};

export { getPdf }