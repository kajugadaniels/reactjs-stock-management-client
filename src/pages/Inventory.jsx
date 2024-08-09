import React, { useState, useEffect } from 'react';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/inventory`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setInventory(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Failed to fetch inventory data');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentInventory = inventory.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(inventory.length / rowsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen p-4 bg-gray-100 md:p-8 mt-20">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800 md:text-3xl">Inventory: Jabana Industry</h1>
            <p className="mb-6 text-[#93d3db]">Inventory Report</p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Item</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Category</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Type</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Stock In</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Stock Out</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Remaining</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentInventory.map((item, index) => (
                            <tr key={item.id} className="transition duration-200 ease-in-out hover:bg-gray-100">
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.name}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.category}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.type}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.stockIn}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.stockOut}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.remaining}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{item.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Inventory;