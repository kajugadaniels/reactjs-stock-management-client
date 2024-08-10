import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SuppliersEdit = ({ isOpen, onClose, supplier, onSupplierUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contact: supplier.contact,
                address: supplier.address,
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/suppliers/${supplier.id}`, formData);
            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Supplier updated successfully!',
                }).then(() => {
                    onClose();
                    onSupplierUpdated();
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update supplier',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-semibold">Edit Supplier</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="contact">Contact</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            type="text"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" onClick={onClose}>Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2]" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuppliersEdit;