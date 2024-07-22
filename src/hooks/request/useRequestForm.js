import { useState } from 'react';

const useRequestForm = () => {
    const [formData, setFormData] = useState({
        item_id: '',
        contact_id: '',
        requester: '',
        request_from: '',
        status: '',
        request_for: '',
        qty: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert specific fields to integers if necessary
        const parsedValue = ['item_id', 'contact_id', 'request_for', 'qty'].includes(name) ? parseInt(value, 10) || '' : value;
        setFormData({
            ...formData,
            [name]: parsedValue
        });
    };

    const addRequest = async () => {
        setLoading(true);
        try {
            console.log('Form Data:', formData); // Log formData to check its content
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend Error:', errorData); // Log error data for more information
                throw new Error(errorData.message || 'Validation Error');
            }

            const newRequest = await response.json();
            return newRequest;
        } catch (error) {
            console.error('Error creating request:', error); // Log error to console
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, addRequest, loading };
};

export default useRequestForm;
