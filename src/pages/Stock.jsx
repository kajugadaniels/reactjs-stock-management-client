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
        handleDelete
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
                <Link to='/products'>
                    <div className="bg-[rgba(78,189,214,255)] text-white p-2 rounded-lg h-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className='flex gap-1 ml-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                        <path fill="white" d="M6.75 1.5a.75.75 0 0 0 0 1.5h4.75A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5H6.75a.75.75 0 0 0 0 1.5h4.75a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm3.03 5.97l-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H1.75a.75.75 0 0 0 0 1.5h5.69L6.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06"></path>
                                    </svg>
                                    <div className="text-sm font-bold">Stock In</div>
                                </div>
                                <div className='px-6 py-4 mt-1 bg-white'>
                                    <div className="text-2xl font-bold text-[rgba(78,189,214,255)]">29 T</div>
                                    <div className="pt-2 pr-1 text-xs text-gray-500">230 Packaging</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/StockOut'>
                    <div className="p-2 text-white bg-purple-500 rounded-lg h-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className='flex gap-1 ml-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                        <g fill="none">
                                            <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                                            <path fill="white" d="M5 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0zm7.703 10.95a1 1 0 0 0 0-1.415L10.167 13H20a1 1 0 1 0 0-2h-9.833l2.536-2.536a1 1 0 0 0-1.415-1.414l-4.242 4.243a1 1 0 0 0 0 1.414l4.242 4.243a1 1 0 0 0 1.415 0"></path>
                                        </g>
                                    </svg>
                                    <div className="text-sm font-bold">Stock Out</div>
                                </div>
                                <div className='bg-[#ebfdfe] px-6 py-4 mt-1'>
                                    <div className="text-2xl font-bold text-purple-500">79 T</div>
                                    <div className="pt-2 pr-1 text-xs text-gray-500">100 Packaging</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="p-2 text-white bg-blue-500 rounded-lg h-30">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className='flex gap-1 ml-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                                    <path fill="white" d="M16 420a28 28 0 0 0 28 28h424a28 28 0 0 0 28-28V208H16Zm480-296a28 28 0 0 0-28-28H212.84l-48-32H44a28 28 0 0 0-28 28v84h480Z"></path>
                                </svg>
                                <div className="text-sm font-bold">Request</div>
                            </div>
                            <div className='px-6 py-4 mt-1 bg-white'>
                                <div className="text-2xl font-bold text-blue-500">12</div>
                                <div className="pt-2 pr-1 text-xs text-gray-500">12 Today</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-2 bg-orange-200 rounded-lg text-zinc-800 h-30">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className='flex gap-1 ml-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M5 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0zm7.703 10.95a1 1 0 0 0 0-1.415L10.167 13H20a1 1 0 1 0 0-2h-9.833l2.536-2.536a1 1 0 0 0-1.415-1.414l-4.242 4.243a1 1 0 0 0 0 1.414l4.242 4.243a1 1 0 0 0 1.415 0"></path>
                                </svg>
                                <div className="text-sm font-bold">Inventory</div>
                            </div>
                            <div className='bg-[#e7e7e7] px-6 py-4 mt-1'>
                                <div className="text-2xl font-bold text-zinc-800">118 T</div>
                                <div className="pt-2 pr-1 text-xs text-gray-500">4 Packages</div>
                            </div>
                        </div>
                    </div>
                </div>
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
                <CreateRequest isOpen={isModalOpen} onClose={toggleModal} fetchRequests={fetchRequests} />
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
                        {Array.isArray(requests) && requests.length > 0 ? (
                            requests.sort((a, b) => a.id - b.id).map((request) => (
                                <tr key={request.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b border-gray-300"><input type="checkbox" /></td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.item?.item?.name || 'Unknown Item'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.contact_person?.name || 'Unknown Person'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.requester_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.request_from}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{request.status}</td>
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
                                        <button
                                            className="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            onClick={() => openStockOutModal(request.id)}
                                        >
                                            Approve Stock Out
                                        </button>
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

            <CreateRequest isOpen={isModalOpen} onClose={toggleModal} fetchRequests={fetchRequests} />
            <StockOutApproval isOpen={isStockOutModalOpen} onClose={closeStockOutModal} requestId={selectedRequestId} fetchRequests={fetchRequests} />
        </div>
    );
};

export default Stock;
