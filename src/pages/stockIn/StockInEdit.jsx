import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StockInEdit = ({ isOpen, onClose, stockIn, onStockInUpdated }) => {
    const [formData, setFormData] = useState({
        supplier_id: '',
        item_id: null,
        init_qty: 1, // Default init_qty to 1
        plate_number: '',
        batch_number: '',
        comment: '',
        date: '',
        registered_by: '',
        loading_payment_status: false,
    });
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && stockIn) {
            fetchInitialData();
            setFormData({
                supplier_id: stockIn.supplier_id,
                item_id: stockIn.item ? stockIn.item.id : null,
                init_qty: stockIn.init_qty || 1,
                plate_number: stockIn.plate_number,
                batch_number: stockIn.batch_number,
                comment: stockIn.comment,
                date: stockIn.date,
                registered_by: stockIn.registered_by,
                loading_payment_status: stockIn.loading_payment_status,
            });
        }
    }, [isOpen, stockIn]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [suppliersResponse, employeesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/suppliers`),
                axios.get(`${import.meta.env.VITE_API_URL}/employees`)
            ]);
            setSuppliers(suppliersResponse.data);
            setEmployees(employeesResponse.data);

            if (stockIn.supplier_id) {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${stockIn.supplier_id}`);
                const items = response.data.data || response.data;
                setAvailableItems(Array.isArray(items) ? items : []);

                // Set the selected item if it exists
                if (stockIn.item) {
                    const selectedItem = items.find(item => item.id === stockIn.item.id);
                    if (selectedItem) {
                        setSelectedItem(selectedItem);
                        setFormData(prevState => ({
                            ...prevState,
                            item_id: selectedItem.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            Swal.fire('Error', 'Failed to fetch initial data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSupplierChange = async (e) => {
        const supplierId = e.target.value;
        setFormData(prevState => ({ ...prevState, supplier_id: supplierId, item_id: null })); // Reset the item_id
        setSelectedItem(null);
        if (supplierId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplierId}`);
                const items = response.data.data || response.data;
                setAvailableItems(Array.isArray(items) ? items : []);
                if (items.length === 0) {
                    Swal.fire('Warning', 'This supplier doesn\'t supply any items', 'warning');
                }
            } catch (error) {
                console.error('Error fetching items for supplier:', error);
                Swal.fire('Error', 'Failed to fetch items for supplier', 'error');
                setAvailableItems([]);
            }
        } else {
            setAvailableItems([]);
        }
    };

    const handleItemSelect = (e) => {
        const selectedItemId = e.target.value;
        if (selectedItemId) {
            const selectedItem = availableItems.find(item => item.id === parseInt(selectedItemId));
            if (selectedItem) {
                setSelectedItem(selectedItem);
                setFormData(prevState => ({
                    ...prevState,
                    item_id: selectedItem.id,
                    init_qty: 1 // Reset init_qty to 1 when a new item is selected
                }));
            }
        } else {
            setSelectedItem(null);
            setFormData(prevState => ({
                ...prevState,
                item_id: null
            }));
        }
    };

    const handleItemQuantityChange = (init_qty) => {
        setFormData(prevState => ({
            ...prevState,
            init_qty: parseInt(init_qty, 10) || 1 // Ensure init_qty is at least 1
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/stock-ins/${stockIn.id}`, formData);
            Swal.fire({
                title: 'Success',
                text: 'Stock In updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                onStockInUpdated();
                onClose();
            });
        } catch (error) {
            console.error('Error updating stock in:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to update Stock In', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <h2 className="mb-4 text-2xl font-semibold">Edit Stock In</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-6">
                        <div className="w-2/5">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="supplier_id">
                                Supplier
                            </label>
                            <select
                                id="supplier_id"
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleSupplierChange}
                                className="w-full p-3 border border-gray-300 rounded"
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
                        <div className="w-3/5">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="item_select">
                                Select Item
                            </label>
                            <select
                                id="item_select"
                                value={formData.item_id || ''}
                                onChange={handleItemSelect}
                                className="w-full p-3 border border-gray-300 rounded"
                                disabled={!formData.supplier_id}
                                required
                            >
                                <option value="">Select an item</option>
                                {availableItems.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} - {item.category_name} - {item.type_name} {item.capacity} {item.unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Selected Item</h3>
                        {selectedItem ? (
                            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <div>
                                    {selectedItem.name} - {selectedItem.category_name} - {selectedItem.type_name} {selectedItem.capacity} {selectedItem.unit}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.init_qty}
                                        onChange={(e) => handleItemQuantityChange(e.target.value)}
                                        className="w-20 p-1 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No item selected</p>
                        )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-4">
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="plate_number">
                                Plate Number
                            </label>
                            <input
                                type="text"
                                id="plate_number"
                                name="plate_number"
                                value={formData.plate_number}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="batch_number">
                                Batch Number
                            </label>
                            <input
                                type="text"
                                id="batch_number"
                                name="batch_number"
                                value={formData.batch_number}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="registered_by">
                                Registered By
                            </label>
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
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="loading_payment_status"
                            name="loading_payment_status"
                            checked={formData.loading_payment_status}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label htmlFor="loading_payment_status" className="text-sm text-gray-700">Loading Payment Status</label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white bg-gray-500 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 font-semibold text-white bg-[#00BDD6] rounded-md hover:bg-[#48b0c0] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockInEdit;