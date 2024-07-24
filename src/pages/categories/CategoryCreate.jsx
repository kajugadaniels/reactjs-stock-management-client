import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useItems } from '../../hooks';

const CategoryCreate = ({ isOpen, onClose }) => {
    const { addCategory, loading } = useItems();
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCategory(categoryName);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category created successfully!',
            }).then(() => {
                onClose();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create category',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground w-[700px]">
                <h2 className="mb-4 text-2xl font-semibold">Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#424955]">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            className="bg-[#f3f4f6] p-2 w-full border border-input rounded bg-input text-foreground"
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] p-2 text-white rounded-xl" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Category' }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryCreate;
