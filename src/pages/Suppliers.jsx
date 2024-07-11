import React, { useState } from 'react';
import { useFetchSuppliers, useSupplierForm } from '../hooks';
import SuppliersCreate from './suppliers/SuppliersCreate';
import SuppliersEdit from './suppliers/SuppliersEdit';
import SupplierItems from './suppliers/SupplierItems'; // Import the new component
import Swal from 'sweetalert2';

const Suppliers = () => {
    const { suppliers, loading, error } = useFetchSuppliers();
    const { deleteSupplier } = useSupplierForm();
    const [isSuppliersCreateOpen, setIsSuppliersCreateOpen] = useState(false);
    const [isSuppliersEditOpen, setIsSuppliersEditOpen] = useState(false);
    const [isSupplierItemsOpen, setIsSupplierItemsOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const toggleSuppliersCreateModal = () => {
        setIsSuppliersCreateOpen(!isSuppliersCreateOpen);
        setIsSuppliersEditOpen(false);
        setIsSupplierItemsOpen(false);
    };

    const openSuppliersEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsSuppliersEditOpen(true);
        setIsSuppliersCreateOpen(false);
        setIsSupplierItemsOpen(false);
    };

    const openSupplierItemsModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsSupplierItemsOpen(true);
        setIsSuppliersCreateOpen(false);
        setIsSuppliersEditOpen(false);
    };

    const closeSuppliersEditModal = () => {
        setIsSuppliersEditOpen(false);
        setSelectedSupplier(null);
    };

    const closeSupplierItemsModal = () => {
        setIsSupplierItemsOpen(false);
        setSelectedSupplier(null);
    };

    const handleDeleteSupplier = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this supplier!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });

        if (confirmed.isConfirmed) {
            try {
                await deleteSupplier(id);
                Swal.fire('Deleted!', 'Supplier has been deleted.', 'success').then(() => {
                    window.location.reload();
                });
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete supplier.', 'error');
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
                    <h2 className="text-zinc-600">Total Suppliers</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">{suppliers.length}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleSuppliersCreateModal}>
                    Add Supplier
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th scope='col' className="px-6 py-3 border">Supplier Id</th>
                            <th scope='col' className="px-6 py-3 border">Names</th>
                            <th scope='col' className="px-6 py-3 border">Contact</th>
                            <th scope='col' className="px-6 py-3 border">Address</th>
                            <th scope='col' className="px-6 py-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr className="border-t" key={supplier.id}>
                                <td className="px-4 py-4 border">supplier-{supplier.id}</td>
                                <td className="px-10 py-4 border">{supplier.name}</td>
                                <td className="px-10 py-4 border">{supplier.contact}</td>
                                <td className="px-10 py-4 border">{supplier.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline ms-3"
                                        onClick={() => openSuppliersEditModal(supplier)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4m-6.622 7.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></g></svg>
                                    </button>
                                    <button
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDeleteSupplier(supplier.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"/></svg>
                                    </button>
                                    <button
                                        className="font-medium text-green-600 dark:text-green-500 hover:underline ms-3"
                                        onClick={() => openSupplierItemsModal(supplier)}
                                    >
                                        View Items
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isSuppliersCreateOpen && <SuppliersCreate isOpen={isSuppliersCreateOpen} onClose={toggleSuppliersCreateModal} />}
            {isSuppliersEditOpen && <SuppliersEdit isOpen={isSuppliersEditOpen} onClose={closeSuppliersEditModal} supplier={selectedSupplier} />}
            {isSupplierItemsOpen && <SupplierItems isOpen={isSupplierItemsOpen} onClose={closeSupplierItemsModal} supplier={selectedSupplier} />}
        </div>
    );
};

export default Suppliers;
