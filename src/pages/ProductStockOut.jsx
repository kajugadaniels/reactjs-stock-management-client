import React, { useEffect, useState } from 'react';
import ProductStockOutCreate from './ProductStockOut/ProductStockOutCreate';

const ProductStockOut = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockOutData, setStockOutData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleProductStockOutCreateModal = () => {
        setIsModalOpen(!isModalOpen);
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Product Stock Out</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={toggleProductStockOutCreateModal}
                >
                    Add New Stock Out
                </button>
                <ProductStockOutCreate isOpen={isModalOpen} onClose={toggleProductStockOutCreateModal} />
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
                        {stockOutData.map((item) => (
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
        </div>
    );
};

export default ProductStockOut;
