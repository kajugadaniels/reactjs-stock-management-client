import { useState, useEffect } from 'react';

const useStockIn = (initialFormData = {}) => {
    const [stockIns, setStockIns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [items, setItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStockIns();
        fetchSuppliers();
        fetchCategories();
        fetchTypes();
        fetchEmployees();
    }, []);

    const fetchStockIns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStockIns(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setSuppliers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const deleteStockIn = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            throw new Error('Failed to delete stock in record');
        }
    };

    const getItemsBySupplier = async (supplierId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplierId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items for supplier');
            }
            const data = await response.json();
            setLoading(false);
            return data.data;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const addStockIn = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create stock in record');
            }

            await fetchStockIns(); // Reload data after successful creation
            setLoading(false);
            return true;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const updateStockIn = async (id, formData) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update stock in record');
            }

            await fetchStockIns(); // Reload data after successful update
            setLoading(false);
            return true;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    return {
        stockIns,
        suppliers,
        categories,
        types,
        items,
        employees,
        formData,
        setFormData,
        loading,
        error,
        fetchStockIns,
        deleteStockIn,
        getItemsBySupplier,
        addStockIn,
        updateStockIn,
    };
};

export default useStockIn;
