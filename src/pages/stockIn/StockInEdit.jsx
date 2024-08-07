import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const StockInEdit = ({ isOpen, onClose, stockIn }) => {
    const [formData, setFormData] = useState({
        supplier_id: '',
        item_id: '',
        quantity: '',
        plate_number: '',
        batch_number: '',
        comment: '',
        date: '',
        registered_by: '',
        loading_payment_status: false,
    });
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (stockIn) {
            setFormData({
                supplier_id: stockIn.supplier_id,
                item_id: stockIn.item_id,
                quantity: stockIn.quantity,
                plate_number: stockIn.plate_number,
                batch_number: stockIn.batch_number,
                comment: stockIn.comment,
                date: stockIn.date,
                registered_by: stockIn.registered_by,
                loading_payment_status: stockIn.loading_payment_status,
            });
            fetchItemsBySupplier(stockIn.supplier_id);
        }
        fetchSuppliers();
        fetchEmployees();
    }, [stockIn]);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
            if (!response.ok) throw new Error('Failed to fetch suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchItemsBySupplier = async (supplierId) => {
        if (!supplierId) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplierId}`);
            if (!response.ok) throw new Error('Failed to fetch items for supplier');
            const data = await response.json();
            setItems(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'supplier_id') {
            fetchItemsBySupplier(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${stockIn.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update stock in');
            }
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Stock In updated successfully!',
            }).then(() => {
                onClose();
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update stock in',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl transform transition-all duration-300 ease-in-out">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Edit Stock In</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition duration-150">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="supplier_id">
                                Supplier
                            </label>
                            <select
                                id="supplier_id"
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="item_id">
                                Item
                            </label>
                            <select
                                id="item_id"
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                                disabled={!formData.supplier_id || loading}
                            >
                                <option value="">Select Item</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                                required
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plate_number">
                                Plate Number
                            </label>
                            <input
                                type="text"
                                id="plate_number"
                                name="plate_number"
                                value={formData.plate_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="batch_number">
                            Batch Number
                        </label>
                        <input
                            type="text"
                            id="batch_number"
                            name="batch_number"
                            value={formData.batch_number}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="registered_by">
                                Registered By
                            </label>
                            <select
                                id="registered_by"
                                name="registered_by"
                                value={formData.registered_by}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="loading_payment_status"
                                name="loading_payment_status"
                                checked={formData.loading_payment_status}
                                onChange={handleInputChange}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-gray-700 font-medium">Loading Payment Status (Paid)</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            rows="3"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                            disabled={loading || !formData.supplier_id || !formData.item_id}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : (
                                'Update Stock In'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockInEdit;