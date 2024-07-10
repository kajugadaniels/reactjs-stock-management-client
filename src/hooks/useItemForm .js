import { useState, useEffect } from 'react';

const useItemForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        type_id: '',
        capacity: '',
        unit: '',
        supplier_id: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const fetchTypesByCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/types?category_id=${categoryId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'category_id') {
            fetchTypesByCategory(value);
        }
    };

    const addItem = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create item');
            }

            const data = await response.json();
            setLoading(false);
            return data; // Return the data object if needed
        } catch (error) {
            setLoading(false);
            console.error('Error creating item:', error);
            throw new Error(error.message || 'Failed to create item');
        }
    };

    return {
        formData,
        loading,
        handleChange,
        addItem,
        categories,
        types,
    };
};

export default useItemForm;
