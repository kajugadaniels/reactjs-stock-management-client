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
                const response = await fetch('http://localhost:8000/api/product-stock-out');
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 space-y-4">
            <div className="flex space-x-2">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleProductStockOutCreateModal}>
                    Add New Stock Out
                </button>
                <ProductStockOutCreate isOpen={isModalOpen} onClose={toggleProductStockOutCreateModal} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="px-4 py-2 border text-gray-500">Stock OUT ID</th>
                            <th className="px-4 py-2 border text-gray-500">Location</th>
                            <th className="px-4 py-2 border text-gray-500">Employee</th>
                            <th className="px-4 py-2 border text-gray-500">Item Name</th>
                            <th className="px-4 py-2 border text-gray-500">Batch</th>
                            <th className="px-4 py-2 border text-gray-500">Client Name</th>
                            <th className="px-4 py-2 border text-gray-500">Quantity</th>
                            <th className="px-4 py-2 border text-gray-500">Plate Number</th>
                            <th className="px-4 py-2 border text-gray-500">L P S</th>
                            <th className="px-4 py-2 border text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockOutData.map((item) => (
                            <tr key={item.id}>
                                <td className="text-center">STCK_OUT-{item.id}</td>
                                <td>{item.location || 'N/A'}</td>
                                <td>{item.employee?.name || 'N/A'}</td>
                                <td>{item.product_stock_in?.item_name || 'N/A'}</td>
                                <td>{item.batch || 'N/A'}</td>
                                <td>{item.client_name || 'N/A'}</td>
                                <td>{`${item.quantity || 0} Sacks of ${item.product_stock_in?.package_type || 'N/A'}`}</td>
                                <td>{item.plate || 'N/A'}</td>
                                <td className={item.loading_payment_status ? 'text-teal-500' : 'text-red-500'}>
                                    {item.loading_payment_status ? 'Paid' : 'Not Paid'}
                                </td>
                                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductStockOut;
