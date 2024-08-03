import React, { useState, useEffect } from 'react';
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
        const { value } = e.target;
        const updatedPackages = [...selectedPackages];
        const selectedItem = packageProcesses.flatMap(process => process.unmergedItems).find(item => item.item_id === parseInt(value));
        
        if (selectedItem) {
            updatedPackages[index] = {
                ...updatedPackages[index],
                package_id: selectedItem.item_id,
                item_name: selectedItem.item_name,
                capacity: selectedItem.capacity,
                unit: selectedItem.unit,
                available_quantity: selectedItem.quantity
            };
            setSelectedPackages(updatedPackages);
            calculateRemainingQty(updatedPackages);
            validateQuantity(updatedPackages, index);
        }
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
        const pkg = packages[index];
        if (pkg.quantity > pkg.available_quantity) {
            setValidationErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = `Quantity exceeds available amount (${pkg.available_quantity})`;
                return newErrors;
            });
        } else {
            setValidationErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = '';
                return newErrors;
            });
        }
    };

    const calculateRemainingQty = (packages) => {
        const totalQty = packages.reduce((sum, pkg) => sum + (pkg.capacity * pkg.quantity), 0);
        setRemainingQty(finishedProduct.item_qty - totalQty);
    };

    const addPackageField = () => {
        setSelectedPackages([...selectedPackages, { package_id: '', item_name: '', capacity: '', unit: '', quantity: 0, available_quantity: 0 }]);
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
                return createProductStockIn({
                    finished_product_id: finishedProduct.id,
                    item_name: finishedProduct.stock_out.request.request_for.name,
                    item_qty: pkg.capacity * pkg.quantity,
                    package_type: `${pkg.item_name} (${pkg.capacity}${pkg.unit})`,
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
                                <div key={index} className="grid grid-cols-3 gap-4">
                                    <select
                                        value={pkg.package_id}
                                        onChange={(e) => handlePackageChange(e, index)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                        required
                                    >
                                        <option value="">Select Package</option>
                                        {packageProcesses.flatMap((process) =>
                                            process.unmergedItems.map((item) => (
                                                <option key={item.item_id} value={item.item_id}>
                                                    {item.item_name} ({item.capacity}{item.unit}) - Available: {item.quantity}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <input
                                        type="number"
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
                                        <div className="col-span-3 text-red-500">{validationErrors[index]}</div>
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