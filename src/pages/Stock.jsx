import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateRequest from './request/CreateRequest';
import StockOutApproval from './Stockout/StockOutApproval';
import RequestDetails from './request/RequestDetails';
import RequestPackaging from './request/RequestPackaging';
import { useRequests } from '../hooks';
import RequestReport from './reports/RequestReport';

const Stock = () => {
    const {
        requests,
        loading,
        error,
        fetchRequests,
        handleDelete,
        fetchRequestDetails,
    } = useRequests();
    const [isRequestItemModalOpen, setIsRequestItemModalOpen] = useState(false);
    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
    const [isRequestPackagingOpen, setIsRequestPackagingOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [requestDetails, setRequestDetails] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isRequestReportOpen, setIsRequestReportOpen] = useState(false);

    const toggleRequestItemModal = () => {
        setIsRequestItemModalOpen(!isRequestItemModalOpen);
    };

    const toggleRequestPackaging = () => {
        setIsRequestPackagingOpen(!isRequestPackagingOpen);
    };

    const openStockOutModal = (requestId) => {
        setSelectedRequestId(requestId);
        setIsStockOutModalOpen(true);
    };

    const closeStockOutModal = () => {
        setSelectedRequestId(null);
        setIsStockOutModalOpen(false);
    };

    const openDetailsModal = async (requestId) => {
        try {
            const details = await fetchRequestDetails(requestId);
            setRequestDetails(details);
            setIsRequestItemModalOpen(true);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };

    const closeDetailsModal = () => {
        setRequestDetails(null);
        setIsRequestItemModalOpen(false);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(requests.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleRequestReport = () => {
        setIsRequestReportOpen(!isRequestReportOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-4 mb-6">
                <Link to='/products'>
                    <div className="bg-[rgba(78,189,214,255)] text-white p-2 rounded-lg w-32">
                        <div className="flex ">
                            <div>
                                <div className='flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                        <path fill="white" d="M6.75 1.5a.75.75 0 0 0 0 1.5h4.75A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5H6.75a.75.75 0 0 0 0 1.5h4.75a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm3.03 5.97l-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H1.75a.75.75 0 0 0 0 1.5h5.69L6.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06"></path>
                                    </svg>
                                    <div className="text-xs font-bold">Stock In</div>
                                </div>
                                <div className='px-2 py-3 mt-1 bg-white rounded-lg'>
                                    <div className="text-lg font-bold text-[rgba(78,189,214,255)]">29 T</div>
                                    <div className="pt-1 pr-1 text-xs text-gray-500">230 Packaging</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                {/* Other links and stats... */}
            </div>

            <div className="flex flex-wrap items-center mb-6 space-y-2 md:space-y-0 md:space-x-4">
                <button
                    onClick={toggleRequestItemModal}
                    className="mt-1 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
                >
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                        </span>
                        Request Item
                    </div>
                </button>

                <button
                    onClick={toggleRequestPackaging}
                    className="mt-4 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
                >
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                        </span>
                        Request Package
                    </div>
                </button>
                <button
                    onClick={toggleRequestReport}
                    className="mt-4 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
                >
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path fill="currentColor" d="M7 12h2v5H7zm8-5h2v10h-2zm-4 7h2v3h-2zm0-4h2v2h-2z"/></svg>
                        </span>
                        Generate Report
                    </div>
                </button>
                <div className="flex items-center space-x-2">
                    <label className="text-sm">From</label>
                    <input type="date" className="p-2 border rounded-lg border-zinc-300" defaultValue="2024-02-09" />
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm">To</label>
                    <input type="date" className="p-2 border rounded-lg border-zinc-300" defaultValue="2024-02-20" />
                </div>
                <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">Today</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Check</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Req Id</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Item</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Contact Person</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Requester</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Request From</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Status</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Request For</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Quantity</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Note</th>
                            <th className="px-2 py-3 text-xs font-medium text-left text-gray-700 border-b border-gray-300 sm:px-4 sm:text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentRequests.length > 0 ? (
                            currentRequests.map((request) => (
                                <tr key={request.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                    <td className="px-2 py-4 border-b border-gray-300 sm:px-4"><input type="checkbox" /></td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.id}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">
                                        {request.items.map(item => (
                                            <div key={item.id}>
                                                <span>{item.item?.name || ''}</span> <span>{item.item?.capacity || ''}{item.item?.unit || ''}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.contact_person?.name || ''}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.requester_name}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.request_from}</td>
                                    <td className={`px-2 sm:px-4 py-4 text-xs sm:text-sm text-white border-b border-gray-300 ${request.status === 'Pending' ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {request.status}
                                    </td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.request_for?.name || ''}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.quantity}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">{request.note}</td>
                                    <td className="px-2 py-4 text-xs text-gray-600 border-b border-gray-300 sm:px-4 sm:text-sm">
                                        <button
                                            className="px-2 py-1 mr-2 text-xs text-white bg-blue-600 rounded-lg sm:px-3 sm:text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={() => openDetailsModal(request.id)}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="px-2 py-1 mr-2 text-xs text-white bg-red-600 rounded-lg sm:px-3 sm:text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            onClick={() => handleDelete(request.id)}
                                        >
                                            Delete
                                        </button>
                                        {request.status === 'Pending' && (
                                            <button
                                                className="px-2 py-1 text-xs text-white bg-green-600 rounded-lg sm:px-3 sm:text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>

            <CreateRequest
                isOpen={isRequestItemModalOpen}
                onClose={toggleRequestItemModal}
                fetchRequests={fetchRequests}
            />
            <StockOutApproval
                isOpen={isStockOutModalOpen}
                onClose={closeStockOutModal}
                requestId={selectedRequestId}
                fetchRequests={fetchRequests}
            />
            <RequestDetails
                isOpen={isRequestItemModalOpen}
                onClose={closeDetailsModal}
                details={requestDetails}
            />
            <RequestPackaging
                isOpen={isRequestPackagingOpen}
                onClose={toggleRequestPackaging}
            />
            <RequestReport
                isOpen={isRequestReportOpen}
                onClose={toggleRequestReport}
            />
        </div>
    );
};

export default Stock;