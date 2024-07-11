import React, { useEffect, useState } from 'react';

const SupplierItems = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (supplier) {
            fetch(`${import.meta.env.VITE_API_URL}/items/supplier/${supplier.id}`)
                .then((response) => response.json())
                .then((data) => {
                    setItems(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [supplier]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                <button onClick={onClose} className="text-red-500 hover:underline mb-4">
                    Close
                </button>
                <h2 className="text-xl font-semibold mb-4">Items for {supplier.name}</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : items.length === 0 ? (
                    <div>No items yet.</div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-6 py-2 text-left">Item ID</th>
                                <th className="px-6 py-2 text-left">Name</th>
                                <th className="px-6 py-2 text-left">Description</th>
                                <th className="px-6 py-2 text-left">Price</th>
                                <th className="px-6 py-2 text-left">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-2">{item.id}</td>
                                    <td className="px-6 py-2">{item.name}</td>
                                    <td className="px-6 py-2">{item.description}</td>
                                    <td className="px-6 py-2">{item.price}</td>
                                    <td className="px-6 py-2">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SupplierItems;
