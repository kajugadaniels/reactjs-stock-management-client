import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const StockInCreate = ({ isOpen, onClose, onStockInCreated }) => {
    const [formData, setFormData] = useState({
        supplier_id: '',
        items: [],
        plate_number: '',
        batch_number: '',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        loading_payment_status: false,
    });
    const [suppliers, setSuppliers] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            resetForm();
            const user = JSON.parse(localStorage.getItem('user'));
            setCurrentUser(user);
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const suppliersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);
            setSuppliers(suppliersResponse.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            Swal.fire('Error', 'Failed to fetch initial data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            supplier_id: '',
            items: [],
            plate_number: '',
            batch_number: '',
            comment: '',
            date: new Date().toISOString().split('T')[0],
            loading_payment_status: false,
        });
        setAvailableItems([]);
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
        setFormData(prevState => ({ ...prevState, supplier_id: supplierId, items: [] }));
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
                setFormData(prevState => {
                    const existingItemIndex = prevState.items.findIndex(i => i.item_id === selectedItem.id);
                    if (existingItemIndex > -1) {
                        const updatedItems = [...prevState.items];
                        const quantity = updatedItems[existingItemIndex].quantity + 1;
                        updatedItems[existingItemIndex] = {
                            ...updatedItems[existingItemIndex],
                            quantity: quantity,
                            init_qty: quantity // Set init_qty to match the updated quantity
                        };
                        return { ...prevState, items: updatedItems };
                    } else {
                        const quantity = 1;
                        return {
                            ...prevState,
                            items: [...prevState.items, {
                                item_id: selectedItem.id,
                                name: selectedItem.name,
                                category_name: selectedItem.category_name,
                                type_name: selectedItem.type_name,
                                capacity: selectedItem.capacity,
                                unit: selectedItem.unit,
                                quantity: quantity,
                                init_qty: quantity,
                                package_qty: 0
                            }]
                        };
                    }
                });
            }
        }
    };

    const handleItemQuantityChange = (itemId, quantity) => {
        setFormData(prevState => ({
            ...prevState,
            items: prevState.items.map(item =>
                item.item_id === itemId ? {
                    ...item,
                    quantity: parseInt(quantity, 10),
                    init_qty: parseInt(quantity, 10) // Update init_qty to match the new quantity
                } : item
            )
        }));
    };

    const handlePackageQtyChange = (itemId, packageQty) => {
        setFormData(prevState => ({
            ...prevState,
            items: prevState.items.map(item =>
                item.item_id === itemId ? {
                    ...item,
                    package_qty: parseInt(packageQty, 10)
                } : item
            )
        }));
    };

    const handleItemRemove = (itemId) => {
        setFormData(prevState => ({
            ...prevState,
            items: prevState.items.filter(item => item.item_id !== itemId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSubmit = {
            ...formData,
            items: formData.items.map(item => ({
                item_id: item.item_id,
                quantity: item.quantity,
                init_qty: item.init_qty,
                package_qty: item.package_qty
            })),
            registered_by: currentUser.id
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/stock-ins`, formDataToSubmit);
            Swal.fire({
                title: 'Success',
                text: 'Stock In created successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                onStockInCreated();
                onClose();
            });
        } catch (error) {
            console.error('Error creating stock in:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to create Stock In', 'error');
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
                <h2 className="mb-4 text-2xl font-semibold">Create Stock In</h2>
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
                                onChange={handleItemSelect}
                                className="w-full p-3 border border-gray-300 rounded"
                                disabled={!formData.supplier_id}
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
                        <h3 className="mb-2 text-lg font-semibold">Selected Items</h3>
                        {formData.items.length === 0 ? (
                            <p className="text-gray-500">No items selected</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left border-b">Item Details</th>
                                            <th className="px-4 py-2 text-center border-b">Quantity</th>
                                            <th className="px-4 py-2 text-center border-b">Number Of Sacks</th>
                                            <th className="px-4 py-2 text-center border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.items.map(item => (
                                            <tr key={item.item_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border-b">
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {item.category_name} - {item.type_name} {item.capacity} {item.unit}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemQuantityChange(item.item_id, e.target.value)}
                                                        className="w-full p-2 text-center border border-gray-300 rounded"
                                                        placeholder="Quantity in KG"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.package_qty}
                                                        onChange={(e) => handlePackageQtyChange(item.item_id, e.target.value)}
                                                        className="w-full p-2 text-center border border-gray-300 rounded"
                                                        placeholder="Package Quantity"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center border-b">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleItemRemove(item.item_id)}
                                                        className="px-3 py-1 text-sm text-red-500 bg-white border border-red-500 rounded hover:bg-red-500 hover:text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6">
                        <div className="w-1/3">
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
                        <div className="w-1/3">
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
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="registered_by">
                                Registered By
                            </label>
                            <input
                                type="text"
                                id="registered_by"
                                value={currentUser ? currentUser.name : ''}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                                disabled
                            />
                        </div>
                        <div className="w-1/3">
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
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
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
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="block text-sm font-bold text-gray-700" htmlFor="loading_payment_status">
                        off/loading payment status
                        </label>
                        <input
                            type="checkbox"
                            id="loading_payment_status"
                            name="loading_payment_status"
                            checked={formData.loading_payment_status}
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 font-semibold text-white bg-[#00BDD6] rounded-md hover:bg-[#48b0c0] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockInCreate;