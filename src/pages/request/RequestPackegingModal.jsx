import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RequestPackegingModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        contact_person_id: '',
        requester_name: '',
        request_from: 'Production',
        status: 'Pending',
        request_for_id: '',
        note: '',
    });
    const [selectedPackagings, setSelectedPackagings] = useState([{ packaging_id: '', quantity: '' }]);
    const [requestFrom, setRequestFrom] = useState('Production');
    const [otherRequestFrom, setOtherRequestFrom] = useState('');
    const [specifyField, setSpecifyField] = useState('');

    const packagingOptions = [
        { id: 1, name: 'Box' },
        { id: 2, name: 'Bag' },
        { id: 3, name: 'Crate' },
    ];

    const employees = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const requestData = {
                ...formData,
                request_from: requestFrom === 'Others' || requestFrom === 'Outside Clients' ? otherRequestFrom : requestFrom,
                packagings: selectedPackagings.filter((packaging) => packaging.packaging_id && packaging.quantity),
            };
            // Simulate a successful request submission
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request created successfully!',
            });
            onClose();
            // Reset form data
            setFormData({
                contact_person_id: '',
                requester_name: '',
                request_from: 'Production',
                status: 'Pending',
                request_for_id: '',
                note: '',
            });
            setSelectedPackagings([{ packaging_id: '', quantity: '' }]);
            setOtherRequestFrom('');
            setSpecifyField('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create request',
            });
            console.error('Error creating request:', error);
        }
    };

    const handlePackagingChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPackagings = [...selectedPackagings];
        updatedPackagings[index][name] = name === 'quantity' ? parseInt(value, 10) || '' : value;
        setSelectedPackagings(updatedPackagings);
    };

    const addPackagingField = () => {
        setSelectedPackagings([...selectedPackagings, { packaging_id: '', quantity: '' }]);
    };

    const removePackagingField = (index) => {
        const updatedPackagings = selectedPackagings.filter((_, i) => i !== index);
        setSelectedPackagings(updatedPackagings);
    };

    const handleRequestFromChange = (e) => {
        const value = e.target.value;
        setRequestFrom(value);
        if (value !== 'Others' && value !== 'Outside Clients') {
            setOtherRequestFrom('');
        }
        setSpecifyField('');
    };

    const getDynamicFieldTitle = () => {
        if (requestFrom === 'Production') return 'Request For';
        if (requestFrom === 'Outside Clients') return 'Client Name';
        if (requestFrom === 'Others') return 'Other Source';
        return 'Request For';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-semibold text-gray-800">Packaging Request Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="contact_person_id">Contact Person</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                id="contact_person_id"
                                name="contact_person_id"
                                value={formData.contact_person_id}
                                onChange={(e) => setFormData({ ...formData, contact_person_id: e.target.value })}
                                required
                            >
                                <option value="">Select a contact person</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
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
                                onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                                required
                            />
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
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="dynamic_field">{getDynamicFieldTitle()}</label>
                            {requestFrom === 'Production' ? (
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    id="request_for_id"
                                    name="request_for_id"
                                    value={formData.request_for_id}
                                    onChange={(e) => setFormData({ ...formData, request_for_id: e.target.value })}
                                    required
                                >
                                    <option value="">Request For</option>
                                    {packagingOptions.map((packaging) => (
                                        <option key={packaging.id} value={packaging.id}>
                                            {packaging.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    type="text"
                                    id="specify_field"
                                    name="specify_field"
                                    placeholder={requestFrom === 'Outside Clients' ? 'Specify client name' : 'Specify other source'}
                                    value={specifyField}
                                    onChange={(e) => setSpecifyField(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Packagings</label>
                        {selectedPackagings.map((packaging, index) => (
                            <div key={index} className="flex mb-2 space-x-4">
                                <select
                                    name="packaging_id"
                                    value={packaging.packaging_id}
                                    onChange={(e) => handlePackagingChange(e, index)}
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                >
                                    <option value="">Select a packaging</option>
                                    {packagingOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={packaging.quantity}
                                    onChange={(e) => handlePackagingChange(e, index)}
                                    placeholder="Quantity"
                                    className="w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    required
                                />
                                <button type="button" onClick={() => removePackagingField(index)} className="px-4 py-2 text-white bg-red-500 rounded-md">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addPackagingField} className="px-4 py-2 mt-4 text-white bg-[#00BDD6] rounded-md">
                            Add Packaging
                        </button>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="note">Note</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            id="note"
                            name="note"
                            placeholder="Input text"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100" onClick={onClose}>Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-[#00A8BB]">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestPackegingModal;
