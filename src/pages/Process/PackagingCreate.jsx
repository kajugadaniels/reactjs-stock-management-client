import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PackagingCreate = ({ isOpen, onClose, finishedProduct }) => {
    const [packageStocks, setPackageStocks] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [remainingQuantity, setRemainingQuantity] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

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
        setSelectedPackages([...selectedPackages, { 
            packageStock, 
            quantity: '', 
            packedQuantity: 0 
        }]);
        setErrors({});
    };

    const handleQuantityChange = (index, value) => {
        const updatedPackages = [...selectedPackages];
        const packageItem = updatedPackages[index];
        const newErrors = { ...errors };
        
        if (value === '') {
            packageItem.quantity = '';
            packageItem.packedQuantity = 0;
            delete newErrors[index];
        } else {
            const quantity = parseInt(value);
            if (quantity > packageItem.packageStock.quantity) {
                newErrors[index] = `We only have ${packageItem.packageStock.quantity} of this package stock item available.`;
            } else {
                delete newErrors[index];
            }
            packageItem.quantity = quantity.toString();
            packageItem.packedQuantity = quantity * packageItem.packageStock.capacity;
        }

        setSelectedPackages(updatedPackages);
        setErrors(newErrors);
        updateRemainingQuantity();
    };

    const updateRemainingQuantity = () => {
        const packedTotal = selectedPackages.reduce((total, pkg) => total + pkg.packedQuantity, 0);
        setRemainingQuantity(finishedProduct.item_qty - packedTotal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            Swal.fire('Error', 'Please correct the errors before submitting', 'error');
            return;
        }
        setIsSubmitting(true);

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
            Swal.fire('Error', 'Failed to complete packaging', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="relative w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
                <button 
                    onClick={onClose}
                    className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
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
                        Remaining Quantity: <span className="text-[#00BDD6]">{remainingQuantity} KG</span>
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="package-select" className="block mb-2 text-sm font-medium text-gray-700">Select Package</label>
                        <select
                            id="package-select"
                            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            onChange={(e) => handlePackageSelect(JSON.parse(e.target.value))}
                            value=""
                        >
                            <option value="">Choose a package type</option>
                            {packageStocks.map((pkg) => (
                                <option key={pkg.id} value={JSON.stringify(pkg)}>
                                    {pkg.item_name} - {pkg.type} - {pkg.capacity}{pkg.unit} (Available: {pkg.quantity})
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedPackages.map((pkg, index) => (
                        <div key={index} className="p-4 mb-4 border rounded-md bg-gray-50">
                            <p className="font-medium text-gray-700">
                                {pkg.packageStock.item_name} - {pkg.packageStock.type} - {pkg.packageStock.capacity}{pkg.packageStock.unit}
                            </p>
                            <div className="flex items-center mt-2">
                                <label htmlFor={`quantity-${index}`} className="mr-2 text-sm font-medium text-gray-700">Quantity:</label>
                                <input
                                    id={`quantity-${index}`}
                                    type="number"
                                    value={pkg.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    min="0"
                                    className="w-20 px-2 py-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
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
                            className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-opacity-50 transition-colors"
                            disabled={isSubmitting || remainingQuantity === finishedProduct.item_qty || Object.keys(errors).length > 0}
                        >
                            {isSubmitting ? 'Processing...' : 'Complete Packaging'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackagingCreate;