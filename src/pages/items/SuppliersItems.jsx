import React from 'react'

const SuppliersItems = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Suppliers Item</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Sub-title goes here</p>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Supplier</label>
                        <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="itemName" placeholder="Input text" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Item</label>
                        <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="category" placeholder="Input text" />
                    </div>
                    <div className=" space-x-4">
                        <button type="submit" className="bg-[#ed7e39] text-white hover:bg-primary/80 p-2 rounded">+ Add Items</button>
                        <div className="flex justify-end space-x-4">
                            <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                            <button type="submit" className="bg-[#00BDD6] text-white hover:bg-primary/80 p-2 rounded">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SuppliersItems