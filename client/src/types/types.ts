export interface Client {
    id: number
    name: string
    email: string
    address: string
}

export interface Service {
    id: number
    name: string
    description: string
    price: number
}

export interface Order {
    id: number
    clientId: number
    client: {
        name: string
    }
    date: Date
    status: string
    orderItems: {
        serviceId: number
        quantity: number
        service: {
            name: string
            price: number
        }
    }[]

}