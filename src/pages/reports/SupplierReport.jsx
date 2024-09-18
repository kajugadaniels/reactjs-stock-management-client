import React, { useState, useEffect } from 'react';
import { useSupplier } from '../../hooks';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SupplierReport = ({ onClose }) => {
    const { suppliers, loading: suppliersLoading } = useSupplier();
    const [formData, setFormData] = useState({
        supplierId: '',
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (suppliers.length > 0) {
            setFormData(prevState => ({ ...prevState, supplierId: suppliers[0].id.toString() }));
        }
    }, [suppliers]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${formData.supplierId}?start_date=${formData.startDate}&end_date=${formData.endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            generatePDF(data.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
        setLoading(false);
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
        
        // Add a title
        doc.text('Supplier Report', 14, 20);

        // Prepare the headers and the data for the table
        const headers = [['Supplier Name', 'Item Name', 'Category', 'Type', 'Quantity', 'Date Added']];
        const tableData = data.map(item => [
            item.supplier_name,
            item.name,
            item.category_name,
            item.type_name,
            item.quantity || 'N/A',
            new Date(item.created_at).toLocaleDateString()
        ]);

        // Auto table to format the report in table format
        doc.autoTable({
            head: headers,
            body: tableData,
            startY: 30,
        });

        // Save the generated PDF
        doc.save(`supplier_report_${formData.supplierId}_${formData.startDate}_${formData.endDate}.pdf`);
    };

    if (suppliersLoading) {
        return <div>Loading suppliers...</div>;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h2 className="text-lg font-bold mb-4">Generate Supplier Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierId">
                            Supplier
                        </label>
                        <select
                            name="supplierId"
                            id="supplierId"
                            value={formData.supplierId}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate PDF Report'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierReport;
