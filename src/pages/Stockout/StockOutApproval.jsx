import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StockOutApproval = ({ isOpen, onClose, requestId, fetchRequests }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true); // Default to true initially
    const [availableQuantities, setAvailableQuantities] = useState({});
    const [packageQuantities, setPackageQuantities] = useState({});
    const [totalRawMaterialQuantity, setTotalRawMaterialQuantity] = useState(0);
    const [totalPackageQuantity, setTotalPackageQuantity] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchRequestDetails();
        }
    }, [isOpen]);

    const fetchRequestDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests/${requestId}`);
            setItems(response.data.items);
            calculateTotalQuantities(response.data.items);
            checkAvailability(response.data.items);
        } catch (error) {
            console.error('Error fetching request details:', error);
            setError('Failed to fetch request details');
        }
    };

    const calculateTotalQuantities = (items) => {
        let rawMaterialTotal = 0;
        let packageTotal = 0;

        items.forEach((item) => {
            if (item.item.category.name === 'Raw Materials') {
                rawMaterialTotal += item.pivot.quantity;
            } else {
                packageTotal += item.pivot.quantity;
            }
        });

        setTotalRawMaterialQuantity(rawMaterialTotal);
        setTotalPackageQuantity(packageTotal);
    };

    const checkAvailability = async (items) => {
        setLoading(true);
        setError(null);
        try {
            const stockPromises = items.map(item => 
                axios.get(`${import.meta.env.VITE_API_URL}/stock-ins/${item.id}`)
            );
            const stockResponses = await Promise.all(stockPromises);
            
            const availability = {};
            const packageQty = {};
            stockResponses.forEach((response, index) => {
                availability[items[index].id] = response.data.quantity;
                packageQty[items[index].id] = response.data.package_qty;
            });

            setAvailableQuantities(availability);
            setPackageQuantities(packageQty);
            validateQuantities(items, availability);
        } catch (error) {
            setError('Failed to fetch stock details');
            setIsAvailable(false);
            setAvailableQuantities({});
            setPackageQuantities({});
        } finally {
            setLoading(false);
        }
    };

    const validateQuantities = (items, availability) => {
        const allAvailable = items.every(item => availability[item.id] >= item.pivot.quantity);
        setIsAvailable(allAvailable);
    };

    const handleRequestedQtyChange = (itemId, value) => {
        const newValue = Math.max(0, parseInt(value) || 0);
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === itemId ? { ...item, pivot: { ...item.pivot, quantity: newValue } } : item
            );
            calculateTotalQuantities(updatedItems);
            validateQuantities(updatedItems, availableQuantities);
            return updatedItems;
        });
    };

    const handlePackageQtyChange = (itemId, value) => {
        const newValue = Math.min(Math.max(0, parseInt(value) || 0), packageQuantities[itemId]);
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, package_qty: newValue } : item
            )
        );
    };

    const handleApprove = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/stock-outs`, {
                request_id: requestId,
                items: items.map(item => ({
                    item_id: item.id,
                    quantity: item.pivot.quantity,
                    package_qty: item.package_qty || 0
                })),
                total_raw_material_quantity: totalRawMaterialQuantity,
                total_package_quantity: totalPackageQuantity,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
            });
    
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Stock out pending successfully!',
            });
            onClose();
            if (typeof fetchRequests === 'function') {
                fetchRequests();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to approve stock out';
            const errorTrace = error.response?.data?.trace || 'No trace available';
            console.error('Error details:', errorMessage, errorTrace);
    
            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 mx-auto my-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Stock Out Approval</h2>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-600">Request ID</label>
                    <input
                        type="text"
                        value={requestId}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Item Name</th>
                                <th className="px-4 py-2 text-left">Supplier</th>
                                <th className="px-4 py-2 text-left">Requested Quantity</th>
                                <th className="px-4 py-2 text-left">Available Quantity</th>
                                <th className="px-4 py-2 text-left">Package Quantity</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t border-gray-300">
                                    <td className="px-4 py-2">{item.item.name}</td>
                                    <td className="px-4 py-2">{item.supplier.name}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.pivot.quantity}
                                            onChange={(e) => handleRequestedQtyChange(item.id, e.target.value)}
                                            min="0"
                                            className="w-24 px-2 py-1 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{availableQuantities[item.id] || 0}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.package_qty || 0}
                                            onChange={(e) => handlePackageQtyChange(item.id, e.target.value)}
                                            max={packageQuantities[item.id]}
                                            min="0"
                                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                                        />
                                        /{packageQuantities[item.id] || 0}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                            availableQuantities[item.id] >= item.pivot.quantity 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {availableQuantities[item.id] >= item.pivot.quantity 
                                                ? 'Available' 
                                                : 'Not Available'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Total Raw Material Quantity
                        </label>
                        <input
                            type="text"
                            value={totalRawMaterialQuantity}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Total Package Quantity
                        </label>
                        <input
                            type="text"
                            value={totalPackageQuantity}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                {error && <div className="mt-4 text-red-600">{error}</div>}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleApprove}
                        disabled={loading || !isAvailable}
                        className={`px-4 py-2 text-white rounded-md ${
                            loading || !isAvailable ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                        onClick={onClose}
                        className="ml-4 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockOutApproval;
