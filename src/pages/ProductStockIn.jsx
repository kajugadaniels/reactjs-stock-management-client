import React, { useState, useEffect, useMemo } from 'react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
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

    const paginatedProductStockIns = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return filteredProductStockIns.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredProductStockIns, itemsPerPage]);

    const totalPages = Math.ceil(filteredProductStockIns.length / itemsPerPage);

    const SimplePagination = ({ currentPage, totalPages, onPageChange }) => {
        return (
            <div className="flex justify-between items-center mt-4 px-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    const MobileProductStockInCard = ({ stockIn }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Stock IN ID:</div>
                <div>{`Prod-${stockIn.id}`}</div>
                <div className="font-bold">Finished Product:</div>
                <div>{stockIn.item_name}</div>
                <div className="font-bold">Package Type:</div>
                <div>{stockIn.package_type}</div>
                <div className="font-bold">Quantity:</div>
                <div>{stockIn.quantity}</div>
                <div className="font-bold">Comment:</div>
                <div>{stockIn.comment}</div>
                <div className="font-bold">Date:</div>
                <div>{new Date(stockIn.created_at).toLocaleDateString()}</div>
            </div>
        </div>
    );

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="p-4 mt-20">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats section */}
                {/* (Your stats section remains unchanged) */}
            </div>

            <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={toggleProductStockInReportModal}>
                    Generate Report
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search product stock ins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                    />
                    <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {isMobile ? (
                    <div className="p-4">
                        {paginatedProductStockIns.map(stockIn => (
                            <MobileProductStockInCard key={stockIn.id} stockIn={stockIn} />
                        ))}
                        <SimplePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredProductStockIns}
                        pagination
                        paginationPerPage={itemsPerPage}
                        paginationTotalRows={filteredProductStockIns.length}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setCurrentPage(page)}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                    />
                )}
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