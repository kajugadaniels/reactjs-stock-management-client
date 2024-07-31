import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSupplierItem } from '../../hooks';

const AddItemToSupplier = ({ isOpen, onClose, supplier }) => {
    const { items, loading, error, isAdding, fetchAvailableItems, addItemToSupplier } = useSupplierItem();
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        fetchAvailableItems();
    }, []);

    const handleAddItem = () => {
        if (!selectedItem) {
            Swal.fire('Error', 'Please select an item.', 'error');
            return;
        }

        addItemToSupplier(supplier.id, selectedItem, onClose, () => setSelectedItem(''));
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
                                    {item.name} - {item.category_name || 'Unknown Category'} - {item.type_name || 'Unknown Type'} {item.capacity || ''}{item.unit}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <button
                    onClick={handleAddItem}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    disabled={isAdding}
                >
                    {isAdding ? 'Adding...' : 'Add Item'}
                </button>
            </div>
        </div>
    );
};

export default AddItemToSupplier;
