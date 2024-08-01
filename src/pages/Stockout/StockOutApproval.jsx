import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const StockOutApproval = ({ isOpen, onClose, requestId, fetchRequests }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [availableQuantities, setAvailableQuantities] = useState({});

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
            setItems(data.items);
            checkAvailability(data.items);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };

    const checkAvailability = async (items) => {
        setLoading(true);
        setError(null);
        try {
            const availability = {};
            for (const item of items) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${item.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stock details');
                }
                const stockIn = await response.json();
                availability[item.id] = stockIn.quantity;
            }
            setAvailableQuantities(availability);
            const allAvailable = items.every(item => availability[item.id] >= item.pivot.quantity);
            setIsAvailable(allAvailable);
        } catch (error) {
            setError(error.message);
            setIsAvailable(false);
            setAvailableQuantities({});
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (event, index) => {
        const newQuantity = parseInt(event.target.value, 10);
        const updatedItems = [...items];
        updatedItems[index].pivot.quantity = newQuantity;
        setItems(updatedItems);
        checkAvailability(updatedItems);
    };

    const handleApprove = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-outs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: requestId,
                    items: items.map(item => ({ item_id: item.id, quantity: item.pivot.quantity })),
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Validation Error');
            }

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Stock out pending successfully!',
            });
            onClose();
            fetchRequests();
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to approve stock out',
            });
            console.error('Error approving stock out:', error);
        } finally {
            setLoading(false);
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
                {items.map((item, index) => (
                    <div key={item.id} className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            {item.item.name} - Supplier: {item.supplier.name}
                        </label>
                        <input
                            type="number"
                            value={item.pivot.quantity}
                            onChange={(event) => handleQuantityChange(event, index)}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                        />
                        <span className={`text-sm ${availableQuantities[item.id] >= item.pivot.quantity ? 'text-green-500' : 'text-red-500'}`}>
                            {availableQuantities[item.id] >= item.pivot.quantity ? 'Available' : `Not Available, only ${availableQuantities[item.id]} available`}
                        </span>
                    </div>
                ))}
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
