import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Frontend validation
        if (formData.new_password !== formData.new_password_confirmation) {
            Swal.fire({
                title: 'Error',
                text: 'New passwords do not match',
                icon: 'error',
            });
            setIsSubmitting(false);
            return;
        }

        if (formData.new_password.length < 8) {
            Swal.fire({
                title: 'Error',
                text: 'New password must be at least 8 characters long',
                icon: 'error',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/change-password`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            Swal.fire({
                title: 'Success',
                text: 'Password changed successfully',
                icon: 'success',
            });
            setFormData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Failed to change password',
                icon: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto mt-32 p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_password">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current_password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password_confirmation">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="new_password_confirmation"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;