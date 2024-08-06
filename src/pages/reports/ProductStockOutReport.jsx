import React, { useState } from 'react';

const ProductStockOutReport = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product-stock-out/?start_date=${formData.startDate}&end_date=${formData.endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            if (data && data.length > 0) {
                generateCSV(data);
            } else {
                console.error('No data received or empty data array');
                // Show an error message to the user here if needed
            }
        } catch (error) {
            console.error('Error generating report:', error);
            // Show an error message to the user here if needed
        }
        setLoading(false);
    };

    const generateCSV = (data) => {
        const headers = ['Stock Out ID', 'Item Name', 'Quantity', 'Location', 'Client Name', 'Plate Number', 'Date', 'Payment Status'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.id,
                item.item_name,
                item.quantity,
                item.location,
                item.client_name,
                item.plate,
                item.created_at,
                item.loading_payment_status ? 'Paid' : 'Not Paid'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `product_stock_out_report_${formData.startDate}_${formData.endDate}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h2 className="text-lg font-bold mb-4">Generate Product Stock Out Report</h2>
                <form onSubmit={handleSubmit}>
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
                            {loading ? 'Generating...' : 'Generate CSV Report'}
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

export default ProductStockOutReport;
