// Stock.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateRequest from './request/CreateRequest';
import StockOutApproval from './Stockout/StockOutApproval';
import { useRequests } from '../hooks';

const Stock = () => {
    const {
        requests,
        loading,
        error,
        fetchRequests,
        handleDelete,
    } = useRequests();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const openStockOutModal = (requestId) => {
        setSelectedRequestId(requestId);
        setIsStockOutModalOpen(true);
    };

    const closeStockOutModal = () => {
        setSelectedRequestId(null);
        setIsStockOutModalOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex mb-6 space-x-4">
                {/* Stock In, Stock Out, Request, and Inventory cards */}
                {/* ... (Keep these sections as they were in your original code) */}
            </div>

            <div className="flex items-center mb-6 space-x-4">
                <button
                    onClick={toggleModal}
                    className="mb-4 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
                >
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                        </span>
                        Request Item
                    </div>
                </button>
                <div className="flex items-center space-x-2">
                    <label>From</label>
                    <input type="date" className="p-2 border rounded-lg border-zinc-300" defaultValue="2024-02-09" />
                </div>
                <div className="flex items-center space-x-2">
                    <label>To</label>
                    <input type="date" className="p-2 border rounded-lg border-zinc-300" defaultValue="2024-02-20" />
                </div>
                <button className="px-4 py-2 text-white bg-green-500 rounded-lg">Today</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Check</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Req Id</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Item</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Contact Person</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Requester</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Request From</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Request For</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Quantity</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Note</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b border-gray-300"><input type="checkbox" /></td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">
                                        {request.items.map(item => item.item?.name).join(', ') || 'Unknown Item'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.contact_person?.name || 'Unknown Person'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.requester_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.request_from}</td>
                                    <td className={`px-6 py-4 text-sm text-white border-b border-gray-300 ${request.status === 'Pending' ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {request.status}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.request_for?.name || 'Unknown Item'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.note}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">
                                        <button
                                            className="px-3 py-1 mr-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={() => handleEdit(request.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 mr-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            onClick={() => handleDelete(request.id)}
                                        >
                                            Delete
                                        </button>
                                        {request.status === 'Pending' && (
                                            <button
                                                className="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                onClick={() => openStockOutModal(request.id)}
                                            >
                                                Approve Stock Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="px-6 py-4 text-sm text-center text-gray-600 border-b border-gray-300">No requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateRequest
                isOpen={isModalOpen}
                onClose={toggleModal}
                fetchRequests={fetchRequests}
            />
            <StockOutApproval
                isOpen={isStockOutModalOpen}
                onClose={closeStockOutModal}
                requestId={selectedRequestId}
                fetchRequests={fetchRequests}
            />
        </div>
    );
};

export default Stock;