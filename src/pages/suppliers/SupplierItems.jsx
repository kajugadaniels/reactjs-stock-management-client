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
                                <th className="px-10 py-5 border">Item ID</th>
                                <th className="px-10 py-5 border">Name</th>
                                <th className="px-10 py-5 border">Category</th>
                                <th className="px-10 py-5 border">Type</th>
                                <th className="px-10 py-5 border">Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-10 py-5 border">{item.id}</td>
                                    <td className="px-10 py-5 border">{item.name}</td>
                                    <td className="px-10 py-5 border">{item.category_name}</td>
                                    <td className="px-10 py-5 border">{item.type_name}</td>
                                    <td className="px-10 py-5 border">{item.capacity} {item.unit}</td>
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
