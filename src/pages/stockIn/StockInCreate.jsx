import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useStockIn } from '../../hooks';

const StockInCreate = ({ isOpen, onClose }) => {
    const { suppliers, getItemsBySupplier } = useStockIn();
    const [formData, setFormData] = useState({
        supplier_id: '',
        item_id: '',
        quantity: '',
        plate_number: '',
        batch_number: '',
        comment: '',
        date: '',
        registered_by: '',
        loading_payment_status: false
    });
    const [items, setItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            setFormData({
                supplier_id: '',
                item_id: '',
                quantity: '',
                plate_number: '',
                batch_number: '',
                comment: '',
                date: '',
                registered_by: '',
                loading_payment_status: false
            });
        }
    }, [isOpen]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create stock in record');
            }

            Swal.fire({
                title: 'Success',
                text: 'Stock In created successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                onClose();
            });
        } catch (error) {
            console.error('Error creating stock in:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSupplierChange = async (e) => {
        const supplierId = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            supplier_id: supplierId,
        }));

        setLoading(true);
        try {
            const itemsData = await getItemsBySupplier(supplierId);
            setItems(itemsData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <h2 className="mb-4 text-xl font-semibold">Create Stock In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="supplier_id">
                            Supplier
                        </label>
                        <select
                            id="supplier_id"
                            name="supplier_id"
                            value={formData.supplier_id}
                            onChange={handleSupplierChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers && suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="item_id">
                            Item
                        </label>
                        <select
                            id="item_id"
                            name="item_id"
                            value={formData.item_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            disabled={loading || !formData.supplier_id}
                        >
                            <option value="">Select Item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name} - {item.category_name || 'Unknown Category'} - {item.type_name || 'Unknown Type'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="quantity">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="plate_number">
                            Plate Number
                        </label>
                        <input
                            type="text"
                            id="plate_number"
                            name="plate_number"
                            value={formData.plate_number}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="batch_number">
                            Batch Number
                        </label>
                        <input
                            type="text"
                            id="batch_number"
                            name="batch_number"
                            value={formData.batch_number}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="registered_by">
                            Registered By
                        </label>
                        <select
                            id="registered_by"
                            name="registered_by"
                            value={formData.registered_by}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees && employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Loading Payment Status
                        </label>
                        <input
                            type="checkbox"
                            id="loading_payment_status"
                            name="loading_payment_status"
                            checked={formData.loading_payment_status}
                            onChange={handleInputChange}
                            className="w-4 h-4"
                        /> Paid
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        disabled={loading || !formData.supplier_id || !formData.item_id}
                    >
                        {loading ? 'Creating...' : 'Create Stock In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StockInCreate;
