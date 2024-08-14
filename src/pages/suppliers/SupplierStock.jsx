import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SupplierStock = ({ isOpen, onClose }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('pdf');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            Swal.fire('Error', 'Failed to fetch suppliers', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-ins`, {
                params: {
                    supplier_id: selectedSupplier,
                    startDate: startDate,
                    endDate: endDate
                }
            });
            
            if (reportType === 'pdf') {
                generatePDF(response.data);
            } else {
                generateCSV(response.data);
            }

            Swal.fire('Success', 'Report generated and downloaded successfully', 'success');
        } catch (error) {
            console.error('Error generating report:', error);
            Swal.fire('Error', 'Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text('Supplier Stock Report', 14, 15);
        
        const tableColumn = ["Date", "Item", "Category", "Type", "Quantity", "Initial Qty", "Plate Number", "Batch Number"];
        const tableRows = data.map(item => [
            item.date,
            item.item.name,
            item.item.category.name,
            item.item.type.name,
            item.quantity,
            item.init_qty,
            item.plate_number,
            item.batch_number
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save('supplier_stock_report.pdf');
    };

    const generateCSV = (data) => {
        const headers = ['Date', 'Item', 'Category', 'Type', 'Quantity', 'Initial Quantity', 'Plate Number', 'Batch Number'];
        const rows = data.map(item => [
            item.date,
            item.item.name,
            item.item.category.name,
            item.item.type.name,
            item.quantity,
            item.init_qty,
            item.plate_number,
            item.batch_number
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'supplier_stock_report.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">Supplier Stock Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="supplier">
                            Supplier
                        </label>
                        <select
                            id="supplier"
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="startDate">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="endDate">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Report Type
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="pdf"
                                    checked={reportType === 'pdf'}
                                    onChange={() => setReportType('pdf')}
                                    className="w-4 h-4 text-blue-600 form-radio"
                                />
                                <span className="ml-2">PDF</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="csv"
                                    checked={reportType === 'csv'}
                                    onChange={() => setReportType('csv')}
                                    className="w-4 h-4 text-blue-600 form-radio"
                                />
                                <span className="ml-2">CSV</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierStock;