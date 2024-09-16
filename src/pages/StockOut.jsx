import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const StockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchStockOuts();
    }, [filters]);

    const fetchStockOuts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-outs`, { params: filters });
            const formattedData = Object.entries(response.data).map(([requestId, items]) => ({
                requestId,
                items: items.map(item => ({
                    ...item,
                    request: item.request,
                    approved_quantity: item.approved_quantity
                }))
            }));
            setStockOuts(formattedData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching stock outs');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const columns = [
        {
            name: 'Items',
            cell: row => (
                <div>
                    {row.items.map((item, index) => (
                        <div key={index} className="mb-2">
                            <div className="font-semibold">{item.request.items[0]?.item?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-600">
                                <strong>Approved Qty:</strong> {item.approved_quantity}
                            </div>
                            <div className="text-xs text-gray-600">
                                <strong>Category:</strong> {item.request.items[0]?.item?.category?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-600">
                                <strong>Type:</strong> {item.request.items[0]?.item?.type?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-600">
                                <strong>Package Qty:</strong> {item.package_qty || 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            ),
            grow: 2,
        },
        {
            name: 'Requester Name / Request From',
            selector: row => `${row.items[0]?.request?.requester_name || 'N/A'} / ${row.items[0]?.request?.request_from || 'N/A'}`,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => formatDate(row.items[0]?.created_at),
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.items[0]?.request?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {row.items[0]?.request?.status || 'N/A'}
                </span>
            ),
            sortable: true,
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

    const filteredStockOuts = stockOuts.filter(stockOut =>
        stockOut.items.some(item =>
            item.request?.items.some(requestItem =>
                requestItem.item?.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    );

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto px-4">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Stock Outs</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search stock outs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={filteredStockOuts}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default StockOut;