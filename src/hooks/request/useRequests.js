import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        contact_person_id: '',
        requester_name: '',
        request_from: '',
        status: 'Pending',
        note: '',
        request_for_id: ''
    });
    const [errors, setErrors] = useState({});
    const [stockIns, setStockIns] = useState([]);
    const [finishedItems, setFinishedItems] = useState([]);
    const [rawMaterialItems, setRawMaterialItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stockInsError, setStockInsError] = useState(null);
    const [finishedItemsError, setFinishedItemsError] = useState(null);
    const [rawMaterialItemsError, setRawMaterialItemsError] = useState(null);
    const [employeesError, setEmployeesError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_API_URL}/requests`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.statusText}`);
            }
            const data = await response.json();
            
            const processedRequests = data.map(request => ({
                ...request,
                contact_person: request.contact_person || { name: 'Unknown Person' },
                request_for: request.request_for || { name: 'Unknown Item' },
                items: request.items || [],
            }));

            setRequests(processedRequests);
        } catch (error) {
            console.error('Fetch requests error:', error);
            setError('Failed to fetch requests. Please try again.');
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
            setStockIns(data.filter(stockIn => stockIn.quantity > 0));
        } catch (error) {
            setStockInsError(error.message);
            console.error('Error fetching stock-ins:', error);
        }
    };

    const fetchFinishedItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch finished items');
            }
            const data = await response.json();
            setFinishedItems(data);
        } catch (error) {
            setFinishedItemsError(error.message);
            console.error('Error fetching finished items:', error);
        }
    };

    const fetchRawMaterialItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/raw-material-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch raw material items');
            }
            const data = await response.json();
            setRawMaterialItems(data.filter(item => item.quantity > 0));
        } catch (error) {
            setRawMaterialItemsError(error.message);
            console.error('Error fetching raw material items:', error);
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

    const fetchRequestDetails = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch request details');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch request details error:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchStockIns();
        fetchFinishedItems();
        fetchRawMaterialItems();
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const addRequest = async (requestData) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
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
        setFormData,
        handleChange,
        addRequest,
        errors,
        stockIns,
        finishedItems,
        rawMaterialItems,
        employees,
        stockInsError,
        finishedItemsError,
        rawMaterialItemsError,
        employeesError,
        handleDelete,
        fetchRequests,
        fetchStockIns,
        fetchFinishedItems,
        fetchRawMaterialItems,
        fetchEmployees,
        fetchRequestDetails,
    };
};

export default useRequests;