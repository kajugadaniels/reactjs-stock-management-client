import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RequestDetails = ({ isOpen, onClose, details }) => {
    const [approvedQuantities, setApprovedQuantities] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && details && details.id) {
            fetchApprovedQuantities(details.id);
        }
    }, [isOpen, details]);

    const fetchApprovedQuantities = async (requestId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-outs`, {
                params: { request_id: requestId }
            });
            const stockOuts = response.data;

            // Initialize an object to hold quantities by item ID
            const quantities = {};

            // Populate the quantities object with approved quantities
            stockOuts.forEach(stockOut => {
                stockOut.request.items.forEach(item => {
                    if (item.item_id) { // Ensure item_id exists
                        quantities[item.item_id] = stockOut.quantity;
                    }
                });
            });

            // Ensure that every item in the request has an entry in the quantities object
            const updatedQuantities = {};
            details.items.forEach(item => {
                updatedQuantities[item.item.id] = quantities[item.item.id] || 'Request still pending';
            });

            setApprovedQuantities(updatedQuantities);
        } catch (error) {
            console.error('Error fetching approved quantities:', error);
            setError('Failed to fetch approved quantities');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !details) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-6xl p-8 mx-auto bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                    <h2 className="text-3xl font-semibold text-gray-800">Request Details</h2>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong className="block text-gray-700">Requester Name:</strong>
                            <p className="text-gray-900">{details.requester_name}</p>
                        </div>
                        <div>
                            <strong className="block text-gray-700">Request From:</strong>
                            <p className="text-gray-900">{details.request_from}</p>
                        </div>
                        <div>
                            <strong className="block text-gray-700">Contact Person:</strong>
                            <p className="text-gray-900">{details.contact_person.name} ({details.contact_person.contact})</p>
                        </div>
                        <div>
                            <strong className="block text-gray-700">Status:</strong>
                            <p className={`text-gray-900 ${details.status === 'Pending'
                                    ? 'text-yellow-600'
                                    : details.status === 'Cancelled'
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                }`}>
                                {details.status}
                            </p>
                        </div>
                        <div>
                            <strong className="block text-gray-700">Request For:</strong>
                            <p className="text-gray-900">{details.request_for?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <strong className="block text-gray-700">Created At:</strong>
                            <p className="text-gray-900">{new Date(details.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <strong className="block text-gray-700">Note:</strong>
                        <p className="text-gray-900">{details.note || 'No note provided'}</p>
                    </div>
                    <div>
                        <strong className="block mb-2 text-gray-700">Items:</strong>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Item</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Category</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Type</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Capacity</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Unit</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Requested Quantity</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Approved Quantity</th>
                                        <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Supplier</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {details.items.map(item => (
                                        <tr key={item.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.item.name}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.item.category?.name || 'N/A'}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.item.type?.name || 'N/A'}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.item.capacity || 'N/A'}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.item.unit || 'N/A'}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.pivot.quantity}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">
                                                {loading ? 'Loading...' : approvedQuantities[item.item.id]}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 border-b border-gray-300">{item.supplier?.name} ({item.supplier?.contact})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        className="px-6 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
