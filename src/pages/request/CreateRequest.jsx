import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRequestForm } from '../../hooks';

const CreateRequest = ({ isOpen, onClose, fetchRequests }) => {
    const { formData, handleChange, addRequest, loading } = useRequestForm();
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
            await addRequest();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request created successfully!',
            });
            onClose();
            fetchRequests(); 
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create request',
            });
            console.error('Error creating request:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Request Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-14'>
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="item_id">Item</label>
                            <select
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                                id="item_id"
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select an item</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact_id">Contact</label>
                            <input
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                                type="text"
                                id="contact_id"
                                name="contact_id"
                                placeholder="Input text"
                                value={formData.contact_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="requester">Requester</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="requester"
                            name="requester"
                            placeholder="Input text"
                            value={formData.requester}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_from">Request From</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="request_from"
                            name="request_from"
                            placeholder="Input text"
                            value={formData.request_from}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="status">Status</label>
                        <select
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_for">Request For</label>
                        <select
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                            id="request_for"
                            name="request_for"
                            value={formData.request_for}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Request For</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="qty">Quantity</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="number"
                            id="qty"
                            name="qty"
                            placeholder="Enter quantity"
                            value={formData.qty}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="note">Note</label>
                        <textarea
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            id="note"
                            name="note"
                            placeholder="Input text"
                            value={formData.note}
                            onChange={handleChange}
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
}

export default CreateRequest;
