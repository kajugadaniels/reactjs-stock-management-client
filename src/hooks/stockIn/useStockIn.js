import { useState, useEffect } from 'react';

const useStockIn = (initialData = {}) => {
    const [stockIns, setStockIns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockIns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStockIns(data);
        } catch (error) {
            setError(error.message);
        } finally {
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
        } catch (error) {
            setError(error.message);
        } finally {
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
        } catch (error) {
            setError(error.message);
        } finally {
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
        } catch (error) {
            setError(error.message);
        } finally {
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
        } catch (error) {
            setError(error.message);
        } finally {
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
            return data.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addStockIn = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add stock in: ${errorData.message}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error adding stock in: ${error.message}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateStockIn = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update stock in: ${errorData.message}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(`Error updating stock in: ${error.message}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockIns();
        fetchSuppliers();
        fetchCategories();
        fetchTypes();
        fetchEmployees();
    }, []);

    return {
        stockIns,
        suppliers,
        categories,
        types,
        employees,
        formData,
        setFormData,
        loading,
        error,
        handleChange: (e) => setFormData({ ...formData, [e.target.name]: e.target.value }),
        addStockIn,
        updateStockIn,
        deleteStockIn,
        getItemsBySupplier,
        fetchStockIns,
    };
};

export default useStockIn;
