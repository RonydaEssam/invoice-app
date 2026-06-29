import { useEffect, useState } from "react"
import type { Invoice } from "../types/types";
import { deleteData, submitData } from "../api/transformData";

function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/invoices')
            .then(response => response.json())
            .then(data => setInvoices(data))
    }, [])

    function deleteInvoice(id: number) {
        deleteData("invoices", Number(id))
            .then(() => setInvoices(invoices.filter(invoice => invoice.id !== id)))
            .catch(error => alert(error.message))
    }

    function updateInvoiceStatus(id: number, newStatus: "Draft" | "Sent" | "Paid") {
        submitData("invoices", "PATCH", { status: newStatus }, id)
            .then(() => {
                setInvoices(invoices.map(invoice =>
                    invoice.id === id ? { ...invoice, status: newStatus } : invoice
                ))
            })
    }

    return (
        <div>
            <h1>Invoices Page</h1>

            <div className="card-list">
                {invoices.map(invoice => (
                    <div className="card" key={invoice.id}>
                        <div>
                            <p className="card-title">Invoice #{invoice.id} - {invoice.order.client.name}</p>
                            <p className="card-subtitle">Total: ${invoice.totalPrice}</p>

                            {editingInvoiceId === invoice.id ? (
                                <>
                                    <span>Status: </span>
                                    <select
                                        value={invoice.status}
                                        onChange={(e) => {
                                            updateInvoiceStatus(invoice.id, e.target.value as "Draft" | "Sent" | "Paid")
                                            setEditingInvoiceId(null)
                                        }}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Sent">Sent</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </>) : (
                                <span>Status: {invoice.status}</span>
                            )}

                            <p className="card-description">
                                {invoice.order.orderItems
                                    .map(item => `${item.service.name} * ${item.quantity}`)
                                    .join(', ')
                                }
                            </p>

                        </div>
                        <button onClick={() => deleteInvoice(invoice.id)}>delete</button>
                        <button onClick={() => setEditingInvoiceId(invoice.id)}>edit</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InvoicesPage