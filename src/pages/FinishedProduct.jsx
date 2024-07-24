import React, { useState } from 'react';
import { useFinishedProducts } from '../hooks';
import PackegingCreate from './Process/PackegingCreate';

const FinishedProduct = () => {
    const { finishedProducts, loading, error } = useFinishedProducts();
    const [isPackegingModalOpen, setIsPackegingModalOpen] = useState(false);
    const [selectedFinishedProductId, setSelectedFinishedProductId] = useState(null);

    const togglePackegingCreateModal = (finishedProductId) => {
        setSelectedFinishedProductId(finishedProductId);
        setIsPackegingModalOpen(!isPackegingModalOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Finished Products</h1>
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
                        {finishedProducts.map((product) => (
                            <tr key={product.id} className="transition duration-200 ease-in-out hover:bg-gray-100">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 transition duration-150 ease-in-out form-checkbox" />
                                </td>
                                <td className="px-6 py-4 text-gray-700">{product.stock_out.request.item.item.name}</td>
                                <td className="px-6 py-4 text-gray-700">{product.stock_out.request.request_for.name}</td>
                                <td className="px-6 py-4 text-gray-700">{product.item_qty} KG</td>
                                <td className="px-6 py-4 text-gray-700">{product.brand_qty} KG</td>
                                <td className="px-6 py-4 text-gray-700">{product.dechet_qty} KG</td>
                                <td className="px-6 py-4 text-gray-700">{product.comment}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        onClick={() => togglePackegingCreateModal(product.id)}
                                    >
                                        Packaging
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PackegingCreate isOpen={isPackegingModalOpen} onClose={togglePackegingCreateModal} finishedProductId={selectedFinishedProductId} />
        </div>
    );
};

export default FinishedProduct;