import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSupplierForm } from '../../hooks';

const SuppliersCreate = ({ isOpen, onClose }) => {
    const { formData, loading, handleChange, addSupplier } = useSupplierForm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addSupplier();
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Supplier created successfully!',
                }).then(() => {
                    onClose();
                    window.location.reload();
                });
            } else {
                throw new Error('Failed to create supplier');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create supplier',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Suppliers Form</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Sub-title goes here</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="name">Names</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Supplier Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact">Contact</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Supplier Contact"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="address">Address</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Supplier Address"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] text-white hover:bg-primary/80 p-2 rounded" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuppliersCreate;