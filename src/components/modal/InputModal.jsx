import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function InputModal({ isOpen, onClose, title, label, initialValue = '', onSubmit, submitText = 'Submit', directoryHint = null, errorMessage = null }) {
  const [value, setValue] = useState(initialValue);

  // Reset value when modal opens with a new initialValue
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) { // Ensure value is not empty
        onSubmit(value.trim());
        // onClose(); // Let caller handle closing after submission
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        {/* Display Directory Hint if provided */}
        {directoryHint && (
          <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-2 rounded">
            Saving in: <span className="font-mono select-all" title={directoryHint}>{directoryHint}</span>
          </div>
        )}

        <label htmlFor="input-modal-field" className="block text-sm font-medium mb-1">
          {label}
        </label>
        <input
          type="text"
          id="input-modal-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 ${errorMessage ? 'focus:ring-red-500' : 'focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          autoFocus
          required // Basic HTML validation
        />
        {/* Display Error Message if provided */}
        {errorMessage && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
        )}

        {/* Footer with buttons */}
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default InputModal; 