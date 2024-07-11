import { useState, useEffect } from 'react';

const useStockIn = (initialData = {}) => {
    const [stockIns, setStockIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form data
    const [formData, setFormData] = useState({
        item_id: '',
        quantity: '',
        registered_by: '',
        plaque: '',
        comment: '',
        batch: '',
        status: '',
        loading_payment_status: false,
        ...initialData
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchStockIns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock ins');
            }
            const data = await response.json();
            setStockIns(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch stock ins error:', error);
            setError('Failed to fetch stock ins. Please try again later.');
            setLoading(false);
        }
    };

    const addStockIn = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add stock in');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const updateStockIn = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error('Error updating product:', error);
            throw new Error(error.message || 'Failed to update product');
        }
    };

    const deleteStockIn = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete stock in');
            }

            return true;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        fetchStockIns();
    }, []);

    return { 
        stockIns, 
        loading, 
        error, 
        fetchStockIns, 
        formData, 
        setFormData, 
        handleChange, 
        addStockIn, 
        updateStockIn, 
        deleteStockIn 
    };
};

export default useStockIn;