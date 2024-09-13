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
    
            console.log('API Response:', response.data);
    
            if (reportType === 'pdf') {
                generatePDF(response.data);
            }
    
            Swal.fire('Success', 'Report generated successfully', 'success');
        } catch (error) {
            console.error('Error generating report:', error);
            Swal.fire('Error', `Failed to generate report: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (data) => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            // Add title
            doc.setFontSize(18);
            doc.text('Supplier Stock Report', pageWidth / 2, 15, { align: 'center' });

            // Add supplier information
            const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
            doc.setFontSize(12);
            doc.text(`Supplier: ${supplier?.name || 'N/A'}`, 14, 25);
            doc.text(`Contact: ${supplier?.contact || 'N/A'}`, 14, 31);
            doc.text(`Address: ${supplier?.address || 'N/A'}`, 14, 37);

            // Add date range
            doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 45);

            // Group data by date, batch_number, and plate_number
            const groupedData = data.reduce((acc, item) => {
                const key = `${item.date}-${item.batch_number}-${item.plate_number}`;
                if (!acc[key]) {
                    acc[key] = {
                        date: item.date,
                        plate_number: item.plate_number,
                        items: []
                    };
                }
                acc[key].items.push(item);
                return acc;
            }, {});

            let yPos = 55;
            Object.values(groupedData).forEach((group, index) => {
                // Add group header
                doc.setFontSize(10);
                doc.text(`Date: ${group.date || 'N/A'}`, 14, yPos);
                doc.text(`Plate Number: ${group.plate_number || 'N/A'}`, 80, yPos + 5);

                yPos += 15;

                // Add items table
                const tableColumn = ["Time", "Item", "Category", "Type", "Quantity", "Batch Number", "Initial Qty", "Registered By"];
                const tableRows = group.items.map(item => [
                    new Date(item.created_at).toLocaleTimeString(),
                    item.item?.name || 'N/A',
                    item.item?.category?.name || 'N/A',
                    item.item?.type?.name || 'N/A',
                    item.quantity || 'N/A',
                    item.batch_number || 'N/A',
                    item.init_qty || 'N/A',
                    item.employee?.name || 'N/A'
                ]);

                doc.autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: yPos,
                    styles: { fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 20 },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 20 },
                        3: { cellWidth: 25 },
                        4: { cellWidth: 20 },
                        5: { cellWidth: 25 },
                        6: { cellWidth: 20 },
                        7: { cellWidth: 20 }
                    }
                });

                yPos = doc.lastAutoTable.finalY + 10;

                // Add page break if necessary
                if (yPos > 270 && index < Object.values(groupedData).length - 1) {
                    doc.addPage();
                    yPos = 20;
                }
            });

            const pdfData = doc.output('datauristring'); // Generate PDF as data URI

            // Open the PDF in a new tab
            const newTab = window.open();
            newTab.document.write(`
                <html>
                <head><title>Supplier Stock Report</title></head>
                <body>
                    <iframe src="${pdfData}" style="width:100%; height:100%;" frameborder="0"></iframe>
                    <button onclick="downloadPDF()">Download as PDF</button>
                    <script>
                        function downloadPDF() {
                            const link = document.createElement('a');
                            link.href = "${pdfData}";
                            link.download = "supplier_stock_report.pdf";
                            link.click();
                        }
                    </script>
                </body>
                </html>
            `);
        } catch (error) {
            console.error('Error in generatePDF:', error);
            throw error; // Re-throw the error to be caught in handleSubmit
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
