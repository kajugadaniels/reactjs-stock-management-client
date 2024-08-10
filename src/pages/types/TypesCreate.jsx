import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TypesCreate = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire('Error', 'Failed to fetch categories', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/types`, formData);
            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Type created successfully!',
                }).then(() => {
                    onClose();
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create type',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Add a Type</h2>
                <form onSubmit={handleSubmit}>
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
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Type Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            placeholder="Enter type name"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TypesCreate;