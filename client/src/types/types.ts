export default interface Client {
    id: number
    name: string
    email: string
    address: string
}

export default interface Service {
    id: number
    name: string
    description: string
    price: number
}

export default interface Order {
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