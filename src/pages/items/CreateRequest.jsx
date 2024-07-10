import React from 'react'

const CreateRequest = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold mb-4">Request Registration</h2>
                <p className="text-muted-foreground mb-6 text-[#424955]">Sub-title goes here</p>
                <form>
                    <div className='flex gap-14'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Item</label>
                            <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400 pl-9 pr-9" id="itemName">
                                <option value="">Select an item</option>
                                <option value="item1">Item 1</option>
                                <option value="item2">Item 2</option>
                                <option value="item3">Item 3</option>

                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Contact</label>
                            <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground " type="text" id="category" placeholder="Input text" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Requester</label>
                        <input className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="category" placeholder="Input text" />
                        <p className="text-muted-foreground text-sm mt-1 text-[#424955]">Caption goes here</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Request From</label>
                        <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400 pl-9 pr-9" id="category">
                            <option value="">Select a category</option>
                            <option value="category1">Category 1</option>
                            <option value="category2">Category 2</option>
                            <option value="category3">Category 3</option>

                        </select>
                    </div>
                    <div className='flex gap-20'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Stutus</label>
                            <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400 pl-8 pr-9" id="itemName">
                                <option value="">Select Stutus </option>
                                <option value="item1">Item 1</option>
                                <option value="item2">Item 2</option>
                                <option value="item3">Item 3</option>

                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="itemName">Request For</label>
                            <select className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground text-gray-400 pl-9 pr-9" id="itemName">
                                <option value="">Request For</option>
                                <option value="item1">Item 1</option>
                                <option value="item2">Item 2</option>
                                <option value="item3">Item 3</option>

                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#424955]" htmlFor="category">Note</label>
                        <textarea className="bg-[#f3f4f6] w-full p-2 border border-input rounded bg-input text-foreground" type="text" id="category" placeholder="Input text" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-[#00BDD6] text-white hover:bg-primary/80 p-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateRequest