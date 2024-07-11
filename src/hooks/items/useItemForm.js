import { useState } from 'react';

const useItemForm = (initialData = {}) => {
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);

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
                throw new Error('Failed to add item');
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

    const deleteItem = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
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
        formData,
        setFormData,
        loading,
        handleChange,
        addItem,
        updateItem,
        deleteItem,
    };
};

export default useItemForm;
