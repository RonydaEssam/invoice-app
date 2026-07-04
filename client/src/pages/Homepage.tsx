import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';
import { useEffect, useState } from 'react';
import type { Invoice, Order } from '../types/types';
import { Link } from 'react-router-dom';

function Homepage() {
    const [openOrders, setOpenOrders] = useState<Order[]>([]);
    const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/orders?status=Open')
            .then(response => response.json())
            .then(data => setOpenOrders(data))
    }, [])

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3000/invoices?status=Draft').then(response => response.json()),
            fetch('http://localhost:3000/invoices?status=Sent').then(response => response.json()),
        ])
            .then(([draft, sent]) => setUnpaidInvoices([...draft, ...sent]))

    }, [])

    return (
        <div>
            <div className='list-header'>
                <h1>Dashboard</h1>
            </div>

            <div className='dashboard-grid'>
                <div>
                    <p className='details-section-title'>Open Orders ({openOrders.length})</p>

                    {(openOrders?.length === 0) ? <p className="empty-state">There are no open orders.</p> :
                        openOrders.map(order => (
                            <div className='details-section' key={order.id}>
                                <div className="details-row">
                                    <span className="details-label">Order no.</span>
                                    <span className="details-value">{order.id}</span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Client</span>
                                    <span className="details-value"> {order.client.name}</span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Date</span>
                                    <span className="details-value"> {new Date(order.date).toLocaleDateString()}</span>
                                </div>

                                <Link to={`/orders/${order.id}`}>View details</Link>
                            </div>
                        ))}

                </div>

                <div>
                    <p className='details-section-title'>Unpaid Invoices ({unpaidInvoices.length})</p>

                    {(unpaidInvoices?.length === 0) ? <p className="empty-state">There are no unpaid invoices.</p> :

                        unpaidInvoices.map(invoice => (
                            <div className='details-section' key={invoice.id}>
                                <div className="details-row">
                                    <span className="details-label">Invoice no.</span>
                                    <span className="details-value">{invoice.id}</span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Client</span>
                                    <span className="details-value">{invoice.order.client.name}</span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Status</span>
                                    <span className="details-value">{invoice.status}</span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Total Price</span>
                                    <span className="details-value">${invoice.totalPrice}</span>
                                </div>

                                <Link to={`/invoices/${invoice.id}`}>View details</Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Homepage;