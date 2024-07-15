import React from 'react'

const FinishedCreate = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="max-w-md mx-auto bg-white p-10 rounded-md shadow-md ">
                <h2 className="text-2xl font-semibold text-zinc-800">Add Finished Product</h2>
                <p className="text-zinc-600 mb-4">Record All Finished Product Here</p>

                <form className='w-96'>
                    <div className="mb-4">
                        <label className="block text-zinc-700 font-medium mb-2">Quantity</label>
                        <input type="text" placeholder="Input text" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-zinc-700 font-medium mb-2">Branda</label>
                        <input type="text" placeholder="Input text" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-zinc-700 font-medium mb-2">Dechet</label>
                        <input type="text" placeholder="Input text" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-zinc-700 font-medium mb-2">Select Quality</label>
                        <input type="text" placeholder="Input text" className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-zinc-600" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FinishedCreate
