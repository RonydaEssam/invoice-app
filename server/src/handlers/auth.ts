import { Request, Response } from 'express';
import { prisma } from "../database/prisma";
import PDFDocument from "pdfkit";

function formatNumber(n: number) {
    return n.toLocaleString('en-US');
}

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

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;
    const accentColor = "#2d3748";
    const mutedColor = "#718096";

    // --- Header ---
    doc
        .fillColor(accentColor)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("INVOICE RECEIPT", { align: "right" });

    doc.moveDown(0.3);
    doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(mutedColor)
        .text(`#${String(invoice.id).padStart(4, "0")}`, { align: "right" });

    doc.moveDown(1.5);

    // --- Meta row: status + date, side by side ---
    const metaY = doc.y;
    doc.fontSize(9).fillColor(mutedColor).text("STATUS", left, metaY);
    doc.fontSize(9).fillColor(mutedColor).text("DATE", left + pageWidth / 2, metaY);

    doc.fontSize(12).fillColor(accentColor).font("Helvetica-Bold")
        .text(invoice.status, left, metaY + 14);
    doc.fontSize(12).fillColor(accentColor).font("Helvetica-Bold")
        .text(invoice.createdAt.toLocaleDateString(), left + pageWidth / 2, metaY + 14);

    doc.moveDown(3);

    // --- Divider ---
    doc.moveTo(left, doc.y).lineTo(left + pageWidth, doc.y).strokeColor("#e2e8f0").stroke();
    doc.moveDown(1);

    // --- Bill to ---
    const client = invoice.order.client;
    doc.fontSize(9).fillColor(mutedColor).font("Helvetica-Bold").text("BILL TO");
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor(accentColor).font("Helvetica-Bold").text(client.name);
    doc.fontSize(10).fillColor(mutedColor).font("Helvetica").text(client.email);
    doc.text(client.address);

    doc.moveDown(2);

    // --- Items table ---
    const colService = left;
    const colQty = left + pageWidth * 0.55;
    const colPrice = left + pageWidth * 0.68;
    const colTotal = left + pageWidth * 0.84;

    const tableTop = doc.y;
    doc.fontSize(9).fillColor(mutedColor).font("Helvetica-Bold");
    doc.text("DESCRIPTION", colService, tableTop);
    doc.text("QTY", colQty, tableTop, { width: pageWidth * 0.13, align: "right" });
    doc.text("PRICE", colPrice, tableTop, { width: pageWidth * 0.16, align: "right" });
    doc.text("TOTAL", colTotal, tableTop, { width: pageWidth * 0.16, align: "right" });

    doc.moveDown(0.5);
    doc.moveTo(left, doc.y).lineTo(left + pageWidth, doc.y).strokeColor("#e2e8f0").stroke();
    doc.moveDown(0.7);

    let grandTotal = 0;

    for (const item of invoice.order.orderItems) {
        const lineTotal = item.quantity * item.service.price;
        grandTotal += lineTotal;
        const rowY = doc.y;

        doc.fontSize(10).fillColor(accentColor).font("Helvetica-Bold")
            .text(item.service.name, colService, rowY, { width: pageWidth * 0.5 });
        doc.fontSize(10).fillColor(accentColor).font("Helvetica")
            .text(String(item.quantity), colQty, rowY, { width: pageWidth * 0.13, align: "right" });
        doc.text(formatNumber(item.service.price), colPrice, rowY, { width: pageWidth * 0.16, align: "right" });
        doc.text(formatNumber(lineTotal), colTotal, rowY, { width: pageWidth * 0.16, align: "right" });

        if (item.service.description) {
            doc.moveDown(0.2);
            doc.fontSize(8).fillColor(mutedColor).font("Helvetica")
                .text(item.service.description, colService, doc.y, { width: pageWidth * 0.5 });
        }

        doc.moveDown(0.8);
    }

    doc.moveDown(0.3);
    doc.moveTo(left, doc.y).lineTo(left + pageWidth, doc.y).strokeColor("#e2e8f0").stroke();
    doc.moveDown(1);

    // --- Total ---
    doc.fontSize(11).fillColor(mutedColor).font("Helvetica")
        .text("Total", colPrice, doc.y, { width: pageWidth * 0.16, align: "right" });
    doc.fontSize(16).fillColor(accentColor).font("Helvetica-Bold")
        .text(formatNumber(invoice.totalPrice ?? grandTotal), colTotal, doc.y - 18, { width: pageWidth * 0.16, align: "right" });

    doc.moveDown(3);
    doc.fontSize(8).fillColor(mutedColor).font("Helvetica")
        .text("Thank you for your business.", { align: "center" });

    doc.end();
};

export { getPdf };