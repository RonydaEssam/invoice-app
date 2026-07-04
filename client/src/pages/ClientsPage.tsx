import { useState, useEffect } from 'react';
import '../components/shared/styles/ListPage.css';
import { Link, useNavigate } from 'react-router-dom';
import type { Client } from '../types/types';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useConfirmDelete } from '../hooks/useConfirmDelete';

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const navigate = useNavigate();

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        'clients',
        id => setClients(clients.filter(c => c.id !== id))
    )

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

                        <div className='card-actions'>
                            <Link to={`/clients/${client.id}`} className='btn-edit'>View details</Link>
                            <button className='btn-edit' onClick={() => navigate(`edit/${client.id}`)}>edit</button>
                            <button className='btn-delete' onClick={() => handleDeleteClick(client.id)}>delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showConfirm && (
                <ConfirmModal
                    message='This client will be permanently deleted.'
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

export default ClientsPage;