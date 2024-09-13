import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';
import Swal from 'sweetalert2';
import ProductStockInCreate from './ProductStockIn/ProductStockInCreate';
import ProductStockInReport from './reports/ProductStockInReport';

const ProductStockIn = () => {
    const [productStockIns, setProductStockIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProductStockIns();
    }, []);

    const fetchProductStockIns = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/product-stock-ins`);
            setProductStockIns(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching product stock ins');
            setLoading(false);
        }
    };

    const toggleProductStockInCreateModal = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const toggleProductStockInReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    const addProductStockIn = async (productStockIn) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/product-stock-ins`, productStockIn);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product stock in created successfully!',
            });
            fetchProductStockIns();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create product stock in. Please try again.',
            });
            setError(error.message);
        }
    };

    const filteredProductStockIns = productStockIns.filter(
        (stockIn) =>
            stockIn.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stockIn.package_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stockIn.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: 'Stock IN ID',
            selector: (row) => `Prod-${row.id}`,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Finished Product',
            selector: (row) => row.item_name,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Package Type',
            selector: (row) => row.package_type,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Quantity',
            selector: (row) => row.quantity,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Comment',
            selector: (row) => row.comment,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Date',
            selector: (row) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            wrap: true,
            minWidth: '300px',
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
        <div className="p-4 mt-20">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats section */}
                {/* (Your stats section remains unchanged) */}
            </div>

            <div className="flex mb-4 space-x-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={toggleProductStockInReportModal}>
                    Generate Report
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={filteredProductStockIns}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>

            {isCreateModalOpen && (
                <ProductStockInCreate
                    isOpen={isCreateModalOpen}
                    onClose={toggleProductStockInCreateModal}
                    addProductStockIn={addProductStockIn}
                />
            )}
            <ProductStockInReport
                isOpen={isReportModalOpen}
                onClose={toggleProductStockInReportModal}
            />
        </div>
    );
};

export default ProductStockIn;