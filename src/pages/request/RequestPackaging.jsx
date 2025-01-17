import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RequestPackaging = ({ isOpen, onClose, fetchRequests }) => {
    const [allItems, setAllItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        contact_person_id: '',
        requester_name: '',
        request_from: '',
        status: 'Pending',
        note: '',
        request_for_id: '',
        items: [],
    });
    const [errors, setErrors] = useState({});
    const [requestFrom, setRequestFrom] = useState('');
    const [otherRequestFrom, setOtherRequestFrom] = useState('');
    const [outsideClient, setOutsideClient] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [finishedItems, setFinishedItems] = useState([]);
    const [packagesItems, setPackagesItems] = useState([]);
    const [availableQuantities, setAvailableQuantities] = useState({});
    const [quantityErrors, setQuantityErrors] = useState({});
    const [selectedPersonPhone, setSelectedPersonPhone] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesResponse, finishedItemsResponse, packagesItemsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/employees`),
                    axios.get(`${import.meta.env.VITE_API_URL}/finished-items`),
                    axios.get(`${import.meta.env.VITE_API_URL}/package-items`),
                ]);

                setEmployees(employeesResponse.data);
                setFinishedItems(finishedItemsResponse.data);
                setPackagesItems(packagesItemsResponse.data.filter(item => item.quantity > 0));
                setAllItems(packagesItemsResponse.data.filter(item => item.quantity > 0));
                setDisplayedItems(packagesItemsResponse.data.filter(item => item.quantity > 0));

                // Set initial available quantities
                const initialQuantities = {};
                packagesItemsResponse.data.forEach(item => {
                    initialQuantities[item.id] = item.quantity;
                });
                setAvailableQuantities(initialQuantities);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.category_name && item.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.type_name && item.type_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setDisplayedItems(filtered);
    }, [searchTerm, allItems]);

    useEffect(() => {
        if (requestFrom === 'Production') {
            setFilteredItems(finishedItems.filter(item => item.category && item.category.name === 'Finished' && item.name !== 'Outside'));
        } else if (requestFrom === 'Outside Clients' || requestFrom === 'Others') {
            setFilteredItems(finishedItems.filter(item => item.category && item.category.name === 'Finished' && item.name === 'Outside'));
        } else {
            setFilteredItems([]);
        }
    }, [requestFrom, finishedItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'contact_person_id') {
            const selectedPerson = employees.find(emp => emp.id === parseInt(value));
            setSelectedPersonPhone(selectedPerson ? selectedPerson.contact : '');
        }
    };

    const handleRequestFromChange = (e) => {
        const value = e.target.value;
        setRequestFrom(value);
        setFormData(prevState => ({
            ...prevState,
            request_from: value
        }));
        if (value !== 'Others') {
            setOtherRequestFrom('');
        }
        if (value !== 'Outside Clients') {
            setOutsideClient('');
        }
    };

    const handleAddItem = (item) => {
        if (formData.items.some(selectedItem => selectedItem.id === item.id)) {
            Swal.fire('Error', 'The item has already been selected.', 'error');
            return;
        }
        if (availableQuantities[item.id] < 1) {
            Swal.fire('Error', 'This item is out of stock.', 'error');
            return;
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            items: [...prevFormData.items, { ...item, quantity: 1 }],
        }));
        setAvailableQuantities(prev => ({
            ...prev,
            [item.id]: prev[item.id] - 1
        }));
        setIsDropdownOpen(false);
    };

    const handleItemQuantityChange = (index, newQuantity) => {
        const item = formData.items[index];
        const currentQuantity = item.quantity;
        const availableQuantity = availableQuantities[item.id] + currentQuantity;

        if (newQuantity > availableQuantity) {
            setQuantityErrors(prev => ({
                ...prev,
                [item.id]: `Insufficient stock. Available: ${availableQuantity}`
            }));
            return;
        }

        setQuantityErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[item.id];
            return newErrors;
        });

        setFormData(prevState => {
            const updatedItems = [...prevState.items];
            updatedItems[index].quantity = newQuantity;
            return { ...prevState, items: updatedItems };
        });

        setAvailableQuantities(prev => ({
            ...prev,
            [item.id]: availableQuantity - newQuantity
        }));
    };

    const handleRemoveItem = (index) => {
        const removedItem = formData.items[index];
        setFormData((prevFormData) => ({
            ...prevFormData,
            items: prevFormData.items.filter((_, i) => i !== index),
        }));
        setAvailableQuantities(prev => ({
            ...prev,
            [removedItem.id]: prev[removedItem.id] + removedItem.quantity
        }));
        setQuantityErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[removedItem.id];
            return newErrors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(quantityErrors).length > 0) {
            Swal.fire('Error', 'Please correct the quantity errors before submitting.', 'error');
            return;
        }

        setLoading(true);
        setErrors({});

        let finalRequestFrom = requestFrom;
        if (requestFrom === 'Outside Clients') {
            finalRequestFrom = `Outside Clients: ${outsideClient}`;
        } else if (requestFrom === 'Others') {
            finalRequestFrom = otherRequestFrom;
        }

        const requestData = {
            contact_person_id: parseInt(formData.contact_person_id),
            requester_name: formData.requester_name,
            request_from: finalRequestFrom,
            status: formData.status,
            note: formData.note,
            request_for_id: parseInt(formData.request_for_id) || null,
            items: formData.items.map(item => ({
                item_id: item.id,
                quantity: parseInt(item.quantity)
            }))
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/requests`, requestData);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request created successfully!',
            }).then(() => {
                setFormData({
                    contact_person_id: '',
                    requester_name: '',
                    request_from: '',
                    status: 'Pending',
                    note: '',
                    request_for_id: '',
                    items: [],
                });
                setRequestFrom('');
                setOtherRequestFrom('');
                setOutsideClient('');
                setSelectedPersonPhone('');
                onClose();

                if (typeof fetchRequests === 'function') {
                    fetchRequests();
                } else {
                    console.warn('fetchRequests is not a function. Please ensure it is passed as a prop to the RequestPackaging component.');
                }

                // Reload the page after successful submission
                window.location.reload();
            });
        } catch (error) {
            console.error('Error creating request:', error);
            if (error.response && error.response.data) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error',
                        text: 'Please check the form for errors.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response.data.message || 'Failed to create request',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An unexpected error occurred. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
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
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a contact person</option>
                                {employees.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                            {errors.contact_person_id && <p className="mt-2 text-xs text-red-500">{errors.contact_person_id}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="contact_person_phone">Phone number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                id="contact_person_phone"
                                name="contact_person_phone"
                                value={selectedPersonPhone}
                                readOnly
                            />
                        </div>
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
                            {errors.requester_name && <p className="mt-2 text-xs text-red-500">{errors.requester_name}</p>}
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
                            {errors.request_from && <p className="mt-2 text-xs text-red-500">{errors.request_from}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="request_for_id">Request For</label>
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
                            {errors.request_for_id && <p className="mt-2 text-xs text-red-500">{errors.request_for_id}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Items</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            >
                                Add Items
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg -gray-300">
                                    <div className="p-2">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search items..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                                        />
                                    </div>
                                    <ul className="overflow-auto max-h-60">
                                        {displayedItems.map((item) => (
                                            <li
                                                key={item.id}
                                                onClick={() => handleAddItem(item)}
                                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.items.some(selectedItem => selectedItem.id === item.id) || availableQuantities[item.id] < 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                {item.name}({item.type_name}) - {item.capacity || ''}{item.unit || ''} - Supplier: {item.supplier_name || ''} - Available: {availableQuantities[item.id]}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {formData.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center"
                                >
                                    {item.name}({item.type_name}) - {item.capacity || ''}{item.unit || ''} - Supplier: {item.supplier_name || ''}
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value, 10))}
                                        className={`ml-2 w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] ${
                                            quantityErrors[item.id] ? 'border-red-500' : 'border-green-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        {Object.entries(quantityErrors).map(([itemId, error]) => (
                            <p key={itemId} className="mt-2 text-xs text-red-500">{error}</p>
                        ))}
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
                        {errors.note && <p className="mt-2 text-xs text-red-500">{errors.note}</p>}
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