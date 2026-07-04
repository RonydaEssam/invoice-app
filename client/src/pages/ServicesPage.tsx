import '../components/shared/styles/ListPage.css';
import { Link, useNavigate } from "react-router-dom";
import type { Service } from '../types/types';
import ConfirmModal from "../components/shared/ConfirmModal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useFetch } from "../hooks/useFetch";

function ServicesPage() {
    const { data: services, setData: setServices, isLoading, error } = useFetch<Service[]>('services')
    const navigate = useNavigate();

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        "services",
        id => setServices(services?.filter(c => c.id !== id) ?? [])
    )

    if (isLoading) return <div className="loading"><p>Loading...</p></div>
    if (error) return <div className="loading"><p>Error: {error}</p></div>
    if (!services) return null

    return (
        <div>
            <div className="list-header">
                <h1>Services</h1>
                <Link to='/services/new' className="btn-primary">+ Add Service</Link>
            </div>

            {(services?.length === 0) ?
                <p className="empty-state">No services yet — add your first one.</p> :

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
            }

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