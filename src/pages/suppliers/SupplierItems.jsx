import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const SupplierItems = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSupplierItems = async () => {
            if (supplier) {
                try {
                    const [itemsResponse, categoriesResponse, typesResponse] = await Promise.all([
                        axios.get(`${import.meta.env.VITE_API_URL}/suppliers/${supplier.id}/items`),
                        axios.get(`${import.meta.env.VITE_API_URL}/categories`),
                        axios.get(`${import.meta.env.VITE_API_URL}/types`)
                    ]);

                    const categories = categoriesResponse.data;
                    const types = typesResponse.data;

                    const itemsWithDetails = itemsResponse.data.map(item => ({
                        ...item,
                        category_name: categories.find(cat => cat.id === item.category_id)?.name || 'Unknown',
                        type_name: types.find(type => type.id === item.type_id)?.name || 'Unknown'
                    }));

                    setItems(itemsWithDetails);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching supplier items:', error);
                    setError('Failed to fetch supplier items');
                    setLoading(false);
                }
            }
        };

        fetchSupplierItems();
    }, [supplier]);

    const columns = [
        {
            name: 'Item ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type_name,
            sortable: true,
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity || 'N/A'} ${row.unit || ''}`,
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-semibold">Items for {supplier.name}</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={items}
                        pagination
                        responsive
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                    />
                )}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupplierItems;