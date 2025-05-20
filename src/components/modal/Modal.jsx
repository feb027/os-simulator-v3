import React from 'react';
import { VscChromeClose } from 'react-icons/vsc';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[150]" 
      onClick={onClose} // Close on overlay click
    >
      {/* Modal Container */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-5 relative text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-lg font-semibold">{title || 'Modal'}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <VscChromeClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal; 