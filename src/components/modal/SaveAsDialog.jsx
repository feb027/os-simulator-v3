import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useDesktopStore from '../../stores/desktopStore';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiArrowUp } from 'react-icons/fi';
import InputModal from './InputModal';

// --- Recursive Directory Tree Node Component --- 
function DirectoryNode({ path, node, currentSelectedPath, onSelectPath, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(level < 1); // Expand root and first level by default

  if (!node || node.type !== 'directory') return null;

  const handleToggleExpand = (e) => {
    e.stopPropagation(); // Prevent selecting when toggling expand
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelectPath(path);
  };

  const isSelected = path === currentSelectedPath;

  // Sort entries: directories first, then alphabetically using KEYS
  const sortedEntries = Object.entries(node.content || {}).sort(([keyA, a], [keyB, b]) => { // Destructure keys
    if (a.type === 'directory' && b.type !== 'directory') return -1;
    if (a.type !== 'directory' && b.type === 'directory') return 1;
    // Compare the keys (file/directory names)
    return keyA.localeCompare(keyB); 
  });

  const hasSubdirectories = sortedEntries.some(([, entry]) => entry.type === 'directory');

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      <div 
        className={`flex items-center px-2 py-1 rounded cursor-pointer text-xs 
                    ${isSelected 
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200' 
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
        onClick={handleSelect}
      >
        {hasSubdirectories ? (
          <button onClick={handleToggleExpand} className="mr-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white focus:outline-none">
            {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
          </button>
        ) : (
          <span className="mr-1 w-[14px] inline-block"></span> // Placeholder for alignment
        )}
        <FiFolder className="mr-1.5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" size={14} />
        <span className="truncate">{path === '/' ? 'Root' : path.split('/').pop()}</span>
      </div>
      {isExpanded && (
        <div className="mt-0.5">
          {sortedEntries.map(([name, entry]) => {
            // Only render subdirectories in the tree
            if (entry.type === 'directory') {
              const subPath = path === '/' ? `/${name}` : `${path}/${name}`;
              return (
                <DirectoryNode
                  key={subPath}
                  path={subPath}
                  node={entry}
                  currentSelectedPath={currentSelectedPath}
                  onSelectPath={onSelectPath}
                  level={level + 1}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
// --- END Directory Tree Node Component ---

function SaveAsDialog() {
  // Store getters
  const { isOpen, initialPath, initialFilename, onSave } = useDesktopStore((state) => state.saveAsDialog);
  const closeSaveAsDialog = useDesktopStore((state) => state.closeSaveAsDialog);
  const getNode = useDesktopStore((state) => state.getNode); // <-- Get getNode helper
  const fs = useDesktopStore.getState().fs; // Keep direct access for initial tree
  const showConfirmation = useDesktopStore((state) => state.showConfirmation); // <-- Get confirmation action
  const createDirectory = useDesktopStore((state) => state.createDirectory); // Get createDirectory action

  // State
  const [selectedPath, setSelectedPath] = useState(initialPath || '/');
  const [fileName, setFileName] = useState(initialFilename || 'Untitled.txt');
  const [errorMessage, setErrorMessage] = useState(null);
  const modalRef = useRef(null);
  const fileNameInputRef = useRef(null); // <-- Ref for filename input
  // State for New Folder Modal
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderError, setNewFolderError] = useState(null);

  // Reset state and focus on open
  useEffect(() => {
    if (isOpen) {
      setSelectedPath(initialPath || '/');
      setFileName(initialFilename || 'Untitled.txt');
      setErrorMessage(null);
      // Focus filename input shortly after opening
      setTimeout(() => fileNameInputRef.current?.focus(), 50);
      setTimeout(() => fileNameInputRef.current?.select(), 60); // Select text too
    } 
  }, [isOpen, initialPath, initialFilename]);

  // Handle closing on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSaveAsDialog();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeSaveAsDialog]);

  // --- Navigation Handler ---
  const handleGoUp = () => {
    if (selectedPath === '/') return; // Already at root
    const pathSegments = selectedPath.split('/').filter(Boolean);
    pathSegments.pop(); // Remove last segment
    const parentPath = pathSegments.length === 0 ? '/' : '/' + pathSegments.join('/');
    setSelectedPath(parentPath);
    setErrorMessage(null); // Clear filename error if navigating
  };
  // --- END Navigation Handler ---

  // --- Save Click Handler with Overwrite Check ---
  const handleSaveClick = () => {
    const finalFileName = fileName.trim();
    if (!finalFileName) {
      setErrorMessage('File name cannot be empty.');
      return;
    }
    if (finalFileName.includes('/')) {
        setErrorMessage('File name cannot contain slashes.');
        return;
    }
    
    const fullPath = selectedPath === '/' ? `/${finalFileName}` : `${selectedPath}/${finalFileName}`;
    const existingNode = getNode(fs, fullPath); // Use getNode from store

    const proceedWithSave = () => {
      console.log('[SaveAsDialog] Proceeding with save to:', fullPath);
      if (onSave) {
        onSave(fullPath); // Execute the original callback
      }
    };

    if (existingNode) {
      // File exists, ask for confirmation
      showConfirmation(
        'Confirm Save As', 
        `The file "${finalFileName}" already exists. Do you want to replace it?`,
        proceedWithSave // Only proceed if confirmed
      );
    } else {
      // File doesn't exist, proceed directly
      proceedWithSave();
    }
  };
  // --- END Save Click Handler ---

  // --- Updated Directory Tree Logic --- 
  const renderDirectoryTree = () => {
    // Pass the root of the file system to the recursive component
    return (
        <div className="h-64 border border-gray-300 dark:border-gray-600 rounded p-2 bg-gray-50 dark:bg-gray-700/50 overflow-auto text-sm">
           <DirectoryNode 
             path="/" 
             node={{ type: 'directory', content: fs['/'] }} 
             currentSelectedPath={selectedPath} 
             onSelectPath={setSelectedPath} 
             level={0} 
           />
        </div>
    );
  };
  // --- END Updated Directory Tree Logic ---

  // --- New Folder Handlers ---
   const openNewFolderModal = () => {
      setNewFolderName('');
      setNewFolderError(null);
      setIsNewFolderModalOpen(true);
   };

   const closeNewFolderModal = () => {
      setIsNewFolderModalOpen(false);
   };

   const handleNewFolderSubmit = (name) => {
      const newDirName = name.trim();
      if (!newDirName || newDirName.includes('/')) {
          setNewFolderError('Invalid folder name.');
          return;
      }
      const newDirPath = selectedPath === '/' ? `/${newDirName}` : `${selectedPath}/${newDirName}`;
      
      const result = createDirectory(newDirPath);
      if (result.success) {
          toast.success(`Folder "${newDirName}" created.`);
          closeNewFolderModal();
          // No need to explicitly refresh tree, store update should trigger re-render
      } else {
          setNewFolderError(result.error || 'Failed to create folder.');
          toast.error(result.error || 'Failed to create folder.');
      }
   };
  // --- END New Folder Handlers ---

  // Animation variants
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="saveas-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeSaveAsDialog} // Close on backdrop click
          >
            <motion.div
              key="saveas-modal"
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]" // Limit height
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Header */} 
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      Save As
                  </h3>
              </div>
              
              {/* Body */} 
              <div className="p-4 flex-grow overflow-y-auto space-y-4">
                  {/* Path Display and Up Button */} 
                   <div className="mb-1 flex items-center space-x-2">
                     <button 
                       onClick={handleGoUp} 
                       disabled={selectedPath === '/'} 
                       className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-400"
                       title="Go to parent directory"
                       aria-label="Go up"
                     >
                       <FiArrowUp className="w-4 h-4 text-gray-600 dark:text-gray-300"/>
                     </button>
                     <div className="text-xs text-gray-500 dark:text-gray-400 flex-grow truncate bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                       <span className="font-medium mr-1">Save in:</span> 
                       <span className="font-mono select-all" title={selectedPath}>{selectedPath}</span>
                     </div>
                   </div>
                  
                  {/* Directory Tree Area */} 
                  {renderDirectoryTree()}
                  
                  {/* File Name Input Area */} 
                  <div>
                      <label htmlFor="saveas-filename" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      File name:
                      </label>
                      <input
                        ref={fileNameInputRef} // <-- Add ref
                        type="text"
                        id="saveas-filename"
                        value={fileName}
                        onChange={(e) => { setFileName(e.target.value); setErrorMessage(null); }} // Clear error on change
                        className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 ${errorMessage ? 'focus:ring-red-500' : 'focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                        placeholder="Enter file name"
                      />
                      {errorMessage && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
                      )}
                  </div>
              </div>

              {/* Footer - Add New Folder Button */}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 flex justify-between items-center flex-shrink-0">
                   {/* Left side button(s) */} 
                   <button
                      type="button"
                      className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                      onClick={openNewFolderModal}
                   >
                       <FiFolder className="w-4 h-4 mr-1 -ml-1"/> New Folder
                   </button>

                   {/* Right side buttons */} 
                   <div className="flex space-x-3">
                      <button
                          type="button"
                          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                          onClick={closeSaveAsDialog}
                      >
                          Cancel
                      </button>
                      <button
                          type="button"
                          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={handleSaveClick}
                      >
                          Save
                      </button>
                   </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <InputModal 
        isOpen={isNewFolderModalOpen}
        onClose={closeNewFolderModal}
        onSubmit={handleNewFolderSubmit}
        title="Create New Folder"
        label="Folder Name:"
        errorMessage={newFolderError}
        submitText="Create"
      /> 
    </>
  );
}

export default SaveAsDialog; 