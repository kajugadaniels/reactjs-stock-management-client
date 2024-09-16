import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import PackagingCreate from './Process/PackagingCreate';
import FinishedProductReport from './reports/FinishedProductReport';

const FinishedProduct = () => {
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPackagingModalOpen, setIsPackagingModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedFinishedProduct, setSelectedFinishedProduct] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchFinishedProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/finished-products`);
            setFinishedProducts(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching finished products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinishedProducts();
    }, []);

    const togglePackagingCreateModal = (finishedProduct) => {
        setSelectedFinishedProduct(finishedProduct);
        setIsPackagingModalOpen(!isPackagingModalOpen);
    };

    const toggleReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    const addPackagingRequest = async (finishedProductId, packageRequests) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/package-requests`, {
                finished_product_id: finishedProductId,
                packages: packageRequests
            });
            Swal.fire('Success', 'Packaging request added successfully', 'success');
            fetchFinishedProducts();
            return response.data;
        } catch (error) {
            Swal.fire('Error', 'Failed to add packaging request', 'error');
            throw error;
        }
    };

    const columns = [
        {
            name: 'Item',
            wrap: true,
            minWidth: '200px',
            selector: row => row.stock_out?.request?.items[0]?.item?.name ?? '',
            sortable: true,
            cell: row => {
                const item = row.stock_out?.request?.items[0]?.item;
                return (
                    <div>
                        <div>{item?.name ?? ''}</div>
                        <div className="text-xs text-gray-500">
                            {item?.category?.name ?? ''} - {item?.type?.name ?? ''}
                        </div>
                        <div className="text-xs text-gray-500">
                            {item?.capacity ?? ''} {item?.unit ?? ''}
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'Stockout Item',
            wrap: true,
            minWidth: '200px',
            selector: row => row.stock_out?.request?.request_for?.name ?? '',
            sortable: true,
        },
        {
            name: 'Item Quantity',
            wrap: true,
            minWidth: '200px',
            selector: row => `${row.item_qty} KG`,
            sortable: true,
        },
        {
            name: 'Brand Quantity',
            selector: row => `${row.brand_qty} KG`,
            sortable: true,
            wrap: true,
            minWidth: '200px',
        },
        {
            name: 'Dechet Quantity',
            selector: row => `${row.dechet_qty} KG`,
            sortable: true,
            wrap: true,
            minWidth: '200px',
        },
        {
            name: 'Comment',
            selector: row => row.comment ?? '',
            sortable: true,
            wrap: true,
            minWidth: '200px',
        },
        {
            name: 'Actions',
            wrap: true,
            minWidth: '200px',
            cell: (row) => (
                <div className="flex space-x-2">
                    {row.item_qty > 0 && (
                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => togglePackagingCreateModal(row)}
                        >
                            Packaging
                        </button>
                    )}
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

    const paginatedFinishedProducts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return finishedProducts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, finishedProducts, itemsPerPage]);

    const totalPages = Math.ceil(finishedProducts.length / itemsPerPage);

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

    const MobileFinishedProductCard = ({ product }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item:</div>
                <div>
                    {product.stock_out?.request?.items[0]?.item?.name ?? ''}
                    <div className="text-xs text-gray-500">
                        {product.stock_out?.request?.items[0]?.item?.category?.name ?? ''} - {product.stock_out?.request?.items[0]?.item?.type?.name ?? ''}
                    </div>
                    <div className="text-xs text-gray-500">
                        {product.stock_out?.request?.items[0]?.item?.capacity ?? ''} {product.stock_out?.request?.items[0]?.item?.unit ?? ''}
                    </div>
                </div>
                <div className="font-bold">Stockout Item:</div>
                <div>{product.stock_out?.request?.request_for?.name ?? ''}</div>
                <div className="font-bold">Item Quantity:</div>
                <div>{product.item_qty} KG</div>
                <div className="font-bold">Brand Quantity:</div>
                <div>{product.brand_qty} KG</div>
                <div className="font-bold">Dechet Quantity:</div>
                <div>{product.dechet_qty} KG</div>
                <div className="font-bold">Comment:</div>
                <div>{product.comment ?? ''}</div>
            </div>
            <div className="mt-4">
                {product.item_qty > 0 && (
                    <button
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => togglePackagingCreateModal(product)}
                    >
                        Packaging
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto px-4">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Finished Products</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <button
                        onClick={toggleReportModal}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                {isMobile ? (
                    <div className="p-4">
                        {paginatedFinishedProducts.map(product => (
                            <MobileFinishedProductCard key={product.id} product={product} />
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
                        data={finishedProducts}
                        pagination
                        paginationPerPage={itemsPerPage}
                        paginationTotalRows={finishedProducts.length}
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

            {selectedFinishedProduct && (
                <PackagingCreate
                    isOpen={isPackagingModalOpen}
                    onClose={() => setIsPackagingModalOpen(false)}
                    finishedProduct={selectedFinishedProduct}
                />
            )}
            <FinishedProductReport
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
};

export default FinishedProduct;