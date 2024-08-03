import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useProcess } from '../../hooks';

const PackagingCreate = ({ isOpen, onClose, finishedProduct }) => {
    const { packageProcesses, loading, error } = useProcess();
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [remainingQty, setRemainingQty] = useState(finishedProduct.item_qty);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        if (finishedProduct) {
            setRemainingQty(finishedProduct.item_qty);
        }
    }, [finishedProduct]);

    const handlePackageChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index][name] = value;
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
        validateQuantity(updatedPackages, index);
    };

    const handleCapacityChange = (e, index) => {
        const { value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index].capacity = parseInt(value, 10);
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
        validateQuantity(updatedPackages, index);
    };

    const handleQuantityChange = (e, index) => {
        const { value } = e.target;
        const updatedPackages = [...selectedPackages];
        updatedPackages[index].quantity = parseInt(value, 10);
        setSelectedPackages(updatedPackages);
        calculateRemainingQty(updatedPackages);
        validateQuantity(updatedPackages, index);
    };

    const validateQuantity = (packages, index) => {
        const packageItem = packageProcesses.find(
            (process) => process.unmergedItems.some((item) => item.item_id === packages[index].package_id)
        );

        if (packageItem) {
            const item = packageItem.unmergedItems.find((item) => item.item_id === packages[index].package_id);
            if (packages[index].quantity > item.quantity) {
                setValidationErrors((prevErrors) => {
                    const newErrors = [...prevErrors];
                    newErrors[index] = `Quantity exceeds available amount (${item.quantity})`;
                    return newErrors;
                });
            } else {
                setValidationErrors((prevErrors) => {
                    const newErrors = [...prevErrors];
                    newErrors[index] = '';
                    return newErrors;
                });
            }
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (remainingQty < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Total packaging quantity exceeds available item quantity!',
            });
            return;
        }

        if (validationErrors.some((error) => error)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fix the errors before submitting.',
            });
            return;
        }

        try {
            const createProductStockIn = async (packageData) => {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/product-stock-ins`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(packageData),
                });

                if (!response.ok) {
                    throw new Error('Failed to create product stock in');
                }

                return response.json();
            };

            const packageCreationPromises = selectedPackages.map(pkg => {
                const packageItem = packageProcesses.find(
                    (process) => process.unmergedItems.some((item) => item.item_id === pkg.package_id)
                );
                const item = packageItem ? packageItem.unmergedItems.find((item) => item.item_id === pkg.package_id) : null;

                return createProductStockIn({
                    finished_product_id: finishedProduct.id,
                    item_name: item ? item.item_name : 'Unknown',
                    item_qty: pkg.capacity * pkg.quantity,
                    package_type: `${item ? item.item_name : 'Unknown'} ${pkg.capacity}KG`,
                    quantity: pkg.quantity,
                    status: 'False',
                    comment: ''
                });
            });

            await Promise.all(packageCreationPromises);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Packages selected and stored successfully!',
            });
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-5xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Select Packages</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {selectedPackages.map((pkg, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4">
                                    <select
                                        name="finished_product_id"
                                        value={pkg.finished_product_id}
                                        onChange={(e) => handlePackageChange(e, index)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                        required
                                    >
                                        <option value="">Select Package</option>
                                        {packageProcesses.map((process) =>
                                            process.unmergedItems.map((item) => (
                                                <option key={item.item_id} value={item.item_id}>
                                                    {item.item_name} ({item.capacity}{item.unit}) - Quantity: {item.quantity}
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
                                        <option value="5">5 KG</option>
                                        <option value="10">10 KG</option>
                                        <option value="25">25 KG</option>
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
                                    {validationErrors[index] && (
                                        <div className="col-span-4 text-red-500">{validationErrors[index]}</div>
                                    )}
                                </div>
                            ))}

                            <button type="button" onClick={addPackageField} className="px-4 py-2 mt-4 text-white bg-[#00BDD6] rounded-md">
                                Add Package
                            </button>

                            <div className="mt-4">
                                <p className="text-gray-700">Remaining Quantity: {remainingQty < 0 ? "Not Available" : `${remainingQty} KG`}</p>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100" onClick={onClose}>Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]">
                                    Save
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PackagingCreate;
