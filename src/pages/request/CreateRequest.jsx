import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useRequestForm from '../../hooks/request/useRequestForm'; // Make sure the path is correct

const CreateRequest = ({ isOpen, onClose, fetchRequests }) => {
    const { formData, handleChange, addRequest, loading, errors } = useRequestForm();
    const [stockIns, setStockIns] = useState([]);
    const [items, setItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stockInsError, setStockInsError] = useState(null);
    const [itemsError, setItemsError] = useState(null);
    const [employeesError, setEmployeesError] = useState(null);

    useEffect(() => {
        fetchStockIns();
        fetchItems();
        fetchEmployees();
    }, []);

    const fetchStockIns = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock-ins');
            }
            const data = await response.json();
            setStockIns(data);
        } catch (error) {
            setStockInsError(error.message);
            console.error('Error fetching stock-ins:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setItemsError(error.message);
            console.error('Error fetching items:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setEmployeesError(error.message);
            console.error('Error fetching employees:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form Data:', formData); // Log formData to check its content
            await addRequest();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request created successfully!',
            });
            onClose();
            fetchRequests();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create request',
            });
            console.error('Error creating request:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground">
                <h2 className="mb-4 text-2xl font-semibold">Request Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-14'>
                        <div className="w-full mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-600">Item</label>
                            {loading ? (
                                <div>Loading items...</div>
                            ) : stockInsError ? (
                                <div>Error: {stockInsError}</div>
                            ) : (
                                <select
                                    name="item_id"
                                    value={formData.item_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {stockIns.map((stockIn) => (
                                        <option key={stockIn.id} value={stockIn.id}>
                                            {`${stockIn.item.name} - Category: ${stockIn.item.category.name}, Type: ${stockIn.item.type.name}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.item_id && <p className="mt-1 text-xs text-red-500">{errors.item_id[0]}</p>}
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact_person_id">Contact Person</label>
                            {employeesError ? (
                                <div>Error: {employeesError}</div>
                            ) : (
                                <select
                                    className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                                    id="contact_person_id"
                                    name="contact_person_id"
                                    value={formData.contact_person_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a contact person</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.contact_person_id && <p className="mt-1 text-xs text-red-500">{errors.contact_person_id[0]}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="requester_name">Requester Name</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="requester_name"
                            name="requester_name"
                            placeholder="Input text"
                            value={formData.requester_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.requester_name && <p className="mt-1 text-xs text-red-500">{errors.requester_name[0]}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_from">Request From</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="text"
                            id="request_from"
                            name="request_from"
                            placeholder="Input text"
                            value={formData.request_from}
                            onChange={handleChange}
                            required
                        />
                        {errors.request_from && <p className="mt-1 text-xs text-red-500">{errors.request_from[0]}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="status">Status</label>
                        <select
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status[0]}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_for_id">Request For</label>
                        {loading ? (
                            <div>Loading items...</div>
                        ) : itemsError ? (
                            <div>Error: {itemsError}</div>
                        ) : (
                            <select
                                className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
                                id="request_for_id"
                                name="request_for_id"
                                value={formData.request_for_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Request For</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.request_for_id && <p className="mt-1 text-xs text-red-500">{errors.request_for_id[0]}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="quantity">Quantity</label>
                        <input
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            type="number"
                            id="quantity"
                            name="quantity"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                        {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity[0]}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="note">Note</label>
                        <textarea
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            id="note"
                            name="note"
                            placeholder="Input text"
                            value={formData.note}
                            onChange={handleChange}
                        />
                        {errors.note && <p className="mt-1 text-xs text-red-500">{errors.note[0]}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] text-white hover:bg-primary/80 p-2 rounded" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRequest;
