import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useItems } from '../../hooks';

const ItemsEdit = ({ isOpen, onClose, item }) => {
    const { formData, setFormData, loading, handleChange, updateItem, fetchTypes, categories, types } = useItems(item);

    useEffect(() => {
        if (item.category_id) {
            fetchTypes(item.category_id);
        }
    }, [item]);

    useEffect(() => {
        if (formData.category_id && formData.category_id !== item.category_id) {
            fetchTypes(formData.category_id);
        }
    }, [formData.category_id, item.category_id]);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                category_id: item.category_id,
                type_id: item.type_id,
                capacity: item.capacity,
                unit: item.unit,
                comment: item.comment,
            });
        }
    }, [item, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateItem(item.id);
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item updated successfully!',
                }).then(() => {
                    onClose();
                    window.location.reload();
                });
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update item',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground">
                <h2 className="mb-4 text-2xl font-semibold">Edit Item</h2>
                <form onSubmit={handleSubmit} className='p-3'>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#424955]">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-96 p-3 border border-input rounded bg-input text-foreground"
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
                            className="bg-[#f3f4f6] w-full p-3 border border-input rounded bg-input text-foreground"
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
                            className="bg-[#f3f4f6] w-full p-3 border border-input rounded bg-input text-foreground"
                            required
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
                            className="bg-[#f3f4f6] w-full p-3 border border-input rounded bg-input text-foreground"
                            required
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
                            className="bg-[#f3f4f6] w-full p-3 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] p-2 text-white rounded-xl" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsEdit;
