import { useNavigate, useParams } from "react-router-dom"
import { FormInput } from "../components/shared/FormInput";
import { useEffect, useState } from "react";
import { submitData } from "../api/transformData";
import '../components/shared/FormInput.css'

function AddServicePage() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const navigate = useNavigate();

    const data = { name, description, price };

    const saveService = () => {
        submitData("services", id ? "PUT" : "POST", data, id ? Number(id) : undefined)
            .then(() => navigate('/services'))
    }

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:3000/services/${Number(id)}`)
            .then(response => response.json())
            .then(data => {
                setName(data.name)
                setDescription(data.description)
                setPrice(data.price)
            })
    }, [id])

    return (
        <div>
            {id ? <h1>Edit Service</h1> : <h1>Add Service</h1>}

            <FormInput
                label="Name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />

            <FormInput
                label="Description"
                name="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <FormInput
                label="Price"
                name="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
            />

            <div className="form-actions">
                <button onClick={saveService} className="btn-primary">Save Service</button>
            </div>

        </div>
    )
}

export default AddServicePage