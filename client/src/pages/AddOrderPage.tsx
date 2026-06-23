import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { Client, Service } from "../types/types";

function AddOrderPage() {
    const { id } = useParams();
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState(0);
    const [services, setServices] = useState<Service[]>([])

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

    return (
        <div>
            {id ? <h1>Edit Order</h1> : <h1>Add Order</h1>}

            <select value={selectedClientId} onChange={(e) => setSelectedClientId(Number(e.target.value))}>
                <option value=''>Select a client</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>
                        {client.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default AddOrderPage