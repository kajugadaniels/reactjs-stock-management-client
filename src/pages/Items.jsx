import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CategoryCreate from './categories/CategoryCreate';
import ItemsCreate from './items/ItemsCreate';
import ItemsEdit from './items/ItemsEdit';
import TypesCreate from './types/TypesCreate';
import { useItems } from '../hooks';

const Items = () => {
    const { items, loading, error, fetchItems, deleteItem } = useItems();
    const [isItemsCreateOpen, setIsItemsCreateOpen] = useState(false);
    const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
    const [isTypesCreateOpen, setIsTypesCreateOpen] = useState(false);
    const [isItemsEditOpen, setIsItemsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchItems();
    }, []);

    const toggleItemsCreateModal = () => {
        setIsItemsCreateOpen(!isItemsCreateOpen);
        setIsItemsEditOpen(false);
        setIsCategoryCreateOpen(false);
        setIsTypesCreateOpen(false);
    };

    const toggleCategoryCreateModal = () => {
        setIsCategoryCreateOpen(!isCategoryCreateOpen);
        setIsItemsCreateOpen(false);
        setIsItemsEditOpen(false);
        setIsTypesCreateOpen(false);
    };

    const toggleTypesCreateModal = () => {
        setIsTypesCreateOpen(!isTypesCreateOpen);
        setIsItemsCreateOpen(false);
        setIsItemsEditOpen(false);
        setIsCategoryCreateOpen(false);
    };

    const openItemsEditModal = (item) => {
        setSelectedItem(item);
        setIsItemsEditOpen(true);
        setIsItemsCreateOpen(false);
        setIsCategoryCreateOpen(false);
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 mt-20">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4">
                {/* Other elements */}
            </div>

            <div className="flex flex-col items-center justify-start gap-4 mb-4 sm:flex-row">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleItemsCreateModal}>
                    Add Item
                </button>
                {/* 
                    <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleCategoryCreateModal}>
                        Add Category
                    </button>
                */}
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleTypesCreateModal}>
                    Add Types
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
                            <th scope='col' className="px-6 py-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr className="border-t" key={item.id}>
                                <td className="px-4 py-4 border">item-{item.id}</td>
                                <td className="px-10 py-4 border">{item.name}</td>
                                <td className="px-10 py-4 border">{item.category_name}</td>
                                <td className="px-10 py-4 border">{item.type_name}</td>
                                <td className="px-10 py-4 border">{item.capacity} {item.unit}</td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    <button
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline ms-3"
                                        onClick={() => openItemsEditModal(item)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4m-6.622 7.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></g></svg>
                                    </button>
                                    <button
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"/></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
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

            {isItemsCreateOpen && <ItemsCreate isOpen={isItemsCreateOpen} onClose={toggleItemsCreateModal} />}
            {isCategoryCreateOpen && <CategoryCreate isOpen={isCategoryCreateOpen} onClose={toggleCategoryCreateModal} />}
            {isTypesCreateOpen && <TypesCreate isOpen={isTypesCreateOpen} onClose={toggleTypesCreateModal} />}
            {isItemsEditOpen && <ItemsEdit isOpen={isItemsEditOpen} onClose={closeItemsEditModal} item={selectedItem} />}
        </div>
    );
};

export default Items;
