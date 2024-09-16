import React, { useEffect, useState, useMemo } from 'react';
import ProductStockOutCreate from './ProductStockOut/ProductStockOutCreate';
import ProductStockOutReport from './reports/ProductStockOutReport';

const ProductStockOut = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [stockOutData, setStockOutData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const itemsPerPage = 10;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
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
            const contentType = response.headers.get("content-type");
            if (!response.ok) throw new Error('Network response was not ok.');
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

    const paginatedStockOuts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return stockOutData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, stockOutData]);

    const totalPages = Math.ceil(stockOutData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    const MobileStockOutCard = ({ item }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Stock OUT ID:</div>
                <div>STCK_OUT-{item.id}</div>
                <div className="font-bold">Location:</div>
                <div>{item.location || 'N/A'}</div>
                <div className="font-bold">Employee:</div>
                <div>{item.employee?.name || 'N/A'}</div>
                <div className="font-bold">Item Name:</div>
                <div>{item.product_stock_in?.item_name || 'N/A'}</div>
                <div className="font-bold">Batch:</div>
                <div>{item.batch || 'N/A'}</div>
                <div className="font-bold">Client Name:</div>
                <div>{item.client_name || 'N/A'}</div>
                <div className="font-bold">Quantity:</div>
                <div>{`${item.quantity || 0} Sacks of ${item.product_stock_in?.package_type || 'N/A'}`}</div>
                <div className="font-bold">Plate Number:</div>
                <div>{item.plate || 'N/A'}</div>
                <div className="font-bold">L P S:</div>
                <div className={item.loading_payment_status ? 'text-teal-600' : 'text-red-600'}>
                    {item.loading_payment_status ? 'Paid' : 'Not Paid'}
                </div>
                <div className="font-bold">Date:</div>
                <div>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</div>
            </div>
        </div>
    );

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

            {isMobile ? (
                <div>
                    {paginatedStockOuts.map((item) => (
                        <MobileStockOutCard key={item.id} item={item} />
                    ))}
                    <SimplePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Stock OUT ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Batch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Client Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Plate Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">L P S</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal min-w-[150px]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedStockOuts.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">STCK_OUT-{item.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.location || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.employee?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.product_stock_in?.item_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.batch || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.client_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{`${item.quantity || 0} Sacks of ${item.product_stock_in?.package_type || 'N/A'}`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.plate || 'N/A'}</td>
                                        <td className={`px-6 py-4 text-sm font-medium ${item.loading_payment_status ? 'text-teal-600' : 'text-red-600'}`}>
                                            {item.loading_payment_status ? 'Paid' : 'Not Paid'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductStockOut;