import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

const SupplierItems = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    useEffect(() => {
        if (supplier && isOpen) {
            fetchData();
        }
    }, [supplier, isOpen]);

    const handleDelete = async (id) => {
        try {
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
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/supplier-items/${id}`);

                if (response.status === 200) {
                    setItems(items.filter(item => item.id !== id));
                    Swal.fire('Deleted!', response.data.message, 'success');
                } else {
                    throw new Error('Unexpected response status');
                }
            }
        } catch (error) {
            console.error('Error deleting supplier item:', error);
            Swal.fire('Error!', 'Failed to delete the supplier item.', 'error');
        }
    };

    const toggleRowExpansion = useCallback((row) => {
        setExpandedRows(prev => ({ ...prev, [row.id]: !prev[row.id] }));
    }, []);

    const columns = useMemo(() => [
        {
            name: '',
            width: '50px',
            cell: row => (
                <button onClick={() => toggleRowExpansion(row)} className="w-full h-full flex items-center justify-center">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transform: expandedRows[row.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out'
                        }}
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg> */}
                </button>
            ),
            omit: !isMobile,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Category',
            selector: row => categories.find(cat => cat.id === row.category_id)?.name || 'Unknown',
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Type',
            selector: row => types.find(type => type.id === row.type_id)?.name || 'Unknown',
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Item ID',
            selector: row => row.supplier_item_id,
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity || 'N/A'} ${row.unit || ''}`,
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => handleDelete(row.supplier_item_id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    Delete
                </button>
            ),
            omit: isMobile,
        },
    ], [categories, types, expandedRows, toggleRowExpansion, isMobile]);

    const ExpandedComponent = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item ID:</div>
                <div>{data.supplier_item_id}</div>
                <div className="font-bold">Capacity:</div>
                <div>{`${data.capacity || 'N/A'} ${data.unit || ''}`}</div>
                <div className="font-bold">Actions:</div>
                <div>
                    <button
                        onClick={() => handleDelete(data.supplier_item_id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

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
                minHeight: 'auto',
            },
        },
        cells: {
            style: {
                padding: '12px 8px',
                whiteSpace: 'normal',
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
                        expandableRows={isMobile}
                        expandableRowsComponent={ExpandedComponent}
                        expandableRowExpanded={row => expandedRows[row.id]}
                        onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
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