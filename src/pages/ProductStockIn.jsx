import React, { useEffect, useState } from 'react';
import { useProductStockIn } from '../hooks';
import ProductStockInCreate from './ProductStockIn/ProductStockInCreate';
import ProductStockInReport from './reports/ProductStockInReport';

const ProductStockIn = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const { productStockIns, loading, error, fetchProductStockIns } = useProductStockIn();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProductStockIns();
    }, [fetchProductStockIns]);

    const toggleProductStockInCreateModal = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const toggleProductStockInReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStockIns = productStockIns.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(productStockIns.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 mt-20">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats section */}
                {/* (Your stats section remains unchanged) */}
            </div>

            <div className="flex mb-4 space-x-2">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleProductStockInCreateModal}>
                    Product Stock In
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={toggleProductStockInReportModal}>
                    Generate Report
                </button>
                <ProductStockInCreate isOpen={isCreateModalOpen} onClose={toggleProductStockInCreateModal} />
                <ProductStockInReport isOpen={isReportModalOpen} onClose={toggleProductStockInReportModal} />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-lg border-zinc-200">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-600">
                            <th className="px-2 py-3 border-b sm:px-6">Check</th>
                            <th className="px-2 py-3 border-b sm:px-6">Stock IN ID</th>
                            <th className="px-2 py-3 border-b sm:px-6">Finished Product</th>
                            <th className="px-2 py-3 border-b sm:px-6">Package Type</th>
                            <th className="px-2 py-3 border-b sm:px-6">Quantity</th>
                            <th className="px-2 py-3 border-b sm:px-6">Comment</th>
                            <th className="px-2 py-3 border-b sm:px-6">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStockIns.map((stockIn) => (
                            <tr key={stockIn.id} className="transition duration-200 ease-in-out hover:bg-gray-50">
                                <td className="px-2 py-4 border-b sm:px-6"><input type="checkbox" /></td>
                                <td className="px-2 py-4 border-b sm:px-6">Prod-{stockIn.id}</td>
                                <td className="px-2 py-4 border-b sm:px-6">{stockIn.item_name}</td>
                                <td className="px-2 py-4 border-b sm:px-6">{stockIn.package_type}</td>
                                <td className="px-2 py-4 border-b sm:px-6">{stockIn.quantity}</td>
                                <td className="px-2 py-4 border-b sm:px-6">{stockIn.comment}</td>
                                <td className="px-2 py-4 border-b sm:px-6">{new Date(stockIn.created_at).toLocaleDateString()}</td>
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

export default ProductStockIn;
