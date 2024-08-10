import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddItemToSupplier = ({ isOpen, onClose, supplier }) => {
    const [allItems, setAllItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchAvailableItems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/available-items`);
                setAllItems(response.data.data);
                setDisplayedItems(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching available items:', error);
                setError('Failed to fetch available items');
                setLoading(false);
            }
        };

        fetchAvailableItems();
    }, []);

    useEffect(() => {
        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedItems(filtered);
    }, [searchTerm, allItems]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddItems = async () => {
        if (selectedItems.length === 0) {
            Swal.fire('Error', 'Please select at least one item.', 'error');
            return;
        }
    
        setIsAdding(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/supplier-items`, {
                supplier_id: supplier.id,
                item_ids: selectedItems.map(item => item.id)
            });
            
            const { created_items, existing_items } = response.data;
            
            let message = '';
            if (created_items.length > 0) {
                message += `${created_items.length} item(s) added successfully. `;
            }
            if (existing_items.length > 0) {
                const existingItemNames = existing_items.map(item => item.item.name).join(', ');
                message += `Supplier already supplies these item(s): ${existingItemNames}.`;
            }
    
            Swal.fire({
                title: 'Success',
                html: message,
                icon: 'success'
            });
            onClose();
            setSelectedItems([]);
        } catch (error) {
            console.error('Error adding items to supplier:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to add items to supplier.', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const toggleItemSelection = (item) => {
        setSelectedItems(prev => 
            prev.some(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id)
                : [...prev, item]
        );
    };

    const removeSelectedItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-semibold">Add Items to {supplier.name}</h2>
                
                {/* Selected Items Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedItems.map(item => (
                        <span key={item.id} className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center">
                            {item.name} - {item.category_name || ''} - {item.type_name || ''} {item.capacity || ''}{item.unit}
                            <button onClick={() => removeSelectedItem(item.id)} className="ml-1 text-green-600 hover:text-green-800">
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                {/* Custom Select Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                    >
                        Select items...
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                                {displayedItems.map(item => (
                                    <li
                                        key={item.id}
                                        onClick={() => toggleItemSelection(item)}
                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.some(i => i.id === item.id)}
                                            onChange={() => {}}
                                            className="mr-2"
                                        />
                                        {item.name} - {item.category_name || ''} - {item.type_name || ''} {item.capacity || ''}{item.unit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddItems}
                        className="px-4 py-2 bg-[#00BDD6] text-white rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                        disabled={isAdding || selectedItems.length === 0}
                    >
                        {isAdding ? 'Adding...' : 'Add Items'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddItemToSupplier;