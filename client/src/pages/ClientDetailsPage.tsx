import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import type { Client } from "../types/types";
import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';
import ConfirmModal from "../components/shared/ConfirmModal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

function ClientDetailsPage() {
    const { id } = useParams();
    const [client, setClient] = useState<Client>();
    const navigate = useNavigate();

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "clients",
        (_id) => navigate('/clients')
    )

    useEffect(() => {
        fetch(`http://localhost:3000/clients/${Number(id)}`)
            .then(response => response.json())
            .then(data => setClient(data))
    }, [])

    return (
        <div>
            <div className="list-header">
                <h1>Client Details</h1>
                <div className="card-actions">
                    <Link to={`/clients/edit/${Number(id)}`} className="btn-edit">Edit Client</Link>
                    <button className="btn-delete" onClick={() => handleDeleteClick(Number(id))}>delete</button>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Client</p>

                <div className="details-row">
                    <span className="details-label">Id</span>
                    <span className="details-value"> {client?.id}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Name</span>
                    <span className="details-value"> {client?.name}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Email</span>
                    <span className="details-value">{client?.email}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Address</span>
                    <span className="details-value">{client?.address}</span>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Orders</p>

                {client?.order && client.order.length > 0 ? (
                    client.order.map(order => (
                        <div key={order.id}>
                            <div className="details-row">
                                <span className="details-label">Order no.</span>
                                <span className="details-value">#{order.id}</span>
                            </div>

                            <div className="details-row">
                                <span className="details-label">Date</span>
                                <span className="details-value">{new Date(order.date).toLocaleDateString()}</span>
                            </div>

                            <div className="details-row">
                                <span className="details-label">Status</span>
                                <span className={`status-badge ${order?.status.toLowerCase()}`}>{order?.status}</span>
                            </div>

                            <div className="details-row">
                                <span className="details-label">Invoice</span>
                                <span className="details-value">{order.invoice ? order.invoice.status : '--'}</span>
                            </div>

                            <div className="line-items">
                                {order.orderItems.map(item => (
                                    <div className="line-item" key={item.serviceId}>
                                        <span className="line-item-name">{item.service.name}</span>
                                        <span className="line-item-meta">${item.service.price} * {item.quantity}</span>
                                        <span className="details-value">${item.service.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : <p className="empty-state">Client has no orders yet.</p>}
            </div>

            {showConfirm && (
                <ConfirmModal
                    message='This client will be permanently deleted.'
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
        </div >
    )

}

export default ClientDetailsPage