import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PackagingCreate = ({ isOpen, onClose, finishedProduct }) => {
    const [availablePackages, setAvailablePackages] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [remainingQty, setRemainingQty] = useState(finishedProduct.item_qty);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (finishedProduct) {
            setRemainingQty(finishedProduct.item_qty);
        }
    }, [finishedProduct]);

    useEffect(() => {
        const fetchAvailablePackages = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/package-stock-outs`);
                if (!response.ok) {
                    throw new Error('Failed to fetch available packages');
                }
                const data = await response.json();
                setAvailablePackages(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailablePackages();
    }, []);

    const handlePackageChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index][name] = value;
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
    };

    const handleCapacityChange = (e, index) => {
        const { value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index].capacity = value;
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
    };

    const handleQuantityChange = (e, index) => {
        const { value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index].quantity = parseInt(value, 10);
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
    };

    const calculateRemainingQty = (packages) => {
        const totalQty = packages.reduce((sum, pkg) => sum + (pkg.capacity * pkg.quantity), 0);
        setRemainingQty(finishedProduct.item_qty - totalQty);
    };

    const addPackageField = () => {
        setSelectedPackages([...selectedPackages, { package_id: '', capacity: '', quantity: 0 }]);
    };

    const removePackageField = (index) => {
        const updatedPackages = selectedPackages.filter((_, i) => i !== index);
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (remainingQty < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Total packaging quantity exceeds available item quantity!',
            });
            return;
        }

        // Submit the selected packages
        console.log('Selected Packages:', selectedPackages);

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Packages selected successfully!',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Select Packages</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {selectedPackages.map((pkg, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4">
                                <select
                                    name="package_id"
                                    value={pkg.package_id}
                                    onChange={(e) => handlePackageChange(e, index)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                >
                                    <option value="">Select Package</option>
                                    {availablePackages.map((process) =>
                                        process.unmergedItems.map((item) => (
                                            <option key={item.item_id} value={item.item_id}>
                                                {item.item_name} ({item.capacity}{item.unit}) - Qty: {item.quantity}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <select
                                    name="capacity"
                                    value={pkg.capacity}
                                    onChange={(e) => handleCapacityChange(e, index)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                >
                                    <option value="">Select Capacity</option>
                                    {availablePackages
                                        .flatMap(process => process.unmergedItems)
                                        .filter(availablePackage => availablePackage.item_id === pkg.package_id)
                                        .map(availablePackage => (
                                            <option key={`${availablePackage.item_id}-${availablePackage.capacity}`} value={availablePackage.capacity}>
                                                {availablePackage.capacity} {availablePackage.unit}
                                            </option>
                                        ))}
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={pkg.quantity}
                                    onChange={(e) => handleQuantityChange(e, index)}
                                    placeholder="Quantity"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removePackageField(index)}
                                    className="px-4 py-2 text-white bg-red-500 rounded-md"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button type="button" onClick={addPackageField} className="px-4 py-2 mt-4 text-white bg-[#00BDD6] rounded-md">
                            Add Package
                        </button>

                        <div className="mt-4">
                            <p className="text-gray-700">Remaining Quantity: {remainingQty} KG</p>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button type="button" className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100" onClick={onClose}>Cancel</button>
                            <button type="submit" className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]">
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PackagingCreate;
