import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockInDetails = ({ isOpen, onClose, stockInId }) => {
    const [stockInDetails, setStockInDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (stockInId) {
            fetchStockInDetails();
        }
    }, [stockInId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
            setUserRole(user.role);
        }

        if (stockInId) {
            fetchStockInDetails();
        }
    }, [stockInId]);

    const fetchStockInDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-ins/${stockInId}`, {
                timeout: 5000, // Set a timeout of 5 seconds
            });
            setStockInDetails(response.data);
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

    const canViewRegisteredBy = !['Production', 'Storekeeper'].includes(userRole);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-6xl p-6 bg-white rounded-md shadow-md">
                <button onClick={onClose} className="float-right mb-4 text-red-500 hover:underline">
                    Close
                </button>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Jabana Maize Milling</h2>
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
                                <h4 className="mb-2 text-lg font-semibold text-[#00BDD6]">Supplier Information</h4>
                                <span>{new Date(stockInDetails.date).toLocaleDateString()}</span>
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-gray-700 border">Name</th>
                                            <th className="px-4 py-2 text-left text-gray-700 border">Contact</th>
                                            <th className="px-4 py-2 text-left text-gray-700 border">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.name}</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.contact}</td>
                                            <td className="px-4 py-2 text-gray-600 border">{stockInDetails.supplier.address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mb-8">
                                <h4 className="mb-2 text-lg font-semibold text-[#00BDD6]">Stock In Details</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-gray-700 border">ID</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Item</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Category</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Type</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Quantity</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Package Qty</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Plate Number</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Batch Number</th>
                                                {canViewRegisteredBy && (
                                                    <th className="px-4 py-2 text-left text-gray-700 border">Registered By</th>
                                                )}
                                                <th className="px-4 py-2 text-left text-gray-700 border">Payment Status</th>
                                                <th className="px-4 py-2 text-left text-gray-700 border">Comment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.id}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.name}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.category.name}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.item.type.name}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.init_qty}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.package_qty}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.plate_number}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.batch_number}</td>
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.loading_payment_status ? 'Paid' : 'Unpaid'}</td>
                                                {canViewRegisteredBy && (
                                                    <td className="px-4 py-2 text-gray-600 border">{stockInDetails.registered_by.name}</td>
                                                )}
                                                <td className="px-4 py-2 text-gray-600 border">{stockInDetails.comment || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-8 text-right">
                                <p className="text-sm">Jabana Maize Milling</p>
                                <p className="text-sm">Contact: +250 123 456 789</p>
                                <p className="text-sm">Address: Kigali, Rwanda</p>
                            </div>
                            <div className="mt-4 text-right">
                                <button
                                    id="download-button"
                                    onClick={downloadInvoice}
                                    className={`px-6 py-3 font-semibold text-white bg-[#00BDD6] rounded-md hover:bg-[#48b0c0] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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