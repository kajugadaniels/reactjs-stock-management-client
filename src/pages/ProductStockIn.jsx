import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const toggleRowExpansion = useCallback((row) => {
        setExpandedRows(prev => ({ ...prev, [row.id]: !prev[row.id] }));
    }, []);

    const columns = useMemo(() => [
        {
            name: '',
            width: '50px',
            cell: row => (
                <button onClick={() => toggleRowExpansion(row)}>
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
            name: 'Stock IN ID',
            selector: (row) => `Prod-${row.id}`,
            sortable: true,
            omit: isMobile,
            minWidth: '150px',
        },
        {
            name: 'Finished Product',
            selector: (row) => row.item_name,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Package Type',
            selector: (row) => row.package_type,
            sortable: true,
            minWidth: '300px',
        },
        {
            name: 'Quantity',
            selector: (row) => row.quantity,
            sortable: true,
            omit: isMobile,
            minWidth: '150px',
        },
        {
            name: 'Comment',
            selector: (row) => row.comment,
            sortable: true,
            omit: isMobile,
            minWidth: '150px',
        },
        {
            name: 'Date',
            selector: (row) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            minWidth: '150px',
        },
    ], [isMobile, expandedRows, toggleRowExpansion]);

    const ExpandedRow = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Stock IN ID:</div>
                <div>{`Prod-${data.id}`}</div>
                <div className="font-bold">Quantity:</div>
                <div>{data.quantity}</div>
                <div className="font-bold">Comment:</div>
                <div>{data.comment}</div>
            </div>
        </div>
    );

    const filteredProductStockIns = productStockIns.filter(
        (stockIn) =>
            stockIn.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stockIn.package_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stockIn.comment.toLowerCase().includes(searchTerm.toLowerCase())
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

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                />
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
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedRow}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
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