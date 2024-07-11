import { useState, useEffect } from 'react';

const useItems = () => {
    const [items, setItems] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch items
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch items error:', error);
            setError('Failed to fetch items. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Fetch types by category ID
    const fetchTypes = async (categoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add item
    const addItem = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error('Error adding item:', error);
            throw new Error(error.message || 'Failed to add item');
        }
    };

    // Update item
    const updateItem = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error('Error updating item:', error);
            throw new Error(error.message || 'Failed to update item');
        }
    };

    // Delete item
    const deleteItem = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }

            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Error deleting item:', error);
            throw new Error(error.message || 'Failed to delete item');
        }
    };

    return {
        items,
        types,
        formData,
        loading,
        error,
        fetchItems,
        fetchTypes,
        handleChange,
        addItem,
        updateItem,
        deleteItem,
    };
};

export default useItems;
