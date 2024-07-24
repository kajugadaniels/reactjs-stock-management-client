import { useState, useEffect } from 'react';

const useItems = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({});
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
            console.error('Fetch items error:', error);
            setError('Failed to fetch items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

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
            setItems((prevItems) => [...prevItems, data]);
            return data;
        } catch (error) {
            console.error('Error adding item:', error);
            throw new Error(error.message || 'Failed to add item');
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
            setItems((prevItems) => prevItems.map((item) => (item.id === id ? data : item)));
            return data;
        } catch (error) {
            console.error('Error updating item:', error);
            throw new Error(error.message || 'Failed to update item');
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

            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw new Error(error.message || 'Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        formData,
        setFormData,
        loading,
        error,
        handleChange,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
    };
};

export default useItems;
