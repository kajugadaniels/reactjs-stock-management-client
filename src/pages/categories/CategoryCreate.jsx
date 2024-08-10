import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CategoryCreate = ({ isOpen, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/categories`, { name: categoryName });
            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Category created successfully!',
                }).then(() => {
                    onClose();
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create category',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            placeholder="Enter category name"
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
                            {loading ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryCreate;