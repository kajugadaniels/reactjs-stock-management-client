import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useFinishedProducts } from '../../hooks';

const FinishedCreate = ({ isOpen, onClose, stockOutId }) => {
    const [itemQty, setItemQty] = useState('');
    const [brandQty, setBrandQty] = useState('');
    const [dechetQty, setDechetQty] = useState('');
    const [comment, setComment] = useState('');
    const { addFinishedProduct, loading, error } = useFinishedProducts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addFinishedProduct({
                stock_out_id: stockOutId, // Use the passed stock_out_id
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

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to add finished product. Please try again.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md p-10 mx-auto bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold text-zinc-800">Add Finished Product</h2>
                <p className="mb-4 text-zinc-600">Record All Finished Product Here</p>
                <form className='w-96' onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Item Quantity</label>
                        <input 
                            type="number" 
                            placeholder="Input item quantity" 
                            value={itemQty}
                            onChange={(e) => setItemQty(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Brand Quantity</label>
                        <input 
                            type="number" 
                            placeholder="Input brand quantity" 
                            value={brandQty}
                            onChange={(e) => setBrandQty(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Dechet Quantity</label>
                        <input 
                            type="number" 
                            placeholder="Input dechet quantity" 
                            value={dechetQty}
                            onChange={(e) => setDechetQty(e.target.value)}
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
                            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
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
