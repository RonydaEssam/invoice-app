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

export interface OrderItem {
    serviceId: number
    quantity: number
    service: Service
}

export interface Order {
    id: number
    clientId: number
    client: Client
    date: string
    status: string
    orderItems: OrderItem[]
    invoice?: Invoice | null
}

export interface Invoice {
    id: number
    orderId: number
    status: 'Draft' | 'Sent' | 'Paid'
    totalPrice: number
    createdAt: string
    order: {
        client: Client
        orderItems: OrderItem[]
    }
}