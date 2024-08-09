import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useItems } from '../../hooks';

const TypesCreate = ({ isOpen, onClose }) => {
    const { categories, addType, fetchCategories, loading } = useItems();
    const [typeName, setTypeName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateType = async (e) => {
        e.preventDefault();
        try {
            await addType(typeName, selectedCategory);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Type created successfully!',
            }).then(() => {
                onClose();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create type',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground w-[700px]">
                <h2 className="mb-4 text-2xl font-semibold">Add a Type</h2>
                <form onSubmit={handleCreateType}>
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block text-sm font-medium mb-1 text-[#424955]">Category</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
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
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#424955]">Type Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={typeName}
                            onChange={e => setTypeName(e.target.value)}
                            className="bg-[#f3f4f6] p-2 w-full border border-input rounded bg-input text-foreground"
                            placeholder="Enter type name"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary bg-[#00BDD6] text-white rounded p-2" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TypesCreate;
