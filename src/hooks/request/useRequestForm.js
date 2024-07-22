import { useState } from 'react';

const useRequestForm = () => {
    const [formData, setFormData] = useState({
        item_id: '',
        contact_person_id: '',
        requester_name: '',
        request_from: '',
        status: '',
        request_for_id: '',
        quantity: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // New state for validation errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = ['item_id', 'contact_person_id', 'request_for_id', 'quantity'].includes(name) ? parseInt(value, 10) || '' : value;
        setFormData({
            ...formData,
            [name]: parsedValue
        });
    };

    const addRequest = async () => {
        setLoading(true);
        setErrors({}); // Clear previous errors
        try {
            console.log('Form Data:', formData);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                setErrors(errorData.errors || {}); // Set validation errors
                throw new Error(errorData.message || 'Validation Error');
            }

            const newRequest = await response.json();
            return newRequest;
        } catch (error) {
            console.error('Error creating request:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, addRequest, loading, errors };
};

export default useRequestForm;
