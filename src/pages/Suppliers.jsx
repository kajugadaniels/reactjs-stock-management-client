import React, { useState } from 'react';
import { useFetchSuppliers } from '../hooks';
import SuppliersCreate from './suppliers/SuppliersCreate';

const Suppliers = () => {
    const { suppliers, loading, error } = useFetchSuppliers();  // Add parentheses here

    const [isSuppliersCreateOpen, setIsSuppliersCreateOpen] = useState(false);
    const [isSuppliersItemsOpen, setIsSuppliersItemsOpen] = useState(false);

    const toggleSuppliersCreateModal = () => {
        setIsSuppliersCreateOpen(!isSuppliersCreateOpen);
        setIsSuppliersItemsOpen(false);
    };

    const toggleSuppliersItemsModal = () => {
        setIsSuppliersItemsOpen(!isSuppliersItemsOpen);
        setIsSuppliersCreateOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="p-4 text-center bg-white rounded-lg shadow">
                    <h2 className="text-zinc-600">Total Suppliers</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">6</p>
                </div>
                <div className="p-4 text-center bg-white rounded-lg shadow">
                    <h2 className="text-zinc-600">Total Items</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">2</p>
                </div>
                <div className="p-4 text-center bg-white rounded-lg shadow">
                    <h2 className="text-zinc-600">Total Packaging</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">23,000</p>
                </div>
                <div className="p-4 text-center bg-white rounded-lg shadow">
                    <h2 className="text-zinc-600">Total Row Materials</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">5</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <div className='flex mt-6'>
                            <button
                                onClick={toggleSuppliersCreateModal}
                                className="mb-6 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
                            >
                                <div className='flex items-center'>
                                    <span className="mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                                    </span>
                                    Add Supplier
                                </div>
                            </button>
                            {isSuppliersCreateOpen && <SuppliersCreate isOpen={isSuppliersCreateOpen} onClose={toggleSuppliersCreateModal} />}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr>
                                    <th className="px-4 py-4 border">Supplier Id</th>
                                    <th className="px-4 py-4 border">Names</th>
                                    <th className="px-4 py-4 border">Contact</th>
                                    <th className="px-4 py-4 border">Address</th>
                                    <th className="px-4 py-4 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr className="border-t" key={supplier.id}>
                                        <td className="px-4 py-4 border">{supplier.id}</td>
                                        <td className="px-10 py-4 border">{supplier.name}</td>
                                        <td className="px-10 py-4 border">{supplier.contact}</td>
                                        <td className="px-10 py-4 border">{supplier.address}</td>
                                        <td className='px-1'>
                                            <div className='flex justify-between mx-10'>
                                                <button className="px-4 py-2 text-white bg-blue-500 rounded-lg">Edit</button>
                                                <button className="px-4 py-2 text-white bg-red-500 rounded-lg">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
