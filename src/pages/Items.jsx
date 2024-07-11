import React, { useState, useEffect } from 'react';
import ItemsCreate from './items/ItemsCreate';
import ItemsEdit from './items/ItemsEdit';
import Swal from 'sweetalert2';
import { useFetchItems, useItemForm } from '../hooks';

const Items = () => {
    const { items, loading, error, fetchItems } = useFetchItems();
    const { deleteItem } = useItemForm();
    const [isItemsCreateOpen, setIsItemsCreateOpen] = useState(false);
    const [isItemsEditOpen, setIsItemsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const toggleItemsCreateModal = () => {
        setIsItemsCreateOpen(!isItemsCreateOpen);
        setIsItemsEditOpen(false);
    };

    const openItemsEditModal = (item) => {
        setSelectedItem(item);
        setIsItemsEditOpen(true);
        setIsItemsCreateOpen(false);
    };

    const closeItemsEditModal = () => {
        setIsItemsEditOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteItem = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });

        if (confirmed.isConfirmed) {
            try {
                await deleteItem(id);
                Swal.fire('Deleted!', 'Item has been deleted.', 'success').then(() => {
                    fetchItems();
                });
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete item.', 'error');
            }
        }
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
                    <h2 className="text-zinc-600">Total Items</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">{items.length}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleItemsCreateModal}>
                    Add Item
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th scope='col' className="px-6 py-3 border">Item Id</th>
                            <th scope='col' className="px-6 py-3 border">Name</th>
                            <th scope='col' className="px-6 py-3 border">Category</th>
                            <th scope='col' className="px-6 py-3 border">Type</th>
                            <th scope='col' className="px-6 py-3 border">Capacity</th>
                            <th scope='col' className="px-6 py-3 border">Supplier Name</th>
                            <th scope='col' className="px-6 py-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr className="border-t" key={item.id}>
                                <td className="px-4 py-4 border">item-{item.id}</td>
                                <td className="px-10 py-4 border">{item.name}</td>
                                <td className="px-10 py-4 border">{item.category_name}</td>
                                <td className="px-10 py-4 border">{item.type_name}</td>
                                <td className="px-10 py-4 border">{item.capacity} {item.unit}</td>
                                <td className="px-10 py-4 border">{item.supplier_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline ms-3"
                                        onClick={() => openItemsEditModal(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isItemsCreateOpen && <ItemsCreate isOpen={isItemsCreateOpen} onClose={toggleItemsCreateModal} />}
            {isItemsEditOpen && <ItemsEdit isOpen={isItemsEditOpen} onClose={closeItemsEditModal} item={selectedItem} />}
        </div>
    );
};

export default Items;