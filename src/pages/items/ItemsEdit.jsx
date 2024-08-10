import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ItemsEdit = ({ isOpen, onClose, item, onItemUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        type_id: '',
        capacity: '',
        unit: '',
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                category_id: item.category_id || '',
                type_id: item.type_id || '',
                capacity: item.capacity || '',
                unit: item.unit || '',
            });
            fetchCategories();
            if (item.category_id) {
                fetchTypes(item.category_id);
            }
        }
    }, [item]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire('Error', 'Failed to fetch categories', 'error');
        }
    };

    const fetchTypes = async (categoryId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/types/category/${categoryId}`);
            setTypes(response.data);
        } catch (error) {
            console.error('Error fetching types:', error);
            Swal.fire('Error', 'Failed to fetch types', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'category_id') {
            fetchTypes(value);
            setFormData(prev => ({ ...prev, type_id: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                type_id: formData.type_id || null,
                capacity: formData.capacity || null,
                unit: formData.unit || null
            };
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/items/${item.id}`, dataToSubmit);
            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item updated successfully!',
                }).then(() => {
                    onClose();
                    onItemUpdated();
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update item',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg">
                <h2 className="mb-6 text-2xl font-bold">Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type_id" className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type_id"
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                        >
                            <option value="">Select type</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="capacity" className="block mb-1 text-sm font-medium text-gray-700">Capacity</label>
                        <select
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                        >
                            <option value="">Select capacity</option>
                            <option value="5">5 kg</option>
                            <option value="10">10 kg</option>
                            <option value="25">25 kg</option>
                            <option value="50">50 kg</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="unit" className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                        >
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-2 text-gray-700 transition duration-300 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white transition duration-300 rounded-md bg-[#00BDD6] hover:bg-[#00a8c2]"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsEdit;