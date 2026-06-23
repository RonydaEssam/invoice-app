import { useState, useEffect } from 'react';
import '../components/shared/styles/ListPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { deleteData } from '../api/transformData';
import type { Client } from '../types/types';

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/clients')
            .then(response => response.json())
            .then(data => setClients(data))
    }, [])

    function deleteClient(id: number) {
        deleteData('clients', id)
            .then(() => setClients(clients.filter(client => client.id !== id)))
            .catch(error => alert(error.message))
    }

    return (
        <div>
            <div className='list-header'>
                <h1>Clients</h1>
                <Link to='/clients/new' className='btn-primary'>+ Add Client</Link>
            </div>

            <div className='card-list'>
                {clients.map(client => (
                    <div className='card' key={client.id}>
                        <div>
                            <p className='card-title'>{client.name}</p>
                            <p className='card-subtitle'>{client.email} . {client.address}</p>
                        </div>
                        <button onClick={() => deleteClient(client.id)}>delete</button>
                        <button onClick={() => navigate(`edit/${client.id}`)}>edit</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClientsPage;