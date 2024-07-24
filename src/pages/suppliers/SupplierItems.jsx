import React, { useEffect, useState } from 'react';

const SupplierItems = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplier.id}`);
                const data = await response.json();
                console.log('Fetched items:', data);
                
                // Filter out items with the category "Finished"
                const filteredItems = data.data.filter(item => item.category_name !== 'Finished');
                setItems(Array.isArray(filteredItems) ? filteredItems : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
                const data = await response.json();
                console.log('Fetched categories:', data);
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchTypes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/types`);
                const data = await response.json();
                console.log('Fetched types:', data);
                setTypes(data || []);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        if (supplier) {
            fetchItems();
        }
        fetchCategories();
        fetchTypes();
    }, [supplier]);

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : '';
    };

    const getTypeName = (typeId) => {
        const type = types.find((typ) => typ.id === typeId);
        return type ? type.name : '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <h2 className="mb-4 text-xl font-semibold">Items for {supplier.name}</h2>
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
                                    <td className="px-10 py-5 border">{getCategoryName(item.category_id)}</td>
                                    <td className="px-10 py-5 border">{getTypeName(item.type_id)}</td>
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
