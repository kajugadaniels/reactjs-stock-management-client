import React, { useState } from 'react';
import { useFinishedProducts } from '../hooks';
import PackagingCreate from './Process/PackagingCreate';
import FinishedProductReport from './reports/FinishedProductReport';

const FinishedProduct = () => {
    const { finishedProducts, loading, error } = useFinishedProducts();
    const [isPackagingModalOpen, setIsPackagingModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedFinishedProduct, setSelectedFinishedProduct] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const togglePackagingCreateModal = (finishedProduct) => {
        setSelectedFinishedProduct(finishedProduct);
        setIsPackagingModalOpen(!isPackagingModalOpen);
    };

    const toggleReportModal = () => {
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
    const currentFinishedProducts = finishedProducts.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(finishedProducts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Finished Products</h1>
            <div className="mb-4">
                <button
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={toggleReportModal}
                >
                    Generate Report
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">Check</th>
                            <th className="px-6 py-3 text-left text-gray-700">Item Name</th>
                            <th className="px-6 py-3 text-left text-gray-700">Stockout Item</th>
                            <th className="px-6 py-3 text-left text-gray-700">Item Quantity</th>
                            <th className="px-6 py-3 text-left text-gray-700">Brand Quantity</th>
                            <th className="px-6 py-3 text-left text-gray-700">Dechet Quantity</th>
                            <th className="px-6 py-3 text-left text-gray-700">Comment</th>
                            <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentFinishedProducts.length > 0 ? (
                            currentFinishedProducts.map((product) => (
                                <tr key={product.id} className="transition duration-200 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 transition duration-150 ease-in-out form-checkbox" />
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{product.stock_out.request.items.map(item => item.item.name).join(', ')}</td>
                                    <td className="px-6 py-4 text-gray-700">{product.stock_out.request.request_for.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{product.item_qty} KG</td>
                                    <td className="px-6 py-4 text-gray-700">{product.brand_qty} KG</td>
                                    <td className="px-6 py-4 text-gray-700">{product.dechet_qty} KG</td>
                                    <td className="px-6 py-4 text-gray-700">{product.comment}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        {product.item_qty > 0 && (
                                            <button
                                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                onClick={() => togglePackagingCreateModal(product)}
                                            >
                                                Packaging
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-sm text-center text-gray-600 border-b border-gray-300">No finished products found.</td>
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
