import { useState, useEffect } from 'react';
import '../components/shared/styles/ListPage.css';
import { Link } from 'react-router-dom';

interface Client {
    id: number
    name: string
    email: string
    address: string
}

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])

    useEffect(() => {
        fetch('http://localhost:3000/clients')
            .then(response => response.json())
            .then(data => setClients(data))
    }, [])

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
                    </div>
                ))}
            </div>
        </div>
    )
}


export default ClientsPage;