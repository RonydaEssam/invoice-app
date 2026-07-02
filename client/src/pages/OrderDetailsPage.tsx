import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Invoice, Order } from "../types/types";
import { deleteData, submitData } from "../api/transformData";
import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';

function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const [invoice, setInvoice] = useState<Invoice>();

    const orderDate = order?.date ? new Date(order.date).toLocaleDateString() : "";
    const InvoiceDate = order?.invoice?.createdAt ? new Date(order.invoice.createdAt).toLocaleDateString() : "";
    const navigate = useNavigate();

    const totalPrice = order?.orderItems.reduce(
        (sum, item) => sum + (item.service.price * item.quantity), 0
    ) ?? 0

    useEffect(() => {
        fetch(`http://localhost:3000/orders/${Number(id)}`)
            .then(response => response.json())
            .then(data => setOrder(data))
    }, [invoice])

    function createInvoice() {
        submitData("invoices", "POST", { orderId: Number(id) })
            .then(data => setInvoice(data.invoice))
    }

    function deleteOrder() {
        deleteData("orders", Number(id))
            .then(() => navigate('/orders'))
            .catch(error => alert(error.message))
    }

    return (
        <div>
            <div className="list-header">
                <h1>Order Details</h1>
                <div className="card-actions">
                    <Link to={`/orders/edit/${Number(id)}`} className="btn-edit">Edit Order</Link>
                    <button onClick={deleteOrder} className="btn-delete">delete</button>
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
        </div>
    )
}

export default OrderDetailsPage