import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PackagingCreate = ({ isOpen, onClose, finishedProduct }) => {
    const [packageStocks, setPackageStocks] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [remainingQuantity, setRemainingQuantity] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPackageStocks();
            setRemainingQuantity(finishedProduct.item_qty);
            setSelectedPackages([]);
            setErrors({});
        }
    }, [isOpen, finishedProduct]);

    const fetchPackageStocks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/package-stocks`);
            setPackageStocks(response.data);
        } catch (error) {
            console.error('Error fetching package stocks:', error);
            Swal.fire('Error', 'Failed to fetch package stocks', 'error');
        }
    };

    const handlePackageSelect = (packageStock) => {
        setSelectedPackages(prevPackages => {
            const newPackages = [
                ...prevPackages,
                { 
                    packageStock: JSON.parse(packageStock), 
                    quantity: '', 
                    packedQuantity: 0 
                }
            ];
            validatePackages(newPackages);
            return newPackages;
        });
    };

    const handleQuantityChange = (index, value) => {
        setSelectedPackages(prevPackages => {
            const updatedPackages = [...prevPackages];
            const packageItem = updatedPackages[index];
            
            if (value === '') {
                packageItem.quantity = '';
                packageItem.packedQuantity = 0;
            } else {
                const quantity = parseInt(value);
                packageItem.quantity = quantity.toString();
                packageItem.packedQuantity = quantity * packageItem.packageStock.capacity;
            }

            validatePackages(updatedPackages);
            return updatedPackages;
        });
    };

    const validatePackages = (packages) => {
        const newErrors = {};
        let totalPackedQuantity = 0;

        packages.forEach((pkg, index) => {
            const quantity = parseInt(pkg.quantity) || 0;
            totalPackedQuantity += quantity * pkg.packageStock.capacity;

            if (quantity > pkg.packageStock.quantity) {
                newErrors[index] = `Exceeds available quantity (${pkg.packageStock.quantity})`;
            } else if (totalPackedQuantity > finishedProduct.item_qty) {
                newErrors[index] = `Exceeds remaining finished product quantity`;
            }
        });

        setErrors(newErrors);
        setRemainingQuantity(Math.max(0, finishedProduct.item_qty - totalPackedQuantity));
    };

    const handleRemovePackage = (index) => {
        setSelectedPackages(prevPackages => {
            const updatedPackages = prevPackages.filter((_, i) => i !== index);
            validatePackages(updatedPackages);
            return updatedPackages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            Swal.fire('Error', 'Please correct the errors before submitting', 'error');
            return;
        }
        setIsSubmitting(true);
        setIsLoading(true);

        try {
            for (const packageItem of selectedPackages) {
                if (parseInt(packageItem.quantity) > 0) {
                    await axios.post(`${import.meta.env.VITE_API_URL}/product-stock-ins`, {
                        finished_product_id: finishedProduct.id,
                        item_name: finishedProduct.stock_out?.request?.request_for?.name,
                        item_qty: packageItem.packedQuantity,
                        package_type: `${packageItem.packageStock.item_name} - ${packageItem.packageStock.type} - ${packageItem.packageStock.capacity}${packageItem.packageStock.unit}`,
                        quantity: parseInt(packageItem.quantity),
                        status: 'Packaged'
                    });
                }
            }

            Swal.fire('Success', 'Packaging completed successfully', 'success');
            onClose();
        } catch (error) {
            console.error('Error submitting packaging:', error);
            Swal.fire('Error', `Failed to complete packaging: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="relative w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
                <button 
                    onClick={onClose}
                    className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
                    disabled={isSubmitting || isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Package {finishedProduct.stock_out?.request?.request_for?.name}
                </h2>
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700">
                        {remainingQuantity > 0 ? (
                            <>Remaining Quantity: <span className="text-[#00BDD6]">{remainingQuantity} KG</span></>
                        ) : (
                            <span className="text-green-600">Fully Packed</span>
                        )}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="package-select" className="block mb-2 text-sm font-medium text-gray-700">Select Package</label>
                        <select
                            id="package-select"
                            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            onChange={(e) => handlePackageSelect(e.target.value)}
                            value=""
                            disabled={remainingQuantity === 0 || isSubmitting || isLoading}
                        >
                            <option value="">Choose a package type</option>
                            {packageStocks.map((pkg) => (
                                <option key={pkg.id} value={JSON.stringify(pkg)}>
                                    {pkg.item_name} - {pkg.type} - {pkg.capacity}{pkg.unit} (Capacity: {pkg.capacity}{pkg.unit}, Available: {pkg.quantity})
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedPackages.map((pkg, index) => (
                        <div key={index} className="p-4 mb-4 border rounded-md bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-700">
                                    {pkg.packageStock.item_name} - {pkg.packageStock.type} - {pkg.packageStock.capacity}{pkg.packageStock.unit}
                                    <span className="ml-2 text-sm text-gray-500">
                                        (Capacity: {pkg.packageStock.capacity}{pkg.packageStock.unit}, Available: {pkg.packageStock.quantity})
                                    </span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePackage(index)}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={isSubmitting || isLoading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mt-2">
                                <label htmlFor={`quantity-${index}`} className="mr-2 text-sm font-medium text-gray-700">Quantity:</label>
                                <input
                                    id={`quantity-${index}`}
                                    type="number"
                                    value={pkg.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    min="0"
                                    max={pkg.packageStock.quantity}
                                    className="w-20 px-2 py-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                                    disabled={isSubmitting || isLoading}
                                />
                                <span className="ml-4 text-sm text-gray-600">
                                    Packed: {pkg.packedQuantity} KG
                                </span>
                            </div>
                            {errors[index] && (
                                <p className="mt-2 text-sm text-red-600">{errors[index]}</p>
                            )}
                        </div>
                    ))}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-opacity-50 transition-colors ${
                                (isSubmitting || isLoading || remainingQuantity === finishedProduct.item_qty || Object.keys(errors).length > 0) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                            disabled={isSubmitting || isLoading || remainingQuantity === finishedProduct.item_qty || Object.keys(errors).length > 0}
                        >
                            {isSubmitting || isLoading ? 'Processing...' : 'Complete Packaging'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackagingCreate;