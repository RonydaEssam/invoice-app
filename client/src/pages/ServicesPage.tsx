import { useEffect, useState } from "react";
import '../components/shared/styles/ListPage.css';
import { Link, useNavigate } from "react-router-dom";
import { deleteData } from "../api/transformData";
import type Service from '../types/types';

function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/services')
            .then(response => response.json())
            .then(data => setServices(data))
    }, [])

    function deleteService(id: number) {
        deleteData("services", Number(id))
            .then(() => setServices(services.filter(service => service.id !== id)))
            .catch(error => alert(error.message))
    }

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

                            <button onClick={() => deleteService(service.id)}>delete</button>
                            <button onClick={() => navigate(`edit/${service.id}`)}>edit</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ServicesPage