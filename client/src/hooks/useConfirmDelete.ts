import { useState } from 'react'
import { deleteData } from '../api/transformData'

type Resource = 'clients' | 'services' | 'orders' | 'invoices'

export function useConfirmDelete(resource: Resource, onSuccess: (id: number) => void) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    function handleDeleteClick(id: number) {
        setDeleteTargetId(id)
        setShowConfirm(true)
    }

    function handleConfirmDelete() {
        if (!deleteTargetId) return
        deleteData(resource, deleteTargetId)
            .then(() => onSuccess(deleteTargetId)
            )
            .catch(error => setErrorMessage(error.message))
            .finally(() => {
                setShowConfirm(false)
                setDeleteTargetId(null)
            })
    }

    function handleCancel() {
        setShowConfirm(false)
        setDeleteTargetId(null)
    }

    return {
        showConfirm,
        errorMessage,
        handleDeleteClick,
        handleConfirmDelete,
        handleCancel,
        clearError: () => setErrorMessage(null)
    }
}