import { useNavigate, useParams } from "react-router-dom"
import { FormInput } from "../components/shared/FormInput";
import { useEffect, useState } from "react";
import { submitData } from "../api/transformData";
import '../components/shared/FormInput.css'
import { API_URL } from "../api/config";

const URL = API_URL;

function AddServicePage() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({ name: '', description: '', price: '' });

    const navigate = useNavigate();

    const data = { name, description, price };

    const saveService = () => {
        const newErrors = { name: '', description: '', price: '' };
        let hasError = false;

        if (!name || name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
            hasError = true
        }
        if (!description || description.length < 2) {
            newErrors.description = 'Description must be at least 2 characters'
            hasError = true
        }
        if (!price || price < 1) {
            newErrors.price = 'Price must be provided'
            hasError = true
        }

        setErrors(newErrors)
        if (hasError) return

        submitData("services", id ? "PUT" : "POST", data, id ? Number(id) : undefined)
            .then(() => navigate('/services'))
    }

    useEffect(() => {
        if (!id) return;

        fetch(`${URL}/services/${Number(id)}`)
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
                onChange={(event) => {
                    setName(event.target.value)
                    setErrors(prev => ({ ...prev, name: '' }))
                }}
                error={errors.name}
            />

            <FormInput
                label="Description"
                name="description"
                type="text"
                value={description}
                onChange={(event) => {
                    setDescription(event.target.value)
                    setErrors(prev => ({ ...prev, description: '' }))
                }}
                error={errors.description}
            />

            <FormInput
                label="Price"
                name="price"
                type="number"
                value={price}
                onChange={(event) => {
                    setPrice(Number(event.target.value))
                    setErrors(prev => ({ ...prev, price: '' }))
                }}
                error={errors.price}
            />

            <div className="form-actions">
                <button onClick={saveService} className="btn-primary">Save Service</button>
            </div>

        </div>
    )
}

export default AddServicePage