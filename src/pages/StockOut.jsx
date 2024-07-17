import React, { useState } from 'react';
import StockOutCreate from './Stockout/StockOutCreate';
import { Link } from 'react-router-dom';

const StockOut = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStockOutCreateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4">
       <Link to='/TotalRowMaterialOut'>
       <div className="bg-card p-4 rounded-lg shadow-md text-center">
          <h2 className="text-muted-foreground">Total Row Material</h2>
          <p className="text-primary text-3xl text-[#00BDD6]">600 T</p>
        </div>
       </Link>
        <Link to="/">
        <div className="bg-card p-4 rounded-lg shadow-md text-center">
          <h2 className="text-muted-foreground">Total Packaging</h2>
          <p className="text-primary text-3xl text-[#00BDD6]">500</p>
        </div>
        </Link>
        <div className="bg-card p-4 rounded-lg shadow-md text-center">
          <h2 className="text-muted-foreground">Total Packaging Out</h2>
          <p className="text-primary text-3xl text-[#00BDD6]">5</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-md text-center">
          <h2 className="text-muted-foreground">Total Row Materials Out</h2>
          <p className="text-primary text-3xl text-[#00BDD6]">2</p>
        </div>
      </div>

      <div className="mb-4">
        <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleStockOutCreateModal}>
          New StockOut
        </button>
      </div>
      <StockOutCreate isOpen={isModalOpen} onClose={toggleStockOutCreateModal} />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left py-2 px-4">Check</th>
              <th className="text-left py-2 px-4">Request Id</th>
              <th className="text-left py-2 px-4">Stock In Batch</th>
              <th className="text-left py-2 px-4">Stock in Item</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-left py-2 px-4">Quantity</th>
              <th className="text-left py-2 px-4">Request From</th>
              <th className="text-left py-2 px-4">Req Quantity</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Icon</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4"><input type="checkbox" /></td>
              <td className="py-2 px-4">REQ - 30</td>
              <td className="py-2 px-4">B-001</td>
              <td className="py-2 px-4">Imifuka</td>
              <td className="py-2 px-4">Magic - 5 kg</td>
              <td className="py-2 px-4">50</td>
              <td className="py-2 px-4">Marla White</td>
              <td className="py-2 px-4">64</td>
              <td className="py-2 px-4">13/01/2022</td>
              <td className="py-2 px-4"><img alt="edit-icon" src="https://openui.fly.dev/openui/24x24.svg?text=✏️" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOut;
