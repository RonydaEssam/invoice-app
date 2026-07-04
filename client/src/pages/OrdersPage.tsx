import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { Order } from '../types/types';
import ConfirmModal from "../components/shared/ConfirmModal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "orders",
        id => setOrders(orders.filter(c => c.id !== id))
    )

    useEffect(() => {
        fetch('http://localhost:3000/orders')
            .then(response => response.json())
            .then(data => setOrders(data))
    }, [])

    return (
        <div>
            <div className="list-header">
                <h1>Orders</h1>
                <Link to='/orders/new' className="btn-primary">+ Add Order</Link>
            </div>

            <div className="card-list">
                {
                    orders.map(order => (
                        <div className="card" key={order.id}>
                            <div>
                                <p>Client: {order.client.name}</p>
                                <p>Order: {order.orderItems.map(item => `${item.service.name} * ${item.quantity}`).join(', ')}</p>
                                <p>Status: {order.status}</p>
                            </div>

                            <div className="card-actions">
                                <Link to={`/orders/${order.id}`} className="btn-edit">View details</Link>
                                <button className="btn-edit" onClick={() => navigate(`edit/${order.id}`)}>edit</button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(order.id)}>delete</button>
                            </div>

                        </div>
                    ))
                }
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

export default OrdersPage