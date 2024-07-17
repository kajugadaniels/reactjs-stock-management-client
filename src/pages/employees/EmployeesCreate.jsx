import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function EmployeesCreate({ isOpen, onClose }) {

    
    
    const [formData, setFormData] = useState({
        name: '',
        contact: '', 
        position: '' 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/employees', requestOptions);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    console.log('Server Response:', data);
                    Swal.fire({
                        title: 'Success!',
                        text: 'Employee added successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    console.log('Server response was not JSON:', await response.text());
                    throw new Error('Server response was not in JSON format');
                }
            } else {
                throw new Error('Server responded with status code: ' + response.status);
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Error submitting form: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        onClose(); 
    };
    
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Employee</h3>
                    <div className="mt-2 px-7 py-3">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                                placeholder="Name"
                                required
                            />
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                                placeholder="Contact (Phone Number)"
                                required
                            />
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                                placeholder="Position"
                                required
                            />
                            <div className="flex justify-between items-center">
                                <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none">
                                    Cancel
                                </button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
