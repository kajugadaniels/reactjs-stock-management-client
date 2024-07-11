import React from 'react';
import Swal from 'sweetalert2';
import { useItemForm } from '../../hooks';

const ItemsEdit = ({ isOpen, onClose, item }) => {
    const { formData, loading, handleChange, updateItem } = useItemForm(item);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateItem(item.id);
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item updated successfully!',
                }).then(() => {
                    onClose();
                    window.location.reload();
                });
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update item',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Sub-title goes here</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="name">Name</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Item Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Category</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Item Category"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="price">Price</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Item Price"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="mr-2 px-4 py-2 text-white bg-red-500 rounded"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-[#00BDD6] rounded"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsEdit;
