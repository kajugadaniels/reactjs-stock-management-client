import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const SupplierItems = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [itemsResponse, categoriesResponse, typesResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplier.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/categories`),
                    axios.get(`${import.meta.env.VITE_API_URL}/types`)
                ]);

                setItems(itemsResponse.data.data || []);
                setCategories(categoriesResponse.data || []);
                setTypes(typesResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (supplier && isOpen) {
            fetchData();
        }
    }, [supplier, isOpen]);

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
            selector: row => categories.find(cat => cat.id === row.category_id)?.name || 'Unknown',
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => types.find(type => type.id === row.type_id)?.name || 'Unknown',
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
                    <div className="text-yellow-500">{error}</div>
                ) : items.length === 0 ? (
                    <div className="text-lg font-semibold text-yellow-600">
                        This supplier hasn't supplied any items yet.
                    </div>
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
