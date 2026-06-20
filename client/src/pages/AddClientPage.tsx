import { useState } from 'react';
import { FormInput } from '../components/shared/FormInput';
import '../components/shared/FormInput.css';

function AddClientPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    return (
        <div>
            <h1>Add Client Page</h1>

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
                <button className='btn-primary' onClick={() => console.log(`name: ${name}, email: ${email}, address: ${address}`)}>
                    Save Client
                </button>
            </div>
        </div>
    )
}

export default AddClientPage