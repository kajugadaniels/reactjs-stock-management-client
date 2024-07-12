import React, { useState } from 'react';
import CreateRequest from './request/CreateRequest';
import { Link } from 'react-router-dom';

const Stock = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div className="p-6">
            <div className="flex space-x-4 mb-6 ">
                <Link to='/products'>
                    <div className="bg-[rgba(78,189,214,255)] text-white p-4 rounded-lg h-70">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className='flex gap-3 ml-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="white" d="M6.75 1.5a.75.75 0 0 0 0 1.5h4.75A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5H6.75a.75.75 0 0 0 0 1.5h4.75a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm3.03 5.97l-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H1.75a.75.75 0 0 0 0 1.5h5.69L6.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06"></path></svg>
                                    <div className="text-lg font-bold">Stock In</div>
                                </div>
                                <div className='bg-white px-16 py-12'>
                                    <div className="text-4xl font-bold text-[rgba(78,189,214,255)]">29 T</div>
                                    <div className=" text-sm text-gray-500 pr-5 pt-10">230 Packeging</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Link>
                <div className="bg-purple-500 text-white pt-1 rounded-lg h-60">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className='flex p-5 gap-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="white" d="M5 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0zm7.703 10.95a1 1 0 0 0 0-1.415L10.167 13H20a1 1 0 1 0 0-2h-9.833l2.536-2.536a1 1 0 0 0-1.415-1.414l-4.242 4.243a1 1 0 0 0 0 1.414l4.242 4.243a1 1 0 0 0 1.415 0"></path></g></svg>
                                <div className="text-lg font-bold">Stock Out</div>
                            </div>
                            <div className='bg-[#ebfdfe] px-16 py-12 '>
                                <div className="text-4xl font-bold text-purple-500 ">79 T</div>
                                <div className="text-sm text-gray-500 pr-5 pt-10">100 Packeging</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="bg-blue-500 text-white rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className='flex gap-3 p-5'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="white" d="M16 420a28 28 0 0 0 28 28h424a28 28 0 0 0 28-28V208H16Zm480-296a28 28 0 0 0-28-28H212.84l-48-32H44a28 28 0 0 0-28 28v84h480Z"></path></svg>
                                <div className="text-lg font-bold">Request</div>
                            </div>
                            <div className='bg-white px-20 py-12 '>
                                <div className="text-4xl  text-blue-500 font-bold">12</div>
                                <div className="text-sm text-gray-500 pr-5 pt-10 ">12 Today</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-200 text-zinc-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className='flex gap-3 ml-6 p-5 text-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M5 22q-.825 0-1.412-.587T3 20V8.725q-.45-.275-.725-.712T2 7V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v3q0 .575-.275 1.013T21 8.724V20q0 .825-.587 1.413T19 22zM4 7h16V4H4zm5 7h6v-2H9z"></path></svg>
                                <div className="text-lg font-bold">View Inventory</div>
                            </div>
                            <div className='bg-white px-20 py-12'>
                                <div className="text-4xl text-orange-200 font-bold">Report</div>
                                <div className="text-sm text-gray-500 pr-5 pt-10">12 Today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
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
                <CreateRequest isOpen={isModalOpen} onClose={toggleModal} />
                <div className="flex items-center space-x-2">
                    <label>From</label>
                    <input type="date" className="border border-zinc-300 rounded-lg p-2" defaultValue="2024-02-09" />
                </div>
                <div className="flex items-center space-x-2">
                    <label>To</label>
                    <input type="date" className="border border-zinc-300 rounded-lg p-2" defaultValue="2024-02-20" />
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Today</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-zinc-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Check</th>
                            <th className="px-4 py-2 border-b">Req Id</th>
                            <th className="px-4 py-2 border-b">Requester</th>
                            <th className="px-4 py-2 border-b">Item</th>
                            <th className="px-4 py-2 border-b">Type</th>
                            <th className="px-4 py-2 border-b">Category</th>
                            <th className="px-4 py-2 border-b">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">REQ - 001</td>
                            <td className="px-4 py-2 border-b">Product Manager</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">Packeging</td>
                            <td className="px-4 py-2 border-b">500</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">REQ - 001</td>
                            <td className="px-4 py-2 border-b">Product Manager</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">Packeging</td>
                            <td className="px-4 py-2 border-b">500</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">REQ - 001</td>
                            <td className="px-4 py-2 border-b">Product Manager</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">Packeging</td>
                            <td className="px-4 py-2 border-b">500</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">REQ - 001</td>
                            <td className="px-4 py-2 border-b">Product Manager</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">Packeging</td>
                            <td className="px-4 py-2 border-b">500</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">REQ - 001</td>
                            <td className="px-4 py-2 border-b">Product Manager</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">Packeging</td>
                            <td className="px-4 py-2 border-b">500</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stock;