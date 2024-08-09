import React, { useState } from 'react';
import { useStockOut } from '../hooks';
import StockOutReport from './reports/StockOutReport';

const StockOut = () => {
    const { stockOuts, loading, error } = useStockOut();
    const [currentPage, setCurrentPage] = useState(1);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const itemsPerPage = 10;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStockOuts = stockOuts.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(stockOuts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 mt-20">
            <div className="mb-4">
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate Report
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">No</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Requester Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Request From</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Items</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Quantity</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Date</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentStockOuts.length > 0 ? (
                            currentStockOuts.map((stockOut, index) => (
                                <tr key={stockOut.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.request.requester_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.request.request_from}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">
                                        {stockOut.request.items.map(item => (
                                            <div key={item.id}>
                                                {item.item.name} - {item.pivot.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-sm text-center text-gray-600 border-b border-gray-300">No stock outs found.</td>
                            </tr>
                        )}
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

            <StockOutReport
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
};

export default StockOut;