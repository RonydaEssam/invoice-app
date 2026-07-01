import { Link, useNavigate, useParams } from 'react-router-dom';
import '../components/shared/styles/ListPage.css';
import { deleteData } from '../api/transformData';
import { useEffect, useState } from 'react';
import type { Invoice } from '../types/types';

function InvoiceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice>();

    function deleteInvoice() {
        deleteData('invoices', Number(id))
            .then(() => navigate(`/invoices`))
            .catch(error => alert(error.message))
    }

    useEffect(() => {
        fetch(`http://localhost:3000/invoices/${Number(id)}`)
            .then(response => response.json())
            .then(data => setInvoice(data))
    }, [])

    return (
        <div>
            <div className="list-header">
                <h1>Invoice Details</h1>
                <button className='btn-delete' onClick={deleteInvoice}>delete</button>
            </div>

            <div>
                <p>Client Details:</p>
                <p>name: {invoice?.order.client.name}</p>
                <p>email: {invoice?.order.client.email}</p>
            </div>

            <div>
                <p>Order Details:</p>
                {invoice?.order.orderItems.map(item => (
                    <div className='card' key={invoice?.orderId}>
                        <p>{item.service.name}</p>
                        <p>{item.service.price}</p>
                        <p>{item.service.description}</p>
                        <p>{item.quantity}</p>
                        <Link to={`/orders/${invoice?.orderId}`} className="btn-edit">View Order</Link>
                    </div>
                ))}
                <p>Total Price: {invoice?.order.orderItems.reduce(
                    (sum, item) => sum + item.quantity * item.service.price, 0
                )}</p>
            </div>

            <div>
                <p>Invoice Details:</p>
                <p>Created on: {invoice ? new Date(invoice.createdAt).toLocaleDateString() : ''}</p>
                <p>Status: {invoice?.status}</p>
                <p>Total Price: {invoice?.totalPrice}</p>
            </div>
        </div>
    )
}

export default InvoiceDetailsPage