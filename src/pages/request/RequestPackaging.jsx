import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRequests } from '../../hooks';

const RequestPackaging = ({ isOpen, onClose }) => {
    const {
        formData,
        setFormData,
        handleChange,
        addRequest,
        loading,
        errors,
        stockIns,
        finishedItems,
        packagesItems,
        employees,
        stockInsError,
        finishedItemsError,
        packagesItemsError,
        employeesError,
        fetchStockIns,
        fetchFinishedItems,
        fetchPackagesItems,
        fetchEmployees,
        fetchRequests,
    } = useRequests();

    const [selectedItems, setSelectedItems] = useState([{ item_id: '', quantity: '' }]);
    const [requestFrom, setRequestFrom] = useState(formData.request_from || '');
    const [otherRequestFrom, setOtherRequestFrom] = useState('');
    const [outsideClient, setOutsideClient] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        fetchStockIns();
        fetchFinishedItems();
        fetchPackagesItems();
        fetchEmployees();
        setFormData({
            ...formData,
            status: 'Pending',
        });
    }, []);

    useEffect(() => {
        if (requestFrom === 'Production') {
            setFilteredItems(finishedItems.filter(item => item.category && item.category.name === 'Finished' && item.name !== 'Outside'));
        } else if (requestFrom === 'Outside Clients' || requestFrom === 'Others') {
            setFilteredItems(finishedItems.filter(item => item.category && item.category.name === 'Finished' && item.name === 'Outside'));
        } else {
            setFilteredItems([]);
        }
    }, [requestFrom, finishedItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalRequestFrom = requestFrom;
            if (requestFrom === 'Outside Clients') {
                finalRequestFrom = `Outside Clients: ${outsideClient}`;
            } else if (requestFrom === 'Others') {
                finalRequestFrom = otherRequestFrom;
            }
            
            const requestData = {
                ...formData,
                request_from: finalRequestFrom,
                items: selectedItems.filter((item) => item.item_id && item.quantity),
            };
            await addRequest(requestData);
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

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = [...selectedItems];
        updatedItems[index][name] = name === 'quantity' ? parseInt(value, 10) || '' : value;
        setSelectedItems(updatedItems);
    };

    const addItemField = () => {
        setSelectedItems([...selectedItems, { item_id: '', quantity: '' }]);
    };

    const removeItemField = (index) => {
        const updatedItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updatedItems);
    };

    const handleRequestFromChange = (e) => {
        const value = e.target.value;
        setRequestFrom(value);
        if (value !== 'Others') {
            setOtherRequestFrom('');
        }
        if (value !== 'Outside Clients') {
            setOutsideClient('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-semibold text-gray-800">Request Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="contact_person_id">Contact Person</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
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
                            {errors.contact_person_id && <p className="mt-2 text-xs text-red-500">{errors.contact_person_id[0]}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="requester_name">Requester Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                type="text"
                                id="requester_name"
                                name="requester_name"
                                placeholder="Input text"
                                value={formData.requester_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.requester_name && <p className="mt-2 text-xs text-red-500">{errors.requester_name[0]}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="request_from">Request From</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                id="request_from"
                                name="request_from"
                                value={requestFrom}
                                onChange={handleRequestFromChange}
                                required
                            >
                                <option value="">Select Request From</option>
                                <option value="Production">Production</option>
                                <option value="Outside Clients">Outside Clients</option>
                                <option value="Others">Others</option>
                            </select>
                            {requestFrom === 'Outside Clients' && (
                                <input
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    type="text"
                                    id="outside_client"
                                    name="outside_client"
                                    placeholder="Specify outside client"
                                    value={outsideClient}
                                    onChange={(e) => setOutsideClient(e.target.value)}
                                    required
                                />
                            )}
                            {requestFrom === 'Others' && (
                                <input
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    type="text"
                                    id="other_request_from"
                                    name="other_request_from"
                                    placeholder="Specify other source"
                                    value={otherRequestFrom}
                                    onChange={(e) => setOtherRequestFrom(e.target.value)}
                                    required
                                />
                            )}
                            {errors.request_from && <p className="mt-2 text-xs text-red-500">{errors.request_from[0]}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="request_for_id">Request For</label>
                            {loading ? (
                                <div>Loading items...</div>
                            ) : packagesItemsError ? (
                                <div>Error: {packagesItemsError}</div>
                            ) : (
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    id="request_for_id"
                                    name="request_for_id"
                                    value={formData.request_for_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Request For</option>
                                    {filteredItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.request_for_id && <p className="mt-2 text-xs text-red-500">{errors.request_for_id[0]}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Items</label>
                        {selectedItems.map((item, index) => (
                            <div key={index} className="flex mb-2 space-x-4">
                                <select
                                    name="item_id"
                                    value={item.item_id}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {packagesItems.map((packageItem) => (
                                        packageItem.quantity > 0 && (
                                            <option key={packageItem.id} value={packageItem.id}>
                                                {`${packageItem.name} ${packageItem.capacity}${packageItem.unit} - Supplier: ${packageItem.supplier_name} - Qty: ${packageItem.quantity}`}
                                            </option>
                                        )
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(e, index)}
                                    placeholder="Quantity"
                                    className="w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                />
                                <button type="button" onClick={() => removeItemField(index)} className="px-4 py-2 text-white bg-red-500 rounded-md">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addItemField} className="px-4 py-2 mt-4 text-white bg-[#00BDD6] rounded-md">
                            Add Item
                        </button>
                        {errors.items && <p className="mt-2 text-xs text-red-500">{errors.items[0]}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="note">Note</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            id="note"
                            name="note"
                            placeholder="Input text"
                            value={formData.note}
                            onChange={handleChange}
                        />
                        {errors.note && <p className="mt-2 text-xs text-red-500">{errors.note[0]}</p>}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100" onClick={onClose}>Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestPackaging;