import React from 'react';

const PackegingCreate = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="max-w-md mx-auto bg-white p-10 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-zinc-800">Packaging</h2>
        <p className="text-zinc-600 mb-4">Packaging Process Record</p>

        <form className="w-96">
          <div className="mb-4">
            <label className="block text-zinc-700 font-medium mb-2">Quantity</label>
            <input type="text" placeholder="Input quantity" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 font-medium mb-2">Finished Product</label>
            <select className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Select finished product</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 font-medium mb-2">Select Item</label>
            <select className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Select item</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 font-medium mb-2">Number of Packages</label>
            <input type="text" placeholder="Input number of packages" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-700 font-medium mb-2">Status</label>
            <select className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Select status</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" className="text-zinc-600" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-[#00BDD6] text-white px-4 py-2 rounded-md hover:bg-green-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackegingCreate;
