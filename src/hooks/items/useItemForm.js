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
    
            const responseText = await response.text();
    
            if (!response.ok) {
                console.error('Failed to update item:', response.status, response.statusText);
                console.error('Response headers:', Array.from(response.headers.entries()));
                console.error('Response text:', responseText);
                let errorMessage = 'Failed to update item';
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                }
                throw new Error(errorMessage);
            }
    
            const data = JSON.parse(responseText);
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
