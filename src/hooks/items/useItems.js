import { useState, useEffect } from 'react';

const useItems = (initialData = {}) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setError('Failed to fetch items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError('Failed to fetch categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async (categoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            setError('Failed to fetch types. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            return data;
        } catch (error) {
            setError(error.message || 'Failed to add item');
            throw error;
        } finally {
            setLoading(false);
        }
    };

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
            return data;
        } catch (error) {
            setError(error.message || 'Failed to update item');
            throw error;
        } finally {
            setLoading(false);
        }
    };

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

            return true;
        } catch (error) {
            setError(error.message || 'Failed to delete item');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    return {
        items,
        categories,
        types,
        formData,
        setFormData,
        loading,
        error,
        handleChange,
        addItem,
        updateItem,
        deleteItem,
        fetchTypes,
        fetchItems,
    };
};

export default useItems;
