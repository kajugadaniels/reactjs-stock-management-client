import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import ProductStockOutCreate from './ProductStockOut/ProductStockOutCreate';
import ProductStockOutReport from './reports/ProductStockOutReport';

const ProductStockOut = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [stockOutData, setStockOutData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleProductStockOutCreateModal = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const toggleProductStockOutReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    const fetchStockOutData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product-stock-out`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Received non-JSON response from server");
            }
            const data = await response.json();
            setStockOutData(data);
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStockOutData();
    }, []);

    const handleStockOutCreated = () => {
        fetchStockOutData();
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

                </button>
            ),
            omit: !isMobile,
        },
        {
            name: 'Item Name',
            selector: row => row.product_stock_in?.item_name || 'N/A',
            sortable: true,
            wrap: true,
            minWidth: '130px',
            grow: 1,
        },
        {
            name: 'Quantity',
            selector: row => `${row.quantity || 0} Sacks of ${row.product_stock_in?.package_type || 'N/A'}`,
            sortable: true,
            wrap: true, minWidth: '150px',

        },
        {
            name: 'L P S',
            selector: row => row.loading_payment_status,
            minWidth: '150px',
            sortable: true,
            cell: row => (
                <span className={row.loading_payment_status ? 'text-teal-600' : 'text-red-600'}>
                    {row.loading_payment_status ? 'Paid' : 'Not Paid'}
                </span>
            ),
        },
        {
            name: 'Stock OUT ID',
            selector: row => `STCK_OUT-${row.id}`,
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Location',
            selector: row => row.location || 'N/A',
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Employee',
            selector: row => row.employee?.name || 'N/A',
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Batch',
            selector: row => row.batch || 'N/A',
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Client Name',
            selector: row => row.client_name || 'N/A',
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Plate Number',
            selector: row => row.plate || 'N/A',
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Date',
            selector: row => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A',
            sortable: true,
            omit: isMobile,
        },
    ], [expandedRows, toggleRowExpansion, isMobile]);

    const ExpandedComponent = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Stock OUT ID:</div>
                <div>{`STCK_OUT-${data.id}`}</div>
                <div className="font-bold">Location:</div>
                <div>{data.location || 'N/A'}</div>
                <div className="font-bold">Employee:</div>
                <div>{data.employee?.name || 'N/A'}</div>
                <div className="font-bold">Batch:</div>
                <div>{data.batch || 'N/A'}</div>
                <div className="font-bold">Client Name:</div>
                <div>{data.client_name || 'N/A'}</div>
                <div className="font-bold">Plate Number:</div>
                <div>{data.plate || 'N/A'}</div>
                <div className="font-bold">Date:</div>
                <div>{data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}</div>
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

    if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen mt-20">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">Product Stock Out</h1>
                <div className="flex flex-wrap gap-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full sm:w-auto"
                        onClick={toggleProductStockOutCreateModal}
                    >
                        Add New Stock Out
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition w-full sm:w-auto"
                        onClick={toggleProductStockOutReportModal}
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <ProductStockOutCreate
                isOpen={isCreateModalOpen}
                onClose={toggleProductStockOutCreateModal}
                onStockOutCreated={handleStockOutCreated}
            />
            <ProductStockOutReport
                isOpen={isReportModalOpen}
                onClose={toggleProductStockOutReportModal}
            />

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={stockOutData}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    highlightOnHover
                    striped
                    responsive
                    customStyles={customStyles}
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedComponent}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
                />
            </div>
        </div>
    );
};

export default ProductStockOut;