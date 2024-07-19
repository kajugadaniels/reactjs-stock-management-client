import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AddItemToSupplier = ({ isOpen, onClose, supplier }) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch available items
        const fetchItems = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
                const data = await response.json();
                console.log('Fetched items:', data); // Log fetched data
                setItems(data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleAddItem = async () => {
        if (!selectedItem) {
            Swal.fire('Error', 'Please select an item.', 'error');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supplier_id: supplier.id,
                    item_id: selectedItem,
                }),
            });

            if (response.ok) {
                Swal.fire('Success', 'Item added to supplier successfully.', 'success');
                onClose();
            } else {
                Swal.fire('Error', 'Failed to add item to supplier.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <h2 className="mb-4 text-xl font-semibold">Add Item to {supplier.name}</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600">Supplier</label>
                    <input
                        type="text"
                        value={supplier.name}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600">Item</label>
                    {loading ? (
                        <div>Loading items...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <select
                            value={selectedItem}
                            onChange={(e) => setSelectedItem(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md"
                        >
                            <option value="">Select an item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {`${item.name} - Category: ${item.category_name}, Type: ${item.type_name}`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <button
                    onClick={handleAddItem}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Add Item
                </button>
            </div>
        </div>
    );
};

export default AddItemToSupplier;
