import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useStockOut } from '../../hooks';

const StockOutApproval = ({ isOpen, onClose, requestId, fetchRequests }) => {
    const { checkAvailability, approveStockOut, loading, error, isAvailable, setIsAvailable } = useStockOut();
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchRequestDetails();
        }
    }, [isOpen]);

    const fetchRequestDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests/${requestId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch request details');
            }
            const data = await response.json();
            setQuantity(data.quantity);
            checkAvailability(data.item_id, data.quantity);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };

    const handleApprove = async () => {
        try {
            await approveStockOut(requestId, quantity);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Stock out approved successfully!',
            });
            onClose();
            fetchRequests();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to approve stock out',
            });
            console.error('Error approving stock out:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-semibold">Stock Out Approval</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600">Request ID</label>
                    <input
                        type="text"
                        value={requestId}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    <span className={`text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {isAvailable ? 'Available' : 'Not Available'}
                    </span>
                </div>
                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
                <div className="flex justify-end space-x-4">
                    <button type="button" className="text-gray-500" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`bg-blue-600 text-white p-2 rounded ${loading || !isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        onClick={handleApprove}
                        disabled={loading || !isAvailable}
                    >
                        {loading ? 'Approving...' : 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockOutApproval;
