import './ConfirmModal.css'

interface ConfirmModalProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
    type?: 'confirm' | 'error'
}

function ConfirmModal({ message, onConfirm, onCancel, type = 'confirm' }: ConfirmModalProps) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <p className="modal-title">{type === 'error' ? 'Error' : 'Are you sure?'}</p>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    {type === 'error' ? (
                        <button className="btn-primary" onClick={onConfirm}>OK</button>
                    ) : (
                        <>
                            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                            <button className="btn-delete" onClick={onConfirm}>Delete</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal