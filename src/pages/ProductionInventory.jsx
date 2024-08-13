import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const ProductionInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/production-inventory`);
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Failed to fetch inventory data');
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'Item Name',
            selector: row => row.item_name,
            sortable: true,
        },
        {
            name: 'Package Type',
            selector: row => row.package_type,
            sortable: true,
        },
        {
            name: 'Total Stock In (KG)',
            selector: row => row.total_stock_in,
            sortable: true,
        },
        {
            name: 'Total Packages In',
            selector: row => row.total_packages_in,
            sortable: true,
        },
        {
            name: 'Total Stock Out',
            selector: row => row.total_stock_out,
            sortable: true,
        },
        {
            name: 'Available Quantity',
            selector: row => row.available_quantity,
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

    const filteredItems = inventory.filter(
        item => item.item_name && item.item_name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <div className="relative">
                <input
                    type="text"
                    placeholder="Filter by Item Name"
                    className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
            </div>
        );
    }, [filterText]);

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

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto py-32">
            <h1 className="text-2xl font-bold mb-4">Production Inventory</h1>
            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                customStyles={customStyles}
            />
        </div>
    );
};

export default ProductionInventory;