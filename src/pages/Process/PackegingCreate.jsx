import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useProductStockIn } from '../../hooks';

const PackegingCreate = ({ isOpen, onClose, finishedProductId }) => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [itemQty, setItemQty] = useState('');
    const [packageType, setPackageType] = useState('');
    const [numberOfPackages, setNumberOfPackages] = useState(0);
    const [status, setStatus] = useState('');
    const [comment, setComment] = useState('');
    const { addProductStockIn, fetchFinishedProductById, loading, error } = useProductStockIn();

    useEffect(() => {
        if (isOpen && finishedProductId) {
            fetchFinishedProductDetails();
        }
    }, [isOpen, finishedProductId]);

    const fetchFinishedProductDetails = async () => {
        try {
            const data = await fetchFinishedProductById(finishedProductId);
            setItemName(data.stock_out.request.item.item.name);
            setItemQty(data.item_qty);
            setQuantity(data.item_qty); // Ensure quantity is set for further calculations
        } catch (error) {
            console.error('Error fetching finished product details:', error);
        }
    };

    useEffect(() => {
        if (packageType && quantity) {
            const pkgQty = parseInt(quantity);
            const pkgType = parseInt(packageType);
            setNumberOfPackages(Math.floor(pkgQty / pkgType));
        }
    }, [packageType, quantity]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProductStockIn({
                finished_product_id: finishedProductId,
                item_name: itemName,
                item_qty: itemQty,
                package_type: packageType,
                quantity: numberOfPackages,
                status,
                comment,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product stock in added successfully!',
            });

            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error creating product stock in:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add product stock in. Please try again.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md p-10 mx-auto bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold text-zinc-800">Packaging</h2>
                <p className="mb-4 text-zinc-600">Packaging Process Record</p>

                <form className="w-96" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Finished Product ID</label>
                        <input
                            type="text"
                            placeholder="Input Finished Product ID"
                            value={finishedProductId}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Item Name</label>
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={itemName}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Quantity</label>
                        <input
                            type="text"
                            placeholder="Input quantity"
                            value={itemQty}
                            onChange={(e) => setItemQty(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Package Type</label>
                        <select
                            value={packageType}
                            onChange={(e) => setPackageType(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Select package type</option>
                            <option value="5">5kg</option>
                            <option value="10">10kg</option>
                            <option value="25">25kg</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Number of Packages</label>
                        <input
                            type="text"
                            placeholder="Number of packages"
                            value={numberOfPackages}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-zinc-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Select status</option>
                            <option value="On">On</option>
                            <option value="Off">Off</option>
                        </select>
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
                        <button type="submit" className="bg-[#00BDD6] text-white px-4 py-2 rounded-md hover:bg-green-600">
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackegingCreate;
