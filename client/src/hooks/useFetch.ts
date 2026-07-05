import { useEffect, useState } from "react";
import { API_URL } from "../api/config";

export function useFetch<T>(handle: string) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0)

    const url = `${API_URL}/${handle}`

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setData(data)
                setIsLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setIsLoading(false)
            })
    }, [url, refetchTrigger])

    function refetch() {
        setRefetchTrigger(prev => prev + 1)
    }

    return { data, setData, isLoading, error, refetch }
}