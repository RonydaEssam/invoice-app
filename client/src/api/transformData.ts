type Resource = 'clients' | 'services' | 'orders' | 'invoices';
type Method = 'PUT' | 'POST' | 'PATCH';

const URL = 'http://localhost:3000';

const submitData = (resource: Resource, method: Method, data: object, id?: number) => {
    return fetch(id ? `${URL}/${resource}/${id}` : `${URL}/${resource}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}

const deleteData = (resource: Resource, id: number) => {
    return fetch(`${URL}/${resource}/${id}`, {
        method: 'DELETE',
    }).then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong')
        }
        return data;
    }
    )
}

export { submitData, deleteData };