import React from 'react';
import { VscChromeClose } from 'react-icons/vsc';

function SimpleDisplayModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  // Stop propagation to prevent clicks inside modal from closing it via background click handler
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Modal Overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Close when clicking the overlay
    >
      {/* Modal Content */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={handleModalContentClick} // Prevent closing when clicking content
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <VscChromeClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-1 max-h-[60vh] overflow-y-auto">
          {children} 
        </div>

         {/* Modal Footer (Optional: Can add buttons here if needed later) */}
         <div className="flex justify-end p-3 border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                Close
            </button>
         </div>
      </div>
    </div>
  );
}

export default SimpleDisplayModal; 