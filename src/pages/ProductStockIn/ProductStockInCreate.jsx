import React from 'react';

const ProductStockInCreate = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md bg-card text-card-foreground">
                <h2 className="mb-4 text-2xl font-semibold">Product Stock In</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Product Stock In Record Form</p>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="address">Quantity</label>
                        <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="address" placeholder="Input text" />
                    </div>
                    <div className='flex gap-10'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="packaging">Packaging</label>
                            <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-gray-500" id="packaging">
                                <option value="" disabled selected>Select Packaging</option>
                                <option value="box">Box</option>
                                <option value="bag">Bag</option>
                                <option value="wrap">Wrap</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="finishedProduct">Finished Product</label>
                            <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-gray-500" id="finishedProduct">
                                <option value="" disabled selected>Select Finished Product</option>
                                <option value="product1">Product 1</option>
                                <option value="product2">Product 2</option>
                                <option value="product3">Product 3</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex gap-10'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Employee</label>
                            <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="itemName" placeholder="Input text" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact">comment</label>
                            <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="contact" placeholder="Input text" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] text-white hover:bg-primary/80 p-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductStockInCreate;
