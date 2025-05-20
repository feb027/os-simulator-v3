import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi'; // Or another relevant icon

function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel' }) {
  const modalRef = useRef(null);

  // Handle closing on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  if (!isOpen) return null; // Render nothing if not open (handled by AnimatePresence in parent)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            key="confirm-modal"
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-800/50 sm:mx-0 sm:h-8 sm:w-8">
                  <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
                <div className="mt-0 text-left flex-grow">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                onClick={() => { onConfirm(); onClose(); }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                onClick={onClose}
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal; 