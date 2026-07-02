import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import type { Client } from "../types/types";
import { deleteData } from "../api/transformData";
import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';

function ClientDetailsPage() {
    const { id } = useParams();
    const [client, setClient] = useState<Client>();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/clients/${Number(id)}`)
            .then(response => response.json())
            .then(data => setClient(data))
    }, [])

    function deleteClient() {
        deleteData('clients', Number(id))
            .then(() => navigate('/clients'))
            .catch(error => alert(error.message))
    }

    return (
        <div>
            <div className="list-header">
                <h1>Client Details</h1>
                <div className="card-actions">
                    <Link to={`/clients/edit/${Number(id)}`} className="btn-edit">Edit Client</Link>
                    <button className="btn-delete" onClick={deleteClient}>delete</button>
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

        </div >
    )

}

export default ClientDetailsPage