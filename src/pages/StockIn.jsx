import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import StockInCreate from './stockIn/StockInCreate';
import StockInDetails from './stockIn/StockInDetails';
import StockInEdit from './stockIn/StockInEdit';
import StockInReport from './reports/StockInReport';

const StockIn = () => {
    const [stockIns, setStockIns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStockInCreateOpen, setIsStockInCreateOpen] = useState(false);
    const [isStockInEditOpen, setIsStockInEditOpen] = useState(false);
    const [isStockInDetailsOpen, setIsStockInDetailsOpen] = useState(false);
    const [isStockInReportOpen, setIsStockInReportOpen] = useState(false);
    const [selectedStockIn, setSelectedStockIn] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        startDate: '',
        endDate: '',
        loading_payment_status: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchStockIns();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesResponse, typesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/categories`),
                axios.get(`${import.meta.env.VITE_API_URL}/raw-materials-and-packages`)
            ]);

            setCategories(categoriesResponse.data);
            setAllTypes(typesResponse.data);
            setFilteredTypes(typesResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const fetchStockIns = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-ins`, { params: filters });
            setStockIns(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock ins:', error);
            setError('Error fetching stock ins');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value,
                type: '' // Reset type when category changes
            }));
            if (value) {
                const typesForCategory = allTypes.filter(type => type.category_id.toString() === value);
                setFilteredTypes(typesForCategory);
            } else {
                setFilteredTypes(allTypes);
            }
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value
            }));
        }
    };

    const handleDeleteStockIn = async (id) => {
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`);
                Swal.fire('Deleted!', 'Stock in record has been deleted.', 'success');
                fetchStockIns();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete stock in record.', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true,
        },
        {
            name: 'Item',
            selector: row => row.item.name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.item.name}</div>
                    <div className="text-xs text-gray-500">
                        {row.item.category.name} - {row.item.type.name}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.item.capacity} {row.item.unit}
                    </div>
                </div>
            ),
        },
        {
            name: 'Quantity',
            selector: row => row.init_qty,
            sortable: true,
        },
        {
            name: 'Remaining Qty',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'Plate Number',
            selector: row => row.plate_number,
            sortable: true,
        },
        {
            name: 'Batch Number',
            selector: row => row.batch_number,
            sortable: true,
        },
        {
            name: 'Payment Status',
            selector: row => row.loading_payment_status ? 'Paid' : 'Not Paid',
            sortable: true,
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.loading_payment_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.loading_payment_status ? 'Paid' : 'Not Paid'}
                </span>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => { setSelectedStockIn(row.id); setIsStockInDetailsOpen(true); }}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Details
                    </button>
                    <button
                        onClick={() => { setSelectedStockIn(row); setIsStockInEditOpen(true); }}
                        className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteStockIn(row.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Delete
                    </button>
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

    return (
        <div className="p-4 mt-20">
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-semibold text-gray-800">Stock In Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsStockInCreateOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Add Stock In
                    </button>
                    <button
                        onClick={() => setIsStockInReportOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    >
                        <option value="">All Categories</option>
                        {categories
                            .filter((category) => category.name !== 'Finished')
                            .map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    >
                        <option value="">All Types</option>
                        {filteredTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
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
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Status</label>
                    <select
                        name="loading_payment_status"
                        value={filters.loading_payment_status}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    >
                        <option value="">All</option>
                        <option value="true">Paid</option>
                        <option value="false">Not Paid</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={stockIns}
                    pagination
                    responsive
                    highlightOnHover
                    striped
                    progressPending={loading}
                    progressComponent={<div>Loading...</div>}
                    noDataComponent={<div className="p-4">No stock in records found</div>}
                    customStyles={customStyles}
                />
            </div>

            {isStockInCreateOpen && (
                <StockInCreate 
                    isOpen={isStockInCreateOpen} 
                    onClose={() => setIsStockInCreateOpen(false)} 
                    onStockInCreated={fetchStockIns} 
                />
            )}

            {isStockInEditOpen && (
                <StockInEdit 
                    isOpen={isStockInEditOpen} 
                    onClose={() => setIsStockInEditOpen(false)} 
                    stockIn={selectedStockIn} 
                    onStockInUpdated={fetchStockIns} 
                />
            )}

            {isStockInDetailsOpen && (
                <StockInDetails 
                    isOpen={isStockInDetailsOpen} 
                    onClose={() => setIsStockInDetailsOpen(false)} 
                    stockInId={selectedStockIn} 
                />
            )}

            {isStockInReportOpen && (
                <StockInReport 
                    isOpen={isStockInReportOpen} 
                    onClose={() => setIsStockInReportOpen(false)} 
                />
            )}
        </div>
    );
};

export default StockIn;