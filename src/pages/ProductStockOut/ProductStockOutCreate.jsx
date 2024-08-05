import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useStockIn } from '../../hooks';

const StockOutCreate = ({ isOpen, onClose }) => {
    const {
        suppliers,
        employees,
        getItemsBySupplier,
        addStockOut,
        loading
    } = useStockIn();

    const [formData, setFormData] = useState({
        supplier_id: '',
        item_id: '',
        quantity: '',
        plate_number: '',
        batch_number: '',
        client_name: '',
        item_name: '',
        comment: '',
        date: '',
        registered_by: '',
        location: '', // Ensure this is correctly initialized
        loading_payment_status: false,
    });

    const locations = ["Client", "Shop", "Other"]; // Predefined locations for selection
    const [items, setItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                supplier_id: '',
                item_id: '',
                quantity: '',
                plate_number: '',
                batch_number: '',
                client_name: '',
                item_name: '',
                comment: '',
                date: '',
                registered_by: '',
                location: '', 
                loading_payment_status: false,
            });
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            await addStockOut(formData);
            Swal.fire({
                title: 'Success',
                text: 'Stock Out created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                onClose();
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsAdding(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <h2 className="mb-4 text-2xl font-semibold">Create Production Stock Out</h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex gap-6">

                    <div className="w-full">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="item_id">
                                Item
                            </label>
                            <select
                                id="item_id"
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select Item</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
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

                        <div className="w-full">
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
                    </div>

                    <div className="flex gap-6">
                        <div className="w-full">
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

                        <div className="w-full">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="client_name">
                                Client Name
                            </label>
                            <input
                                type="text"
                                id="client_name"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div className="w-full">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="location">
                            Location
                        </label>
                        <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    </div>

                    <div className="flex gap-6">
                   

                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="registered_by">
                            Registered By
                            <select
                                id="registered_by"
                                name="registered_by"
                                value={formData.registered_by}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
                            Date
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </label>

                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="loading_payment_status">
                            Loading Payment Status
                            <input
                                type="checkbox"
                                id="loading_payment_status"
                                name="loading_payment_status"
                                checked={formData.loading_payment_status}
                                onChange={handleInputChange}
                                className="ml-2 align-middle"
                            /> Paid
                        </label>
                    </div>
                 

                    <div className="w-full">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="comment">
                            Comment
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        disabled={loading || !formData.supplier_id || !formData.item_id}
                    >
                        {isAdding ? 'Creating...' : 'Create Production Stock Out'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StockOutCreate;
