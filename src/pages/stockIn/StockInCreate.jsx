import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useStockIn } from '../../hooks';

const StockInCreate = ({ isOpen, onClose }) => {
    const { formData, loading, handleChange, addStockIn } = useStockIn();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addStockIn();
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Stock in record created successfully!',
                }).then(() => {
                    onClose();
                    window.location.reload();
                });
            } else {
                throw new Error('Failed to create stock in record');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create stock in record',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground  w-[700px]">
                <h2 className="mb-4 text-2xl font-semibold">Add Stock In Record</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="item_id" className="block text-sm font-medium mb-1 text-[#424955]">Item</label>
                        <select
                            id="item_id"
                            name="item_id"
                            value={formData.item_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium mb-1 text-[#424955]">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="registered_by" className="block text-sm font-medium mb-1 text-[#424955]">Registered By</label>
                        <input
                            type="text"
                            id="registered_by"
                            name="registered_by"
                            value={formData.registered_by}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="plaque" className="block text-sm font-medium mb-1 text-[#424955]">Plaque</label>
                        <input
                            type="text"
                            id="plaque"
                            name="plaque"
                            value={formData.plaque}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter plaque"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="batch" className="block text-sm font-medium mb-1 text-[#424955]">Batch</label>
                        <input
                            type="text"
                            id="batch"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter batch"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium mb-1 text-[#424955]">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select status</option>
                            <option value="Complete">Complete</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium mb-1 text-[#424955]">Comment</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter comment"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                        <div className='bg-[#00BDD6] p-2 text-white rounded-xl'> {loading ? 'Creating...' : 'Create Stock In'}</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockInCreate;