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
                const errorData = await response.json();
                throw new Error(`Failed to fetch items: ${errorData.message}`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setError(`Error fetching items: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch categories: ${errorData.message}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError(`Error fetching categories: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async (categoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types/category/${categoryId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch types: ${errorData.message}`);
            }
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            setError(`Error fetching types: ${error.message}`);
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
                throw new Error(`Failed to add item: ${errorData.message}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error adding item: ${error.message}`);
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
                const errorData = await response.json();
                throw new Error(`Failed to update item: ${errorData.message}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error updating item: ${error.message}`);
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
                throw new Error(`Failed to delete item: ${errorData.message}`);
            }

            return true;
        } catch (error) {
            setError(`Error deleting item: ${error.message}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (categoryName) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create category: ${errorData.message}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error creating category: ${error.message}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addType = async (typeName, categoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: typeName, category_id: categoryId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create type: ${errorData.message}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error creating type: ${error.message}`);
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
        fetchCategories,
        addCategory,
        addType,
    };
};

export default useItems;
