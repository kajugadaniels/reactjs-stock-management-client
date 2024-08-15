import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TypesCreate = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchTypes();
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

    const fetchTypes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/types`);
            setTypes(response.data);
        } catch (error) {
            console.error('Error fetching types:', error);
            Swal.fire('Error', 'Failed to fetch types', 'error');
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
            if (editingType) {
                await axios.put(`${import.meta.env.VITE_API_URL}/types/${editingType.id}`, formData);
                Swal.fire('Success', 'Type updated successfully!', 'success');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/types`, formData);
                Swal.fire('Success', 'Type created successfully!', 'success');
            }
            fetchTypes();
            setFormData({ name: '', category_id: '' });
            setEditingType(null);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to save type', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (type) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            category_id: type.category_id
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/types/${id}`);
                Swal.fire('Deleted!', 'The type has been deleted.', 'success');
                fetchTypes();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete the type', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400
               sm:px-4 sm:py-2 sm:text-sm
               md:px-5 md:py-2.5 md:text-base"
                    >
                        <span className="hidden sm:inline">Edit</span> 
                        <FaEdit className="inline sm:hidden text-base" /> 
                    </button>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400
               sm:px-4 sm:py-2 sm:text-sm
               md:px-5 md:py-2.5 md:text-base"
                    >
                        <span className="hidden sm:inline">Delete</span>
                        <FaTrash className="inline sm:hidden text-base" /> 
                    </button>

                </>
            ),
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 sm:p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-800">
                    {editingType ? 'Edit Type' : 'Add a Type'}
                </h2>
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
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
                        <div>
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
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingType(null);
                                setFormData({ name: '', category_id: '' });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400
               md:px-6 md:py-3 md:text-base
               lg:px-8 lg:py-4 lg:text-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editingType ? 'Update Type' : 'Create Type')}
                        </button>
                    </div>
                </form>

                <DataTable
                    columns={columns}
                    data={types}
                    pagination
                    paginationPerPage={5}
                    highlightOnHover
                    striped
                    responsive
                />

                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TypesCreate;
