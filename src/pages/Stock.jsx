import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import CreateRequest from './request/CreateRequest';
import StockOutApproval from './Stockout/StockOutApproval';
import RequestDetails from './request/RequestDetails';
import RequestPackaging from './request/RequestPackaging';
import RequestReport from './reports/RequestReport';

const Stock = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRequestItemModalOpen, setIsRequestItemModalOpen] = useState(false);
    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
    const [isRequestPackagingOpen, setIsRequestPackagingOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [requestDetails, setRequestDetails] = useState(null);
    const [isRequestReportOpen, setIsRequestReportOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        requester: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests`, { params: filters });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Error fetching requests');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/requests/${id}`);
                Swal.fire('Deleted!', 'Request has been deleted.', 'success');
                fetchRequests();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete request.', 'error');
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const columns = [
        {
            name: 'Req Id',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Item',
            selector: row => row.items[0]?.item?.name || '',
            sortable: true,
            cell: row => (
                <div>
                    {row.items.map((item, index) => (
                        <div key={index}>
                            <div>{item.item?.name || ''}</div>
                            <div className="text-xs text-gray-500">
                                {item.item?.category?.name || ''} - {item.item?.type?.name || ''}
                            </div>
                            <div className="text-xs text-gray-500">
                                {item.item?.capacity || ''} {item.item?.unit || ''}
                            </div>
                            {index < row.items.length - 1 && <hr className="my-1" />}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            name: 'Contact Person',
            selector: row => row.contact_person?.name || '',
            sortable: true,
        },
        {
            name: 'Requester',
            selector: row => row.requester_name,
            sortable: true,
        },
        {
            name: 'Request From',
            selector: row => row.request_from,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Request For',
            selector: row => row.request_for?.name || '',
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openDetailsModal(row.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        View Details
                    </button>
                    {row.status === 'Pending' && (
                        <button
                            onClick={() => openStockOutModal(row.id)}
                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            Approve Stock Out
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb',
            },
        },
        headCells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#374151',
            },
        },
        rows: {
            style: {
                fontSize: '0.875rem',
                backgroundColor: 'white',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f9fafb',
                },
                '&:hover': {
                    backgroundColor: '#f3f4f6',
                },
                borderBottom: '1px solid #e5e7eb',
            },
        },
    };

    const openDetailsModal = async (requestId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests/${requestId}`);
            setRequestDetails(response.data);
            setIsRequestItemModalOpen(true);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };

    const openStockOutModal = (requestId) => {
        setSelectedRequestId(requestId);
        setIsStockOutModalOpen(true);
    };

    return (
        <div className="p-4 mt-20">
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-semibold text-gray-800">Stock Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsRequestItemModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Request Item
                    </button>
                    <button
                        onClick={() => setIsRequestPackagingOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Request Package
                    </button>
                    <button
                        onClick={() => setIsRequestReportOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Requester</label>
                    <input
                        type="text"
                        name="requester"
                        value={filters.requester}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                        placeholder="Enter requester name"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    />
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={requests}
                    pagination
                    responsive
                    highlightOnHover
                    striped
                    progressPending={loading}
                    progressComponent={<div>Loading...</div>}
                    noDataComponent={<div className="p-4">No requests found</div>}
                    customStyles={customStyles}
                />
            </div>

            <CreateRequest
                isOpen={isRequestItemModalOpen}
                onClose={() => setIsRequestItemModalOpen(false)}
                fetchRequests={fetchRequests}
            />
            <StockOutApproval
                isOpen={isStockOutModalOpen}
                onClose={() => setIsStockOutModalOpen(false)}
                requestId={selectedRequestId}
                fetchRequests={fetchRequests}
            />
            <RequestDetails
                isOpen={isRequestItemModalOpen && requestDetails !== null}
                onClose={() => {
                    setIsRequestItemModalOpen(false);
                    setRequestDetails(null);
                }}
                details={requestDetails}
            />
            <RequestPackaging
                isOpen={isRequestPackagingOpen}
                onClose={() => setIsRequestPackagingOpen(false)}
            />
            <RequestReport
                isOpen={isRequestReportOpen}
                onClose={() => setIsRequestReportOpen(false)}
            />
        </div>
    );
}

export default Stock;