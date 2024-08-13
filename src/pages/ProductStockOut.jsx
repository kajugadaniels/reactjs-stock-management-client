import React, { useEffect, useState } from 'react';
import ProductStockOutCreate from './ProductStockOut/ProductStockOutCreate';
import ProductStockOutReport from './reports/ProductStockOutReport';

const ProductStockOut = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [stockOutData, setStockOutData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const toggleProductStockOutCreateModal = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const toggleProductStockOutReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    useEffect(() => {
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

        fetchStockOutData();
    }, []);

    if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStockOuts = stockOutData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(stockOutData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 min-h-screen mt-20">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Product Stock Out</h1>
                <div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mr-4"
                        onClick={toggleProductStockOutCreateModal}
                    >
                        Add New Stock Out
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                        onClick={toggleProductStockOutReportModal}
                    >
                        Generate Report
                    </button>
                </div>
                <ProductStockOutCreate isOpen={isCreateModalOpen} onClose={toggleProductStockOutCreateModal} />
                <ProductStockOutReport isOpen={isReportModalOpen} onClose={toggleProductStockOutReportModal} />
            </div>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock OUT ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L P S</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStockOuts.map((item) => (
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
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductStockOut;
