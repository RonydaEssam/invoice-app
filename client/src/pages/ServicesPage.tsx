import { useEffect, useState } from "react";
import '../components/shared/styles/ListPage.css';
import { Link } from "react-router-dom";

interface Service {
    id: number,
    name: string,
    description: string,
    price: number
}

function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/services')
            .then(response => response.json())
            .then(data => setServices(data))
    }, [])

    return (
        <div>
            <div className="list-header">
                <h1>Services Page</h1>
                <Link to='services/new' className="btn-primary">+ Add Service</Link>
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
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ServicesPage