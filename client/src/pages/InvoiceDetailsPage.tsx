import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Invoice } from '../types/types';
import '../components/shared/styles/ListPage.css';
import '../components/shared/styles/DetailsPage.css';
import { useConfirmDelete } from '../hooks/useConfirmDelete';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useFetch } from '../hooks/useFetch';
import { useState } from 'react';
import { API_URL } from '../api/config';
import { getToken } from '../api/authClient';

function InvoiceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: invoice, isLoading, error } = useFetch<Invoice>(`invoices/${Number(id)}`)
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    async function handleDownloadPdf() {
        setPdfError(null);
        setIsDownloading(true);
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/invoices/${id}/pdf`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Could not generate the PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setPdfError(err instanceof Error ? err.message : 'Could not generate the PDF');
        } finally {
            setIsDownloading(false);
        }
    }

    const totalPrice = invoice?.order.orderItems.reduce(
        (sum, item) => sum + item.quantity * item.service.price, 0
    )

    const { showConfirm, errorMessage, handleDeleteClick, handleConfirmDelete, handleCancel, clearError } = useConfirmDelete(
        'invoices',
        (_id) => navigate('/invoices')
    )

    if (isLoading) return <div className="loading"><p>Loading...</p></div>
    if (error) return <div className="loading"><p>Something went wrong.</p></div>

    return (
        <div>
            <div className="list-header">
                <h1>Invoice Details</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className='btn-edit' onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                    <button className='btn-delete' onClick={() => handleDeleteClick(Number(id))}>delete</button>
                </div>
            </div>

            {pdfError && <p style={{ color: 'red' }}>{pdfError}</p>}

            <div className='details-section'>
                <p className="details-section-title">Invoice #{invoice?.id}</p>

                <div className="details-row">
                    <span className="details-label">Created</span>
                    <span className="details-value">{invoice ? new Date(invoice.createdAt).toLocaleDateString() : ''}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Status</span>
                    <span className="details-value">{invoice?.status}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Total Price</span>
                    <span className="details-value">${invoice?.totalPrice}</span>
                </div>
            </div>

            <div className="details-section">
                <p className="details-section-title">Client</p>

                <div className="details-row">
                    <span className="details-label">Name</span>
                    <span className="details-value"> {invoice?.order.client?.name}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Email</span>
                    <span className="details-value">{invoice?.order.client?.email}</span>
                </div>

                <div className="details-row">
                    <span className="details-label">Address</span>
                    <span className="details-value">{invoice?.order.client?.address}</span>
                </div>
            </div>

            <div className="details-section">
                <div className='list-header' >
                    <p className="details-section-title">Order #{invoice?.orderId}</p>
                    <Link to={`/orders/${invoice?.orderId}`} className="btn-edit">View Order</Link>
                </div>

                <table className="details-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Description</th>
                            <th className="col-price">Price × Qty</th>
                            <th className="col-total">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoice?.order.orderItems.map(item => (
                            <tr key={item.serviceId}>
                                <td>{item.service.name}</td>
                                <td>{item.service.description}</td>
                                <td className="col-price">${item.service.price} × {item.quantity}</td>
                                <td className="col-total">${item.service.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="details-total">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="This invoice will be permanently deleted."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancel}
                />
            )}

            {errorMessage && (
                <ConfirmModal
                    type="error"
                    message={errorMessage}
                    onConfirm={clearError}
                    onCancel={clearError}
                />
            )}
        </div>
    )
}

export default InvoiceDetailsPage