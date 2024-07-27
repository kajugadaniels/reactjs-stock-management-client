import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRequests } from '../../hooks';

const CreateRequest = ({ isOpen, onClose, fetchRequests }) => {
    const { 
        formData, 
        setFormData,
        handleChange, 
        addRequest, 
        loading, 
        errors, 
        stockIns, 
        finishedItems, 
        rawMaterialItems,
        employees, 
        stockInsError, 
        finishedItemsError, 
        rawMaterialItemsError,
        employeesError,
        fetchStockIns,
        fetchFinishedItems,
        fetchRawMaterialItems,
        fetchEmployees
    } = useRequests();

    const [selectedItems, setSelectedItems] = useState([{ item_id: '', quantity: '' }]);
    const [requestFrom, setRequestFrom] = useState(formData.request_from || '');
    const [otherRequestFrom, setOtherRequestFrom] = useState(formData.request_from === 'Others' ? '' : formData.request_from);

    useEffect(() => {
        fetchStockIns();
        fetchFinishedItems();
        fetchRawMaterialItems();
        fetchEmployees();
        setFormData({
            ...formData,
            status: 'Pending'
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestData = {
                ...formData,
                request_from: requestFrom === 'Others' ? otherRequestFrom : requestFrom,
                items: selectedItems.filter(item => item.item_id && item.quantity)
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
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground">
                <h2 className="mb-4 text-2xl font-semibold">Request Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact_person_id">Contact Person</label>
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
                        {errors.contact_person_id && <p className="mt-1 text-xs text-red-500">{errors.contact_person_id}</p>}
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
                        {errors.requester_name && <p className="mt-1 text-xs text-red-500">{errors.requester_name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_from">Request From</label>
                        <select
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400"
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
                        {requestFrom === 'Others' && (
                            <input
                                className="bg-[#f3f4f6] w-full p-2 mt-2 border border-input rounded bg-input text-foreground"
                                type="text"
                                id="other_request_from"
                                name="other_request_from"
                                placeholder="Specify other source"
                                value={otherRequestFrom}
                                onChange={(e) => setOtherRequestFrom(e.target.value)}
                                required
                            />
                        )}
                        {errors.request_from && <p className="mt-1 text-xs text-red-500">{errors.request_from}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Items</label>
                        {selectedItems.map((item, index) => (
                            <div key={index} className="flex mb-2 space-x-2">
                                <select
                                    name="item_id"
                                    value={item.item_id}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {rawMaterialItems.map((stockIn) => (
                                        <option key={stockIn.id} value={stockIn.id}>
                                            {`${stockIn.name} ${stockIn.type_id} - Supplier: ${stockIn.supplier_id}, Quantity: ${stockIn.quantity}`}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(e, index)}
                                    placeholder="Quantity"
                                    className="w-1/4 px-4 py-2 bg-white border border-gray-300 rounded-md"
                                    required
                                />
                                <button type="button" onClick={() => removeItemField(index)} className="px-2 py-1 text-white bg-red-500 rounded">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addItemField} className="px-4 py-2 text-white bg-green-500 rounded">
                            Add Item
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="request_for_id">Request For</label>
                        {loading ? (
                            <div>Loading items...</div>
                        ) : finishedItemsError ? (
                            <div>Error: {finishedItemsError}</div>
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
                                {finishedItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.request_for_id && <p className="mt-1 text-xs text-red-500">{errors.request_for_id[0]}</p>}
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
                        {errors.note && <p className="mt-1 text-xs text-red-500">{errors.note}</p>}
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
