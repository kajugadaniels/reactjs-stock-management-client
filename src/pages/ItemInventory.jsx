import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const ItemInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        type: '',
    });

    useEffect(() => {
        fetchInventory();
    }, [currentPage, filters]);

    const fetchInventory = async () => {
        try {
            const params = {
                page: currentPage,
                itemsPerPage,
                ...filters,
            };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/inventory`, { params });
            setItems(response.data);
            setTotalItems(response.data.length);
            setLoading(false);
        } catch (error) {
            setError('Error fetching inventory');
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
            name: 'No',
            selector: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
            sortable: true,
        },
        {
            name: 'Item',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: (row) => row.category_name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row) => row.type_name,
            sortable: true,
        },
        {
            name: 'Capacity',
            selector: (row) => `${row.capacity || 'N/A'} ${row.unit || ''}`,
            sortable: true,
        },
        {
            name: 'Stock In',
            selector: (row) => row.total_stock_in,
            sortable: true,
        },
        {
            name: 'Stock Out',
            selector: (row) => row.total_stock_out,
            sortable: true,
        },
        {
            name: 'Available',
            selector: (row) => row.total_stock_in - row.total_stock_out,
            sortable: true,
        },
    ];

    const customStyles = {
        // Same customStyles as in the Items.jsx example
    };

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Inventory</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleFilterChange({ target: { name: 'name', value: e.target.value } });
                            }}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        >
                            <option value="">Filter by Category</option>
                            {/* Populate category options */}
                        </select>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        >
                            <option value="">Filter by Type</option>
                            {/* Populate type options */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={items}
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

export default ItemInventory;