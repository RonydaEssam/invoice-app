import { useEffect, useState } from "react"
import type { Invoice } from "../types/types";
import { submitData } from "../api/transformData";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/shared/ConfirmModal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "invoices",
        id => setInvoices(invoices.filter(c => c.id !== id))
    )

    useEffect(() => {
        fetch('http://localhost:3000/invoices')
            .then(response => response.json())
            .then(data => setInvoices(data))
    }, [])

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
            <div className='list-header'>
                <h1>Invoices</h1>
                <Link to='/orders' className='btn-primary'>+ Add Invoice</Link>
            </div>

            <div className="card-list">
                {invoices.map(invoice => (
                    <div className="card" key={invoice.id}>
                        <div>
                            <p className="card-title">Invoice #{invoice.id} - {invoice.order.client.name}</p>

                            {editingInvoiceId === invoice.id ? (
                                <>
                                    <span>Status: </span>
                                    <select
                                        className="status-select"
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

                            <p className="card-subtitle">Total: ${invoice.totalPrice}</p>
                            <p className="card-description">
                                Details: {invoice.order.orderItems
                                    .map(item => `${item.service.name} * ${item.quantity}`)
                                    .join(', ')
                                }
                            </p>
                        </div>

                        <div className="card-actions">
                            <Link to={`/invoices/${invoice.id}`} className="btn-edit">View details</Link>
                            <button className="btn-edit" onClick={() => setEditingInvoiceId(invoice.id)}>edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteClick(invoice.id)}>delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="This invoice will be permanently deleted."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancel}
                />
            )}

            {errorMessage && (
                <ConfirmModal
                    type="error"
                    message={errorMessage}
                    onConfirm={clearError}
                    onCancel={clearError}
                />
            )}
        </div>
    )
}

export default InvoicesPage