import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { deleteData } from "../api/transformData"

interface Order {
    id: number
    clientId: number
    client: {
        name: string
    }
    date: Date
    status: string
    orderItems: {
        serviceId: number
        quantity: number
        service: {
            name: string
            price: number
        }
    }[]

}

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/orders')
            .then(response => response.json())
            .then(data => setOrders(data))
    }, [])

    function deleteOrder(id: number) {
        deleteData("orders", Number(id))
            .then(() => setOrders(orders.filter(order => order.id !== id)))
            .catch(error => alert(error.message))
    }

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

                            <button onClick={() => deleteOrder(order.id)}>delete</button>
                            <button onClick={() => navigate(`edit/${order.id}`)}>edit</button>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}

export default OrdersPage