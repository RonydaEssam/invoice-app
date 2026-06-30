import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import type { Invoice, Order } from "../types/types";
import '../components/shared/styles/ListPage.css';
import { submitData } from "../api/transformData";

function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const [invoice, setInvoice] = useState<Invoice>();

    const orderDate = order?.date ? new Date(order.date).toLocaleDateString() : "";
    const InvoiceDate = order?.invoice?.createdAt ? new Date(order.invoice.createdAt).toLocaleDateString() : "";

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

    return (
        <div>
            <div className="list-header">
                <h1>Order Details</h1>
                <Link to={`/orders/edit/${Number(id)}`} className="btn-primary">Edit Order</Link>
            </div>


            <div>
                <div>
                    Client details:
                    <p>name: {order?.client.name}</p>
                    <p>email: {order?.client.email}</p>
                    <p>address: {order?.client.address}</p>
                </div>

                <p>Order created on: {orderDate}</p>

                <p>Order status: {order?.status}</p>

                {order?.orderItems.map(item =>
                    <p key={item.service.id}>
                        {item.service.name} : ${item.service.price} * {item.quantity} = ${item.service.price * item.quantity}
                    </p>
                )}

                <p>Total price: {totalPrice}</p>

                <div>
                    <p>Invoice: </p>
                    {order?.invoice ? (
                        <div>
                            <p>Created on: {InvoiceDate}</p>
                            <p>Status: {order.invoice.status}</p>

                            <Link to={`/invoices/${order?.invoice?.id}`}>Invoice details</Link>
                        </div>
                    ) : (
                        <button className="btn-primary" onClick={createInvoice}>Create Invoice</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsPage