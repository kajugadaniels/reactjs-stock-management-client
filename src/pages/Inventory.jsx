import React, { useState } from 'react';

const Inventory = () => {
    const [selectedStock, setSelectedStock] = useState("Current Stock");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handleStockChange = (event) => {
        setSelectedStock(event.target.value);
        setCurrentPage(1);
    };

    const currentStockData = [
        { item: 'Ibigori', type: 'Umweru', stockIn: '10 T', stockOut: '9 T', remaining: '1 T', percentage: '90 %' },
        { item: 'Ibigori', type: 'Umuhondo', stockIn: '5 T', stockOut: '3 T', remaining: '2 T', percentage: '80 %' },
        { item: 'Imifuka', type: 'SN 5 kg', stockIn: '1000', stockOut: '800', remaining: '200', percentage: '70 %' },
        { item: 'Imifuka', type: 'Magic 25 kg', stockIn: '300', stockOut: '200', remaining: '100', percentage: '20 %' },
        { item: 'Imifuka', type: 'Jabana 5 kg', stockIn: '400', stockOut: '400', remaining: '0', percentage: '0 %' },

    ];

    const productStockData = [
        { item: 'Umuceri', type: 'Umweru', stockIn: '15 T', stockOut: '10 T', remaining: '5 T', percentage: '67 %' },
        { item: 'Umunyu', type: 'Icyatsi', stockIn: '8 T', stockOut: '4 T', remaining: '4 T', percentage: '50 %' },
        { item: 'Amavuta', type: 'Blue Band', stockIn: '500', stockOut: '300', remaining: '200', percentage: '40 %' },
        { item: 'Isukari', type: 'Brown', stockIn: '700', stockOut: '500', remaining: '200', percentage: '28 %' },
        { item: 'Icyayi', type: 'Green Tea', stockIn: '600', stockOut: '600', remaining: '0', percentage: '0 %' },
    ];

    const dataToDisplay = selectedStock === 'Current Stock' ? currentStockData : productStockData;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = dataToDisplay.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(dataToDisplay.length / rowsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 flex gap-3">
                Inventory:
                <div className="mb-6 flex gap-2">
                    <h2 className="text-lg font-semibold typing-demo">Jabana Industry</h2>
                    <p className="text-[#93d3db] text-muted-foreground typing-demo">Inventory Report</p>
                </div>
            </h1>
            <div className="flex items-center ml-60">
                <label className="block">
                    <span className="text-zinc-700">Select Stock</span>
                    <select
                        className="mt-1 block w-full p-2 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={selectedStock}
                        onChange={handleStockChange}
                    >
                        <option className='text-gray-500'>Select Stock</option>
                        <option>Current Stock</option>
                        <option>Product Stock</option>
                    </select>
                </label>
            </div>
            <div className="flex items-center ml-40 gap-20 mb-6">
                <label className="block">
                    <span className="text-zinc-700">From</span>
                    <input type="date" className="mt-1 block w-full py-4 px-6 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </label>
                <label className="block">
                    <span className="text-zinc-700">To</span>
                    <input type="date" className="mt-1 block w-full py-4 px-6 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </label>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock Out</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Remaining</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200">
                        {currentRows.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-orange-100' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">{row.item}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.stockIn}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.stockOut}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.remaining}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-[#00BDD6] text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Inventory;
