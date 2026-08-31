import { API_URL } from "./config";
import { getToken } from "./authClient";

type Resource = 'clients' | 'services' | 'orders' | 'invoices';
type Method = 'PUT' | 'POST' | 'PATCH';

const URL = API_URL;

function authHeaders(extra?: Record<string, string>) {
    const token = getToken();
    return {
        ...(extra ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

const submitData = (resource: Resource, method: Method, data: object, id?: number) => {
    return fetch(id ? `${URL}/${resource}/${id}` : `${URL}/${resource}`, {
        method: method,
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}

const deleteData = (resource: Resource, id: number) => {
    return fetch(`${URL}/${resource}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
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