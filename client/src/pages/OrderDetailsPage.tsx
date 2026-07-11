import { Link, useNavigate, useParams } from "react-router-dom"
import type { Order } from "../types/types";
import { submitData } from "../api/transformData";
import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import ConfirmModal from "../components/shared/ConfirmModal";
import { useFetch } from "../hooks/useFetch";

function OrderDetailsPage() {
    const { id } = useParams();
    const { data: order, isLoading, error, refetch } = useFetch<Order>(`orders/${Number(id)}`)

    const orderDate = order?.date ? new Date(order.date).toLocaleDateString() : "";
    const InvoiceDate = order?.invoice?.createdAt ? new Date(order.invoice.createdAt).toLocaleDateString() : "";
    const navigate = useNavigate();

    const totalPrice = order?.orderItems.reduce(
        (sum, item) => sum + (item.service.price * item.quantity), 0
    ) ?? 0

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "orders",
        (_id) => navigate('/orders')
    )

    function createInvoice() {
        submitData("orders", "PUT", { status: 'Closed' }, Number(id))
        submitData("invoices", "POST", { orderId: Number(id) })
            .then(() => refetch())
    }

    if (isLoading) return <div className="loading"><p>Loading...</p></div>
    if (error) return <div className="loading"><p>Something went wrong.</p></div>

    return (
        <div>
            <div className="list-header">
                <h1>Order Details</h1>
                <div className="card-actions">
                    <Link to={`/orders/edit/${Number(id)}`} className="btn-edit">Edit Order</Link>
                    <button onClick={() => handleDeleteClick(Number(id))} className="btn-delete">delete</button>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Client</p>

                <div className="details-row">
                    <span className="details-label">Name</span>
                    <span className="details-value">{order?.client.name}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Email</span>
                    <span className="details-value">{order?.client.email}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Address</span>
                    <span className="details-value">{order?.client.address}</span>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Order</p>

                <div className="details-row">
                    <span className="details-label">Id</span>
                    <span className="details-value">{order?.id}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Date</span>
                    <span className="details-value">{orderDate}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Status</span>
                    <span className={`status-badge ${order?.status.toLowerCase()}`}>{order?.status}</span>
                </div>

                <div className="line-items">
                    {order?.orderItems.map(item =>
                        <div className="line-item" key={item.serviceId}>
                            <span className="line-item-name">{item.service.name}</span>
                            <span className="line-item-name">{item.service.description}</span>
                            <span className="line-item-meta">${item.service.price} * {item.quantity}</span>
                            <span className="details-value">${item.service.price * item.quantity}</span>
                        </div>
                    )}
                </div>

                <div className="details-total">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Invoice</p>

                {order?.invoice ? (
                    <>
                        <div className="details-row">
                            <span className="details-label">Created</span>
                            <span className="details-value">{InvoiceDate}</span>
                        </div>

                        <div className="details-row">
                            <span className="details-label">Status</span>
                            <span className={`status-badge ${order.invoice.status.toLowerCase()}`}>{order.invoice.status}</span>
                        </div>

                        <Link to={`/invoices/${order?.invoice?.id}`}>Invoice details</Link>
                    </>
                ) : (
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '12px' }}>No invoice generated yet.</p>
                        <button className="btn-primary" onClick={createInvoice}>Create Invoice</button>
                    </div>
                )}
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="This order will be permanently deleted."
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

export default OrderDetailsPage