import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const FinishedCreate = ({ isOpen, onClose, process }) => {
    const [itemQty, setItemQty] = useState('');
    const [brandQty, setBrandQty] = useState('');
    const [dechetQty, setDechetQty] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setItemQty('');
            setBrandQty('');
            setDechetQty('');
            setComment('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalInput = parseInt(itemQty) + parseInt(brandQty) + parseInt(dechetQty);
        const totalQty = process.request.items.reduce((total, item) => total + item.pivot.quantity, 0);

        if (totalInput > totalQty) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Total quantity should not exceed ${totalQty}. Please enter valid data.`,
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/finished-products`, {
                stock_out_id: process.id,
                item_qty: itemQty,
                brand_qty: brandQty,
                dechet_qty: dechetQty,
                comment: comment,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Finished product added successfully!',
            });
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error creating finished product:', error);
            setError('Failed to add finished product. Please try again.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add finished product. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (e, setState) => {
        const value = e.target.value;
        const totalInput = parseInt(itemQty) + parseInt(brandQty) + parseInt(dechetQty);
        const totalQty = process.request.items.reduce((total, item) => total + item.pivot.quantity, 0);

        if (totalInput + parseInt(value) > totalQty) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Total quantity should not exceed ${totalQty}. Please enter valid data.`,
            });
            return;
        }

        setState(value);
    };

    if (!isOpen) return null;

    const totalQty = process.request.items.reduce((total, item) => total + item.pivot.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md p-10 mx-auto bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold text-zinc-800">Add Finished Product</h2>
                <p className="mb-4 text-zinc-600">Record All Finished Product Here</p>
                {error && <p className="text-red-500">{error}</p>}
                <form className='w-96' onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Total Quantity: {totalQty}</label>
                        <label className="block mb-2 font-medium text-zinc-700">Item Quantity</label>
                        <input
                            type="number"
                            placeholder="Input item quantity"
                            value={itemQty}
                            onChange={(e) => handleQuantityChange(e, setItemQty)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Brand Quantity</label>
                        <input
                            type="number"
                            placeholder="Input brand quantity"
                            value={brandQty}
                            onChange={(e) => handleQuantityChange(e, setBrandQty)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Dechet Quantity</label>
                        <input
                            type="number"
                            placeholder="Input dechet quantity"
                            value={dechetQty}
                            onChange={(e) => handleQuantityChange(e, setDechetQty)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Comment</label>
                        <textarea
                            placeholder="Input comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-zinc-600" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2]"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinishedCreate;