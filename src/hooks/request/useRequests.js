import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const [errors, setErrors] = useState({});
    const [stockIns, setStockIns] = useState([]);
    const [items, setItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stockInsError, setStockInsError] = useState(null);
    const [itemsError, setItemsError] = useState(null);
    const [employeesError, setEmployeesError] = useState(null);

    const fetchRequests = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/requests`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.statusText}`);
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Fetch requests error:', error);
            setError('Failed to fetch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStockIns = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock-ins');
            }
            const data = await response.json();
            setStockIns(data);
        } catch (error) {
            setStockInsError(error.message);
            console.error('Error fetching stock-ins:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setItemsError(error.message);
            console.error('Error fetching items:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setEmployeesError(error.message);
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchStockIns();
        fetchItems();
        fetchEmployees();
    }, []);

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
        setErrors({});
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
                throw new Error(errorData.message || 'Validation Error');
            }

            const newRequest = await response.json();
            setRequests([...requests, newRequest]);
            return newRequest;
        } catch (error) {
            console.error('Error creating request:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e, onClose, fetchRequests) => {
        e.preventDefault();
        try {
            await addRequest();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request created successfully!',
            });
            onClose();
            fetchRequests();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create request',
            });
            console.error('Error creating request:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/requests/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete request');
                }
                setRequests(requests.filter(request => request.id !== id));
            } catch (error) {
                console.error('Error deleting request:', error);
            }
        }
    };

    return {
        requests,
        loading,
        error,
        formData,
        handleChange,
        addRequest,
        handleSubmit,
        errors,
        stockIns,
        items,
        employees,
        stockInsError,
        itemsError,
        employeesError,
        handleDelete,
        fetchRequests,
        fetchStockIns,  // Ensure these functions are returned
        fetchItems,
        fetchEmployees,
    };
};

export default useRequests;
