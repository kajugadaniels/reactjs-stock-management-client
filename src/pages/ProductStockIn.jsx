import React, { useState, useEffect } from 'react';
import ProductStockInCreate from './ProductStockIn/ProductStockInCreate';
import { useProductStockIn } from '../hooks';

const ProductStockIn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { productStockIns, loading, error, fetchProductStockIns } = useProductStockIn();

    useEffect(() => {
        fetchProductStockIns();
    }, []);

    const toggleProductStockInCreateModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="p-4 sm:p-6 rounded-lg shadow bg-card text-card-foreground">
                    <div className="text-muted-foreground">Total Packaging In Stock</div>
                    <div className="mt-2 sm:mt-5 text-xl sm:text-2xl text-primary">600</div>
                </div>
                <div className="p-4 sm:p-6 rounded-lg shadow bg-card text-card-foreground">
                    <div className="text-muted-foreground">Total 5 Kg</div>
                    <div className="mt-2 sm:mt-5 text-xl sm:text-2xl text-primary">500</div>
                </div>
                <div className="p-4 sm:p-6 bg-gray-300 rounded-lg shadow text-card-foreground">
                    <div className="text-muted-foreground">Total 10 kg</div>
                    <div className="mt-2 sm:mt-5 text-xl sm:text-2xl text-primary">400</div>
                </div>
                <div className="p-4 sm:p-6 bg-[#f9d8c0] text-card-foreground rounded-lg shadow">
                    <div className="text-muted-foreground">Total 25 kg</div>
                    <div className="mt-2 sm:mt-5 text-xl sm:text-2xl text-primary">250</div>
                </div>
            </div>

            <div className="flex mb-4 space-x-2">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleProductStockInCreateModal}>
                    Product Stock In
                </button>
                <ProductStockInCreate isOpen={isModalOpen} onClose={toggleProductStockInCreateModal} />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-lg border-zinc-200">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-600">
                            <th className="px-2 sm:px-6 py-3 border-b">Check</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Stock IN ID</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Finished Product</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Package Type</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Quantity</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Comment</th>
                            <th className="px-2 sm:px-6 py-3 border-b">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productStockIns.map((stockIn) => (
                            <tr key={stockIn.id} className="transition duration-200 ease-in-out hover:bg-gray-50">
                                <td className="px-2 sm:px-6 py-4 border-b"><input type="checkbox" /></td>
                                <td className="px-2 sm:px-6 py-4 border-b">{stockIn.id}</td>
                                <td className="px-2 sm:px-6 py-4 border-b">{stockIn.item_name}</td>
                                <td className="px-2 sm:px-6 py-4 border-b">{stockIn.package_type} Kg</td>
                                <td className="px-2 sm:px-6 py-4 border-b">{stockIn.quantity}</td>
                                <td className="px-2 sm:px-6 py-4 border-b">{stockIn.comment}</td>
                                <td className="px-2 sm:px-6 py-4 border-b">{new Date(stockIn.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductStockIn;
