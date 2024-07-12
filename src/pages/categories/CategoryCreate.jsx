import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const CategoryCreate = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName })
            });

            if (!response.ok) {
                throw new Error('Failed to create category');
            }

            await response.json(); // Assuming you want to do something with the response here
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category created successfully!',
            }).then(() => {
                onClose(); // Close the modal
                fetchCategories(); // Refetch categories list
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create category',
            });
        } finally {
            setLoading(false);
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
