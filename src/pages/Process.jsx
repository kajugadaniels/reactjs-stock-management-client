import React, { useState } from 'react';
import FinishedCreate from './Process/FinishedCreate';
import PackegingCreate from './Process/PackegingCreate';

const Process = () => {
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
  const [isPackegingModalOpen, setIsPackegingModalOpen] = useState(false);
  const [status, setStatus] = useState('Pending');

  const toggleFinishedCreateModal = () => {
    setIsFinishedModalOpen(!isFinishedModalOpen);
  };

  const togglePackegingCreateModal = () => {
    setIsPackegingModalOpen(!isPackegingModalOpen);
  };

  const handleApprove = () => {
    setStatus('Approved');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Production Process, Finished Product, and Packaging</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg shadow">
          <h2 className="text-muted-foreground">Total Requested</h2>
          <p className="text-primary mt-8 text-3xl text-[#00BDD6]">600 T</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h2 className="text-muted-foreground">Total Pending</h2>
          <p className="text-primary mt-8 text-3xl text-[#00BDD6]">500 T</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h2 className="text-muted-foreground">Total Complete</h2>
          <p className="text-primary mt-8 text-3xl text-[#00BDD6]">5</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h2 className="text-muted-foreground">Total Remaining</h2>
          <p className="text-primary mt-8 text-3xl text-[#00BDD6]">2</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-zinc-200">
          <thead className="bg-zinc-100">
            <tr>
              <th className="py-2 px-4 border-b text-gray-500">Check</th>
              <th className="py-2 px-4 border-b text-gray-500">Production Process ID</th>
              <th className="py-2 px-4 border-b text-gray-500">Item Name</th>
              <th className="py-2 px-4 border-b text-gray-500">Stockout Item</th>
              <th className="py-2 px-4 border-b text-gray-500">Type</th>
              <th className="py-2 px-4 border-b text-gray-500">Quantity</th>
              <th className="py-2 px-4 border-b text-gray-500">Status</th>
              <th colSpan={3} className="py-2 px-4 border-b text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">
                <input type="checkbox" />
              </td>
              <td className="py-2 px-4 border-b">PRP - 001</td>
              <td className="py-2 px-4 border-b">Magic</td>
              <td className="py-2 px-4 border-b">Ibigori</td>
              <td className="py-2 px-4 border-b">Umweru</td>
              <td className="py-2 px-4 border-b">100</td>
              <td className="py-2 px-4 border-b">{status}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-[#f0b444] text-[#5d4213] px-4 py-2 rounded mt-4" onClick={handleApprove}>
                  Approve
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4" onClick={toggleFinishedCreateModal}>
                  Finished
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md mt-4" onClick={togglePackegingCreateModal}>
                  Packaging
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <FinishedCreate isOpen={isFinishedModalOpen} onClose={toggleFinishedCreateModal} />
      <PackegingCreate isOpen={isPackegingModalOpen} onClose={togglePackegingCreateModal} />
    </div>
  );
};

export default Process;
