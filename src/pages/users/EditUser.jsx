import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditUser = ({ isOpen, onClose, user, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let validationErrors = {};
        if (!formData.name.trim()) validationErrors.name = 'Name is required';
        if (!formData.email.trim()) validationErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Email is invalid';
        if (!formData.role) validationErrors.role = 'Role is required';
        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}`, formData);
            Swal.fire({
                title: 'Success',
                text: 'User updated successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                onClose();
                onUserUpdated();
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire('Error', 'Failed to update user', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Role</option>
                            <option value="Manager">Manager</option>
                            <option value="Storekeeper">Storekeeper</option>
                            <option value="Production">Production</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;