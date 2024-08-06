import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ProductStockOutCreate = ({ isOpen, onClose }) => {
    const [productStockIns, setProductStockIns] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        prod_stock_in_id: '',
        employee_id: '',
        location: '',
        plate: '',
        contact: '',
        loading_payment_status: false,
        comment: '',
        quantity: '',
        batch: '',
        client_name: '',
        item_name: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProductStockIns();
            fetchEmployees();
        }
    }, [isOpen]);

    const fetchProductStockIns = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/product-stock-ins');
            const data = await response.json();
            const filteredData = data.filter(item => item.quantity >= 0);
            setProductStockIns(filteredData);
        } catch (err) {
            console.error('Failed to fetch product stock ins:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/employees');
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/product-stock-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred');

            Swal.fire('Success', 'Stock Out Created Successfully', 'success');
            onClose();
        } catch (error) {
            setError(error.message);
            Swal.fire('Error', error.message, 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Create Stock Out</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Product Stock In</label>
                                <select
                                    name="prod_stock_in_id"
                                    value={formData.prod_stock_in_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Product Stock In</option>
                                    {productStockIns.map(stockIn => (
                                        <option key={stockIn.id} value={stockIn.id}>
                                            {stockIn.item_name} - {stockIn.quantity} units
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Employee</label>
                                <select
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees && employees.length > 0 && employees.map(employee => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name || 'No Name'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Plate Number</label>
                                <input
                                    type="text"
                                    name="plate"
                                    value={formData.plate}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Contact</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Batch</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Client Name</label>
                                <input
                                    type="text"
                                    name="client_name"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    name="item_name"
                                    value={formData.item_name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Comment</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="loading_payment_status"
                                checked={formData.loading_payment_status}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm font-medium text-gray-700">Loading Payment Status</label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create Stock Out
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductStockOutCreate;