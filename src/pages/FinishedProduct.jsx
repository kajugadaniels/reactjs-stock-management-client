import React, { useState, useEffect } from 'react';
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
            selector: row => row.stock_out?.request?.request_for?.name ?? '',
            sortable: true,
        },
        {
            name: 'Item Quantity',
            selector: row => `${row.item_qty} KG`,
            sortable: true,
        },
        {
            name: 'Brand Quantity',
            selector: row => `${row.brand_qty} KG`,
            sortable: true,
        },
        {
            name: 'Dechet Quantity',
            selector: row => `${row.dechet_qty} KG`,
            sortable: true,
        },
        {
            name: 'Comment',
            selector: row => row.comment ?? '',
            sortable: true,
        },
        {
            name: 'Actions',
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

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
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
                <DataTable
                    columns={columns}
                    data={finishedProducts}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
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