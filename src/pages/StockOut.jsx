import React from 'react';
import { useStockOut } from '../hooks';

const StockOut = () => {
    const { stockOuts, loading, error } = useStockOut();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Stock Out ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Request ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Requester Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Request From</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Items</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Quantity</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Date</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stockOuts.length > 0 ? (
                            stockOuts.map((stockOut) => (
                                <tr key={stockOut.id} className="transition duration-200 ease-in-out bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-300">{stockOut.request_id}</td>
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
                                <td colSpan="8" className="px-6 py-4 text-sm text-center text-gray-600 border-b border-gray-300">No stock outs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockOut;