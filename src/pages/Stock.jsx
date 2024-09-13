import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import RequestReport from './reports/RequestReport';
import CreateRequest from './request/CreateRequest';
import RequestDetails from './request/RequestDetails';
import RequestPackaging from './request/RequestPackaging';
import StockOutApproval from './Stockout/StockOutApproval';

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
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
            setUserRole(user.role);
        }
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests`, {
                params: {
                    category: filters.category,
                    type: filters.type,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    status: filters.status,
                    requester: filters.requester
                }
            });
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

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/stock-outs/cancel/${id}`);
                Swal.fire('Cancelled!', 'Request has been cancelled.', 'success');
                fetchRequests();
            } catch (error) {
                Swal.fire('Error!', 'Failed to cancel request.', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Item',
            selector: row => row.items[0]?.item?.name || '',
            sortable: true,
            cell: row => (
                <div>
                    {row.items.map((item, index) => (
                        <div key={index} className="mb-2">
                            <div className="font-semibold">{item.item?.name || ''} ({item.supplier?.name || 'N/A'})</div>
                            <div className="text-xs text-gray-600">
                                {item.item?.category?.name || 'N/A'} {item.item?.type?.name || 'N/A'} {item.item?.capacity || ''} {item.item?.unit || ''}
                            </div>
                        </div>
                    ))}
                </div>
            ),
            grow: 2,
            wrap: true,
            minWidth: '200px',
        },
        {
            name: 'Request For & Quantity',
            selector: row => `${row.request_for?.name || ''} (${row.quantity})`,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Requester',
            selector: row => `${row.request_from || ''} (${row.requester_name})`,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : row.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                    {row.status}
                </span>
            ),
            minWidth: '100px',
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={() => openDetailsModal(row.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        View Details
                    </button>
                    {userRole !== 'Production' && row.status === 'Pending' && (
                        <>
                            <button
                                onClick={() => openStockOutModal(row.id)}
                                className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleCancel(row.id)}
                                className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '200px',
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
                padding: '12px 8px',
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
        cells: {
            style: {
                padding: '12px 8px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
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

    const canAccessStockLinks = ['Manager', 'Storekeeper'].includes(userRole);

    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-16 mt-20">
            {canAccessStockLinks && (
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
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to='/StockOut'>
                        <div className="w-32 p-2 text-white bg-purple-500 rounded-lg">
                            <div className="flex items-center ">
                                <div>
                                    <div className='flex gap-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                            <g fill="none">
                                                <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                                                <path fill="white" d="M5 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0zm7.703 10.95a1 1 0 0 0 0-1.415L10.167 13H20a1 1 0 1 0 0-2h-9.833l2.536-2.536a1 1 0 0 0-1.415-1.414l-4.242 4.243a1 1 0 0 0 0 1.414l4.242 4.243a1 1 0 0 0 1.415 0"></path>
                                            </g>
                                        </svg>
                                        <div className="text-xs font-bold">Stock Out</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Stock Management</h1>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsRequestItemModalOpen(true)}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Request Item
                    </button>
                    <button
                        onClick={() => setIsRequestPackagingOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2 w-full sm:w-auto"
                    >
                        Request Package
                    </button>
                    <button
                        onClick={() => setIsRequestReportOpen(true)}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                    columns={columns}
                    data={requests}
                    pagination
                    responsive
                    highlightOnHover
                    striped
                    progressPending={loading}
                    progressComponent={<div className="p-4">Loading...</div>}
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