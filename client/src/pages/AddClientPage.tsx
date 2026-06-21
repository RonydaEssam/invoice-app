import { useEffect, useState } from 'react';
import { FormInput } from '../components/shared/FormInput';
import '../components/shared/FormInput.css';
import { useNavigate, useParams } from 'react-router-dom';
import { submitData } from '../api/transformData';

function AddClientPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();
    const data = { name, email, address };

    const { id } = useParams();

    const handleSave = () => {
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
                onChange={(event) => setName(event.target.value)}
            />

            <FormInput
                label='Email'
                type='email'
                value={email}
                name='email'
                onChange={(event) => setEmail(event.target.value)}
            />

            <FormInput
                label='Address'
                type='text'
                value={address}
                name='address'
                onChange={(event) => setAddress(event.target.value)}
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