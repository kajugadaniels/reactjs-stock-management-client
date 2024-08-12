import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PackageStockForm = ({ isOpen, onClose, selectedItem }) => {
    const [formData, setFormData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedItem && selectedItem.mergedItems) {
            setFormData(selectedItem.mergedItems.map(item => ({
                ...item,
                stock_out_id: selectedItem.id,
                finishedQuantity: item.quantity
            })));
        }
    }, [selectedItem]);

    const handleQuantityChange = (index, value) => {
        const newFormData = [...formData];
        newFormData[index].finishedQuantity = parseInt(value);
        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            for (const item of formData) {
                await axios.post(`${import.meta.env.VITE_API_URL}/package-stocks`, {
                    stock_out_id: item.stock_out_id,
                    item_name: item.item_name,
                    category: item.category,
                    type: item.type,
                    capacity: item.capacity,
                    unit: item.unit,
                    quantity: item.finishedQuantity
                });
            }
            Swal.fire('Success', 'Package stocks added successfully', 'success');
            onClose();
        } catch (error) {
            Swal.fire('Error', 'Failed to add package stocks', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Finish Package Stock Out</h2>
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="w-full mb-4 text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">Item Name</th>
                                    <th className="p-2 border">Category</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Capacity</th>
                                    <th className="p-2 border">Unit</th>
                                    <th className="p-2 border">Original Quantity</th>
                                    <th className="p-2 border">Finished Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="p-2 border">{item.item_name}</td>
                                        <td className="p-2 border">{item.category}</td>
                                        <td className="p-2 border">{item.type}</td>
                                        <td className="p-2 border">{item.capacity}</td>
                                        <td className="p-2 border">{item.unit}</td>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">
                                            <input
                                                type="number"
                                                value={item.finishedQuantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                                min="0"
                                                max={item.quantity}
                                                disabled={isSubmitting}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isSubmitting
                                    ? 'bg-[#00BDD6] cursor-not-allowed'
                                    : 'bg-[#00BDD6] hover:bg-[#00BDD6]'
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackageStockForm;