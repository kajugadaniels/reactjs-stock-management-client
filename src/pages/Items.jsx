import React, { useState } from 'react';
import { ItemCreate } from './items/';
import { useFetchItems } from '../hooks';

const Items = () => {
    const { items, loading, error } = useFetchItems();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-4">
                <div className="p-4 text-center text-gray-400 bg-white rounded-lg shadow">
                    <h2 className="text-lg">Total Item</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">6</p>
                </div>
                <div className="p-4 text-center text-gray-400 bg-white rounded-lg shadow">
                    <h2 className="text-lg">Total Category</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">2</p>
                </div>
                <div className="p-4 text-center text-gray-400 bg-white rounded-lg shadow">
                    <h2 className="text-lg">Total Packaging</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">5</p>
                </div>
                <div className="p-4 text-center text-gray-400 bg-white rounded-lg shadow">
                    <h2 className="text-lg">Total Row Materials</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">2</p>
                </div>
            </div>
            <button
                onClick={toggleModal}
                className="mb-4 px-4 py-2 text-sm bg-[#00BDD6] text-white rounded-lg hover:bg-primary/80"
            >
                <div className='flex items-center'>
                    <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                    </span>
                    Add New Item
                </div>
            </button>
            <ItemCreate isOpen={isModalOpen} onClose={toggleModal} />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr className='text-gray-400'>
                            <th className="px-4 py-2 font-normal border">Check</th>
                            <th className="px-4 py-2 font-normal border">Id</th>
                            <th className="px-4 py-2 font-normal border">Name</th>
                            <th className="px-4 py-2 font-normal border">Category</th>
                            <th className="px-4 py-2 font-normal border">Type</th>
                            <th className="px-4 py-2 font-normal border">Capacity</th>
                            <th className="px-4 py-2 font-normal border">Supplier</th>
                            <th className="px-4 py-2 font-normal border">Edit</th>
                            <th className="px-4 py-2 font-normal border">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="text-sm font-normal">
                                <td className="px-4 py-2 text-center border"><input type="checkbox" /></td>
                                <td className="px-4 py-2 font-normal border">{item.id}</td>
                                <td className="px-4 py-2 border">{item.name}</td>
                                <td className="px-4 py-2 border">
                                    <span className="bg-[#EBFDFF] text-[#00BDD6] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-[#EBFDFF] dark:text-[#00BDD6]">{item.category_name}</span>
                                </td>
                                <td className="px-4 py-2 border">{item.type_name}</td>
                                <td className="px-4 py-2 border">{item.capacity} {item.unit}</td>
                                <td className="px-4 py-2 border">{item.supplier_name}</td>
                                <td className="px-4 py-2 text-center border">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 12 12"><path fill="#5a4e4e" d="M10.443 1.56a1.914 1.914 0 0 0-2.707 0l-.55.551a.5.5 0 0 0-.075.074l-5.46 5.461a.5.5 0 0 0-.137.255l-.504 2.5a.5.5 0 0 0 .588.59l2.504-.5a.5.5 0 0 0 .255-.137l6.086-6.086a1.914 1.914 0 0 0 0-2.707M7.502 3.21l1.293 1.293L3.757 9.54l-1.618.324l.325-1.616zm2 .586L8.209 2.502l.234-.234A.914.914 0 1 1 9.736 3.56z"></path></svg>
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 12 12"><path fill="#5a4e4e" d="M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11z"></path></svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Items;
