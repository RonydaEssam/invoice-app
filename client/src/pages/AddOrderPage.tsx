import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { Client, Service } from "../types/types";
import { submitData } from "../api/transformData";
import { FormInput } from "../components/shared/FormInput";

interface OrderItemInput {
    serviceId: number
    quantity: number
}

function AddOrderPage() {
    const { id } = useParams();
    const [clients, setClients] = useState<Client[]>([]);
    const [services, setServices] = useState<Service[]>([])

    const [selectedClientId, setSelectedClientId] = useState(0);
    const [orderItems, setOrderItems] = useState<OrderItemInput[]>([]);
    const [currentServiceId, setCurrentServiceId] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/clients')
            .then(response => response.json())
            .then(data => setClients(data))
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/services')
            .then(response => response.json())
            .then(data => setServices(data))
    }, [])

    function addOrderItem() {
        setOrderItems([...orderItems, { serviceId: currentServiceId, quantity: currentQuantity }])
    }

    function removeOrderItem(indexToRemove: number) {
        setOrderItems(orderItems.filter((_, index) => index !== indexToRemove))
    }

    const saveOrder = () => {
        if (!selectedClientId) {
            alert('Please select a client');
            return;
        }

        if (orderItems.length === 0) {
            alert('Please add at least one service');
            return;
        }

        const data = {
            clientId: selectedClientId,
            orderItems: orderItems
        }

        submitData("orders", id ? "PUT" : "POST", data, id ? Number(id) : undefined)
            .then(() => navigate('/orders'))
    }

    return (
        <div>
            {id ? <h1>Edit Order</h1> : <h1>Add Order</h1>}

            <div>
                <select value={selectedClientId} onChange={(e) => setSelectedClientId(Number(e.target.value))}>
                    <option value=''>Select a client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <ul>
                {orderItems.map((item, index) => {
                    const service = services.find(s => s.id === item.serviceId)
                    return (
                        <li key={index}>
                            {service?.name} × {item.quantity}
                            <button onClick={() => removeOrderItem(index)}>Remove</button>
                        </li>
                    )
                })}
            </ul>

            <div>
                <FormInput
                    label="Quantity"
                    name='quantity'
                    type='number'
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                />

                <select value={currentServiceId} onChange={(e) => setCurrentServiceId(Number(e.target.value))}>
                    <option value=''>Add service</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                <button onClick={addOrderItem}>Add service</button>
            </div>

            <button onClick={saveOrder}>Save Order</button>
        </div>
    )
}

export default AddOrderPage