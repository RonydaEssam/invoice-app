import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { Client, Service } from "../types/types";
import { submitData } from "../api/transformData";
import { FormInput } from "../components/shared/FormInput";
import '../../src/components/shared/styles/AddOrderPage.css'
import { API_URL } from "../api/config";

const URL = API_URL;

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
    const [orderStatus, setOrderStatus] = useState('Open');

    const [errors, setErrors] = useState({
        selectedClientId: '', currentServiceId: '', currentQuantity: '', orderStatus: '', orderItems: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${URL}/clients`)
            .then(response => response.json())
            .then(data => setClients(data))
    }, [])

    useEffect(() => {
        fetch(`${URL}/services`)
            .then(response => response.json())
            .then(data => setServices(data))
    }, [])

    useEffect(() => {
        if (!id) return;

        fetch(`${URL}/orders/${Number(id)}`)
            .then(response => response.json())
            .then(data => {
                setSelectedClientId(data.clientId)
                setOrderItems(data.orderItems)
                setOrderStatus(data.status)
            })
    }
        , [id]
    )

    function addOrderItem() {
        setOrderItems([...orderItems, { serviceId: currentServiceId, quantity: currentQuantity }])
    }

    function removeOrderItem(indexToRemove: number) {
        setOrderItems(orderItems.filter((_, index) => index !== indexToRemove))
    }

    const saveOrder = () => {
        const newErrors = {
            selectedClientId: '', currentServiceId: '', currentQuantity: '', orderStatus: '', orderItems: ''
        }
        let hasError = false

        if (!selectedClientId) {
            newErrors.selectedClientId = 'A client must be selected'
            hasError = true
        }
        if (!currentServiceId) {
            newErrors.currentServiceId = 'A service must be selected'
            hasError = true
        }
        if (!currentQuantity || currentQuantity < 1) {
            newErrors.currentQuantity = 'Quantity must be at least 1'
            hasError = true
        }

        if (!orderItems || orderItems.length < 1) {
            newErrors.orderItems = 'A service must be added'
            hasError = true
        }

        setErrors(newErrors)
        if (hasError) return

        const data = {
            clientId: selectedClientId,
            orderItems: orderItems,
            status: orderStatus
        }

        submitData("orders", id ? "PUT" : "POST", data, id ? Number(id) : undefined)
            .then(() => navigate('/orders'))
    }

    return (
        <div>
            {id ? <h1>Edit Order</h1> : <h1>Add Order</h1>}

            <div className="form-field">
                <label htmlFor="client">Client</label>
                <select
                    id="client"
                    value={selectedClientId}
                    className={errors.selectedClientId ? 'input-error' : ''}
                    onChange={(e) => {
                        setSelectedClientId(Number(e.target.value))
                        setErrors(prev => ({ ...prev, selectedClientId: '' }))
                    }}>
                    <option value=''>Select a client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
                {errors.selectedClientId && <p className="field-error">{errors.selectedClientId}</p>}
            </div>

            <ul className="order-items-list">
                {orderItems.map((item, index) => {
                    const service = services.find(s => s.id === item.serviceId)
                    return (
                        <li className="order-item-row" key={index}>
                            {service?.name} * {item.quantity}
                            <button className="btn-secondary" onClick={() => removeOrderItem(index)}>Remove</button>
                        </li>
                    )
                })}

                {errors.selectedClientId && <p className="field-error">{errors.orderItems}</p>}
            </ul>

            <div className="add-item-row">
                <FormInput
                    label="Quantity"
                    name='quantity'
                    type='number'
                    value={currentQuantity}
                    onChange={(e) => {
                        setCurrentQuantity(Number(e.target.value))
                        setErrors(prev => ({ ...prev, currentQuantity: '' }))
                    }}
                    error={errors.currentQuantity}
                />

                <div className="form-field">
                    <label htmlFor="service">Service</label>
                    <select
                        id="service"
                        value={currentServiceId}
                        className={errors.currentServiceId ? 'input-error' : ''}
                        onChange={(e) => {
                            setCurrentServiceId(Number(e.target.value))
                            setErrors(prev => ({ ...prev, currentServiceId: '' }))
                        }}>
                        <option value=''>Add service</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                    {errors.currentServiceId && <p className="field-error">{errors.currentServiceId}</p>}
                </div>

                <button className="btn-primary" onClick={() => { addOrderItem(); setErrors(prev => ({ ...prev, orderItems: '' })) }}>Add service</button>
            </div>

            <div className="form-field status-field">
                <label htmlFor="status">Status</label>
                <select id="status" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                    <option>Open</option>
                    {id ? <option>Closed</option> : null}
                </select>
            </div>

            <div className="form-actions">
                <button className="btn-primary" onClick={saveOrder}>Save Order</button>
            </div>

        </div>
    )
}

export default AddOrderPage