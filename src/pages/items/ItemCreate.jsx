import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useItemForm } from '../../hooks';

const ItemCreate = ({ isOpen, onClose }) => {
    const { formData, loading, handleChange, addItem, categories, types } = useItemForm();
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/suppliers');
                if (!response.ok) {
                    throw new Error('Failed to fetch suppliers');
                }
                const data = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addItem();
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item created successfully!',
                }).then(() => {
                    onClose(); // Close modal on success
                    window.location.reload(); // Reload page after closing modal
                });
            } else {
                throw new Error('Failed to create item');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create item',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground">
                <h2 className="mb-4 text-2xl font-semibold">Add an Item</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">All items will be recorded using this form</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#424955]">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter item name"
                            required
                        />
                    </div>
                    <div className="flex mb-4 space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="category_id" className="block text-sm font-medium mb-1 text-[#424955]">Category</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} {/* Display category name */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="type_id" className="block text-sm font-medium mb-1 text-[#424955]">Item Type</label>
                            <select
                                id="type_id"
                                name="type_id"
                                value={formData.type_id}
                                onChange={handleChange}
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                                required
                            >
                                <option value="">Select type</option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} {/* Display type name */}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex mb-4 space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="capacity" className="block text-sm font-medium mb-1 text-[#424955]">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                                placeholder="Enter capacity"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="unit" className="block text-sm font-medium mb-1 text-[#424955]">Unit</label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                                placeholder="Enter unit"
                                // required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="supplier_id" className="block text-sm font-medium mb-1 text-[#424955]">Supplier</label>
                        <select
                            id="supplier_id"
                            name="supplier_id"
                            value={formData.supplier_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name} {/* Display supplier name */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium mb-1 text-[#424955]">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter notes"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemCreate;
