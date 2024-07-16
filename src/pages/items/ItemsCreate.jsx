import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useItemForm } from '../../hooks';

const ItemsCreate = ({ isOpen, onClose }) => {
    const { formData, loading, handleChange, addItem } = useItemForm();
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [productItems, setProductItems] = useState([]); // State for Product Items

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
        fetchProductItems(); // Fetch Product Items
    }, []);

    useEffect(() => {
        if (formData.category_id) {
            fetchTypes(formData.category_id);
        }
    }, [formData.category_id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTypes = async (categoryId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchProductItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch product items');
            }
            const data = await response.json();
            setProductItems(data);
        } catch (error) {
            console.error('Error fetching product items:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addItem();
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item created successfully!',
                }).then(() => {
                    onClose();
                    window.location.reload();
                });
            } else {
                throw new Error('Failed to create item');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create item',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground w-[700px]">
                <h2 className="mb-4 text-2xl font-semibold">Add an Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="product_item_id" className="block text-sm font-medium mb-1 text-[#424955]">Product Item</label>
                        <select
                            id="product_item_id"
                            name="product_item_id"
                            value={formData.product_item_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] p-2 w-full border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select product item</option>
                            {productItems.map((productItem) => (
                                <option key={productItem.id} value={productItem.id}>
                                    {productItem.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block text-sm font-medium mb-1 text-[#424955]">Category</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type_id" className="block text-sm font-medium mb-1 text-[#424955]">Item Type</label>
                        <select
                            id="type_id"
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                            disabled={!formData.category_id}
                        >
                            <option value="">Select type</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="capacity" className="block text-sm font-medium mb-1 text-[#424955]">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter capacity"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="unit" className="block text-sm font-medium mb-1 text-[#424955]">Unit</label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            placeholder="Enter unit"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="supplier_id" className="block text-sm font-medium mb-1 text-[#424955]">Supplier</label>
                        <select
                            id="supplier_id"
                            name="supplier_id"
                            value={formData.supplier_id}
                            onChange={handleChange}
                            className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground"
                            required
                        >
                            <option value="">Select supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <div className='bg-[#00BDD6] p-2 text-white rounded-xl'> {loading ? 'Creating...' : 'Create Item'}</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsCreate;
