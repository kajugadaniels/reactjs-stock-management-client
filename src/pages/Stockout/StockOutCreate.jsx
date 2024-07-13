import React from 'react';

const StockOutCreate = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Suppliers Form</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Sub-title goes here</p>
                <form>
                    <div className='flex gap-10'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Item</label>
                            <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="itemName" placeholder="Input text" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="contact">Quantity</label>
                            <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="contact" placeholder="Input text" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="address">Registered By</label>
                        <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="address" placeholder="Input text" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="comment">Comment</label>
                        <textarea className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" id="comment" placeholder="send a message"></textarea>
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

export default StockOutCreate;
