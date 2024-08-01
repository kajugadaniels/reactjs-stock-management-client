import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PackagingCreate = ({ isOpen, onClose, finishedProductId, itemQtyProduced, addPackagingRequest }) => {
    const [selectedPackagings, setSelectedPackagings] = useState([{ stock_in_id: '', quantity: '' }]);
    const [packagingOptions, setPackagingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPackagingOptions();
        }
    }, [isOpen]);

    const fetchPackagingOptions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/package-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch packaging items');
            }
            const data = await response.json();
            setPackagingOptions(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalQuantity = selectedPackagings.reduce((sum, pkg) => sum + (parseInt(pkg.quantity, 10) || 0), 0);

        if (totalQuantity > itemQtyProduced) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Total quantity exceeds available quantity (${itemQtyProduced} KG). Please enter valid data.`,
            });
            return;
        }

        try {
            const packageRequests = selectedPackagings.filter((pkg) => pkg.stock_in_id && pkg.quantity);
            await addPackagingRequest(finishedProductId, packageRequests);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Packaging request created successfully!',
            });
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create packaging request. Please try again.',
            });
        }
    };

    const handlePackagingChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPackagings = [...selectedPackagings];
        updatedPackagings[index][name] = name === 'quantity' ? parseInt(value, 10) || '' : value;
        setSelectedPackagings(updatedPackagings);
    };

    const addPackagingField = () => {
        setSelectedPackagings([...selectedPackagings, { stock_in_id: '', quantity: '' }]);
    };

    const removePackagingField = (index) => {
        const updatedPackagings = selectedPackagings.filter((_, i) => i !== index);
        setSelectedPackagings(updatedPackagings);
    };

    const calculatePackagingAdvice = () => {
        const qty5kg = Math.floor(itemQtyProduced / 5);
        const remainingAfter5kg = itemQtyProduced % 5;

        const qty10kg = Math.floor(remainingAfter5kg / 10);
        const remainingAfter10kg = remainingAfter5kg % 10;

        const qty25kg = Math.floor(remainingAfter10kg / 25);
        const remainingAfter25kg = remainingAfter10kg % 25;

        return {
            qty5kg,
            qty10kg,
            qty25kg,
            remainingAfter25kg,
        };
    };

    const packagingAdvice = calculatePackagingAdvice();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-semibold text-gray-800">Packaging Request Registration</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-6">
                    <p className="text-lg text-gray-700">
                        Based on the {itemQtyProduced} KG produced, you will need approximately:
                    </p>
                    <ul className="list-disc list-inside">
                        <li>{packagingAdvice.qty5kg} packages of 5 KG</li>
                        <li>{packagingAdvice.qty10kg} packages of 10 KG</li>
                        <li>{packagingAdvice.qty25kg} packages of 25 KG</li>
                        {packagingAdvice.remainingAfter25kg > 0 && (
                            <li>
                                {packagingAdvice.remainingAfter25kg} KG remaining which could be packed with smaller packages
                            </li>
                        )}
                    </ul>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Packagings</label>
                        {selectedPackagings.map((packaging, index) => (
                            <div key={index} className="flex mb-2 space-x-4">
                                <select
                                    name="stock_in_id"
                                    value={packaging.stock_in_id}
                                    onChange={(e) => handlePackagingChange(e, index)}
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                >
                                    <option value="">Select a packaging</option>
                                    {packagingOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} - {option.capacity} {option.unit} - {option.quantity} KG available
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={packaging.quantity}
                                    onChange={(e) => handlePackagingChange(e, index)}
                                    placeholder="Quantity"
                                    className="w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removePackagingField(index)}
                                    className="px-4 py-2 text-white bg-red-500 rounded-md"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPackagingField}
                            className="px-4 py-2 mt-4 text-white bg-[#00BDD6] rounded-md"
                        >
                            Add Packaging
                        </button>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackagingCreate;
