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
    service: {
        name: string
        price: number
    }
}

export interface Order {
    id: number
    clientId: number
    client: {
        name: string
    }
    date: Date
    status: string
    orderItems: OrderItem[]

}

export interface Invoice {
    id: number
    orderId: number
    status: 'Draft' | 'Sent' | 'Paid'
    totalPrice: number
    order: {
        client: Client
        orderItems: OrderItem[]
    }
}