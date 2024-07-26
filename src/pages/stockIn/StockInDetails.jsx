import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';

const StockInDetails = ({ isOpen, onClose, stockInId }) => {
    const [stockInDetails, setStockInDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (stockInId) {
            fetchStockInDetails();
        }
    }, [stockInId]);

    const fetchStockInDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${stockInId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock in details');
            }
            const data = await response.json();
            setStockInDetails(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const downloadInvoice = () => {
        const input = document.getElementById('invoice');
        const scale = window.devicePixelRatio; 
    
        const downloadButton = document.getElementById('download-button');
        downloadButton.style.visibility = 'hidden'; 
    
        html2canvas(input, {
            scale: scale,
            useCORS: true,
            logging: true,
            width: input.offsetWidth,
            height: input.offsetHeight
        }).then((canvas) => {
            const imgWidth = 210; 
            const pageHeight = 295; 
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
    
            const pdf = new jsPDF('p', 'mm', 'a4');
            let position = 0;
    
            // Add image to PDF
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save('invoice.pdf');
            downloadButton.style.visibility = 'visible'; 
        });
    };
    
    
    
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="float-right mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Jabana Maize Mailing</h2>
                    <h3 className="text-xl font-semibold text-gray-600">Stock In Details</h3>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    stockInDetails && (
                        <div id="invoice" className="p-4 border rounded-lg">
                            <div className="mb-8">
                                <h4 className="mb-2 text-lg font-semibold text-indigo-600">Supplier Information</h4>
                                <table className="min-w-full bg-white">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Name</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Contact</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.contact}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Address</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mb-8">
                                <h4 className="mb-2 text-lg font-semibold text-indigo-600">Stock In Details</h4>
                                <table className="min-w-full bg-white">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">ID</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.id}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Item</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Category</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.category.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Type</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.type.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Quantity</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.quantity}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Plate Number</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.plate_number}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Batch Number</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.batch_number}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Date</td>
                                            <td className="px-4 py-2 text-gray-600 border">{new Date(stockInDetails.date).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Loading Payment Status</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.loading_payment_status ? 'Paid' : 'Unpaid'}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Registered By</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.employee.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700 border">Comment</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.comment || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 text-right">
                                <p className="text-sm">Jabana Maize Mailing</p>
                                <p className="text-sm">Contact: +250 123 456 789</p>
                                <p className="text-sm">Address: Kigali, Rwanda</p>
                            </div>
                            <div className="mt-4 text-right">
                                <button
                                    id="download-button"  // Add this id here
                                    onClick={downloadInvoice}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Download as PDF
                                </button>
                            </div>

                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default StockInDetails;
