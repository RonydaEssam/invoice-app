import { useEffect, useState } from "react";
import '../components/shared/styles/ListPage.css';
import { Link, useNavigate } from "react-router-dom";
import type { Service } from '../types/types';
import ConfirmModal from "../components/shared/ConfirmModal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const navigate = useNavigate();

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "services",
        id => setServices(services.filter(c => c.id !== id))
    )

    useEffect(() => {
        fetch('http://localhost:3000/services')
            .then(response => response.json())
            .then(data => setServices(data))
    }, [])

    return (
        <div>
            <div className="list-header">
                <h1>Services</h1>
                <Link to='/services/new' className="btn-primary">+ Add Service</Link>
            </div>

            <div className="card-list">
                {
                    services.map(service => (
                        <div className="card" key={service.id}>
                            <div>
                                <p className="card-title">{service.name}</p>
                                <p className="card-subtitle">price: {service.price}</p>
                                <p className="card-description">{service.description}</p>
                            </div>

                            <div className="card-actions">
                                <button className="btn-edit" onClick={() => navigate(`edit/${service.id}`)}>edit</button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(service.id)}>delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="This service will be permanently deleted."
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

export default ServicesPage