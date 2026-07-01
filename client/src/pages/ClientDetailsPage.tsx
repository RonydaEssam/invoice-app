import { Link, useNavigate, useParams } from "react-router-dom"
import '../components/shared/styles/ListPage.css';
import { useEffect, useState } from "react";
import type { Client } from "../types/types";
import { deleteData } from "../api/transformData";

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

            <div>
                <div key={client?.id}>
                    Client data:
                    <p>name: {client?.name}</p>
                    <p>email: {client?.email}</p>
                    <p>address: {client?.address}</p>
                </div>

                <div>
                    Orders:
                    {client?.order ? (
                        client.order.map(order => (
                            <div key={order.id} className="card">
                                <p>Created on : {new Date(order.date).toLocaleDateString()}</p>
                                <p>Status: {order.status}</p>
                                <div>
                                    {order.orderItems.map(item => (
                                        <p key={item.serviceId}>{item.service.name} * {item.quantity}</p>
                                    ))}
                                </div>
                                <p>Invoice: {order.invoice ? order.invoice.status : 'no invoice'}</p>
                            </div>
                        ))
                    ) : <p>Client has no Orders.</p>}
                </div>
            </div>

        </div>
    )

}

export default ClientDetailsPage