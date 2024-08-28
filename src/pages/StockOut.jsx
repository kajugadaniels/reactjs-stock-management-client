import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const StockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        requester: '',
    });

    useEffect(() => {
        fetchStockOuts();
    }, [currentPage, filters]);

    const fetchStockOuts = async () => {
        try {
            const params = {
                page: currentPage,
                itemsPerPage,
                ...filters,
            };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-outs`, { params });
            setStockOuts(response.data);
            setTotalItems(response.data.length);
            setLoading(false);
        } catch (error) {
            setError('Error fetching stock outs');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setCurrentPage(1);
    };

    const columns = [
        {
            name: 'Item',
            selector: (row) => row.request.items[0]?.item?.name || '',
            sortable: true,
            cell: (row) => (
                <div>
                    {row.request.items.map((item, index) => (
                        <div key={index} className="mb-2">
                            <div className="font-semibold">{item.item?.name || ''} - {item.pivot.quantity} ({item.supplier?.name || 'N/A'})</div>
                            <div className="text-xs text-gray-600">
                                {item.item?.category?.name || 'N/A'} {item.item?.type?.name || 'N/A'} {item.item?.capacity || ''} {item.item?.unit || ''}
                            </div>
                            <div className="text-xs text-gray-600">
                                Package Qty {row.package_qty || 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            ),
            grow: 1,
        },
        {
            name: 'Requester Name / Request From',
            selector: (row) => `${row.request.requester_name} / ${row.request.request_from}`,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (row) => row.request.items.reduce((total, item) => total + item.pivot.quantity, 0),
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {row.status}
                </span>
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

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Stock Outs</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search stock outs..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleFilterChange({ target: { name: 'requester', value: e.target.value } });
                            }}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                    data={stockOuts}
                    pagination
                    paginationServer
                    paginationTotalRows={totalItems}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(rowsPerPage) => setItemsPerPage(rowsPerPage)}
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