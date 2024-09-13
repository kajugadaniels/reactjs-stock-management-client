import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const ItemInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        name: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesResponse, typesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/categories`),
                axios.get(`${import.meta.env.VITE_API_URL}/types`)
            ]);

            const filteredCategories = categoriesResponse.data.filter(category => category.name !== 'Finished');
            setCategories(filteredCategories);
            setAllTypes(typesResponse.data);
            setFilteredTypes(typesResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/inventory`, { params: filters });
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Error fetching inventory');
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

    const columns = [
        {
            name: 'Item',
            selector: (row) => row.name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.name}</div>
                    <div className="text-xs text-gray-500">
                        {row.category_name} - {row.type_name}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.capacity} {row.unit}
                    </div>
                </div>
            ),
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
            cell: row => {
                const availableQuantity = row.total_stock_in - row.total_stock_out;
                return (
                    <span className={availableQuantity <= 0 ? 'text-red-600 font-semibold' : ''}>
                        {availableQuantity <= 0 ? 'Stock Out' : availableQuantity}
                    </span>
                );
            },
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
        <div className="container mx-auto">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Inventory</h1>
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            placeholder="Search items..."
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={items}
                    pagination
                    responsive
                    highlightOnHover
                    striped
                    progressPending={loading}
                    progressComponent={<div>Loading...</div>}
                    noDataComponent={<div className="p-4">No inventory records found</div>}
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default ItemInventory;