import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StockOutApproval = ({ isOpen, onClose, requestId, fetchRequests }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [availableQuantities, setAvailableQuantities] = useState({});
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
            stockResponses.forEach((response, index) => {
                availability[items[index].id] = response.data.quantity;
            });

            setAvailableQuantities(availability);
            const allAvailable = items.every(item => availability[item.id] >= item.pivot.quantity);
            setIsAvailable(allAvailable);
        } catch (error) {
            setError('Failed to fetch stock details');
            setIsAvailable(false);
            setAvailableQuantities({});
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/stock-outs`, {
                request_id: requestId,
                items: items.map(item => ({ item_id: item.id, quantity: item.pivot.quantity })),
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
            setError(error.response?.data?.message || 'Failed to approve stock out');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to approve stock out',
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
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t border-gray-300">
                                    <td className="px-4 py-2">{item.item.name}</td>
                                    <td className="px-4 py-2">{item.supplier.name}</td>
                                    <td className="px-4 py-2">{item.pivot.quantity}</td>
                                    <td className="px-4 py-2">{availableQuantities[item.id] || 0}</td>
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
                {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
                <div className="flex justify-end mt-6 space-x-4">
                    <button 
                        type="button" 
                        className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00BDD6]" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] ${
                            loading || !isAvailable 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#00BDD6] hover:bg-[#00a8bb]'
                        }`}
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