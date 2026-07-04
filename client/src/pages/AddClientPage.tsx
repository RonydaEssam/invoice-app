import { useEffect, useState } from 'react';
import { FormInput } from '../components/shared/FormInput';
import '../components/shared/FormInput.css';
import { useNavigate, useParams } from 'react-router-dom';
import { submitData } from '../api/transformData';

function AddClientPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '', address: '' });

    const navigate = useNavigate();
    const data = { name, email, address };

    const { id } = useParams();

    const handleSave = () => {
        const newErrors = { name: '', email: '', address: '' };
        let hasError = false;

        if (!name || name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
            hasError = true
        }
        if (!email) {
            newErrors.email = 'Email is required'
            hasError = true
        }
        if (!address || address.length < 2) {
            newErrors.address = 'Address must be at least 2 characters'
            hasError = true
        }

        setErrors(newErrors)
        if (hasError) return

        submitData('clients', id ? 'PUT' : 'POST', data, id ? Number(id) : undefined)
            .then(() => navigate('/clients'))
    }

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:3000/clients/${Number(id)}`)
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setEmail(data.email);
                setAddress(data.address);
            })
    }, [id])

    return (
        <div>
            {id ? <h1>Edit Client</h1> : <h1>Add Client</h1>}

            <FormInput
                label='Name'
                type='text'
                value={name}
                name='name'
                onChange={(event) => {
                    setName(event.target.value)
                    setErrors(prev => ({ ...prev, name: '' }))
                }}
                error={errors.name}
            />

            <FormInput
                label='Email'
                type='email'
                value={email}
                name='email'
                onChange={(event) => {
                    setEmail(event.target.value)
                    setErrors(prev => ({ ...prev, email: '' }))
                }}
                error={errors.email}
            />

            <FormInput
                label='Address'
                type='text'
                value={address}
                name='address'
                onChange={(event) => {
                    setAddress(event.target.value)
                    setErrors(prev => ({ ...prev, address: '' }))
                }}
                error={errors.address}
            />

            <div className='form-actions'>
                <button className='btn-primary' onClick={handleSave}>
                    Save Client
                </button>
            </div>
        </div>
    )
}

export default AddClientPage