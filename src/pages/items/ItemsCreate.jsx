import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useItems } from '../../hooks';

const ItemsCreate = ({ isOpen, onClose }) => {
    const { formData, loading, handleChange, addItem, fetchTypes, categories, types } = useItems();
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (formData.category_id) {
            fetchTypes(formData.category_id);
        }
    }, [formData.category_id]);

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
                    onClose();
                    window.location.reload();
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
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground w-[700px]">
                <h2 className="mb-4 text-2xl font-semibold">Add an Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#424955]">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] p-2 w-full border border-input rounded bg-input text-foreground"
                            placeholder="Enter item name"
                            required
                        />
                    </div>
                    <div className="mb-4">
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
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type_id" className="block text-sm font-medium mb-1 text-[#424955]">Item Type</label>
                        <select
                            id="type_id"
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            disabled={!formData.category_id}
                        >
                            <option value="">Select type</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="capacity" className="block text-sm font-medium mb-1 text-[#424955]">Capacity</label>
                        <select
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                        >
                            <option value="">Select capacity</option>
                            <option value="5">5 kg</option>
                            <option value="10">10 kg</option>
                            <option value="25">25 kg</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="unit" className="block text-sm font-medium mb-1 text-[#424955]">Unit</label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                        >
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <div className='bg-[#00BDD6] p-2 text-white rounded-xl'>{loading ? 'Creating...' : 'Create Item'}</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsCreate;
