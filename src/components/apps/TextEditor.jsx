import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import toast from 'react-hot-toast';
import useDesktopStore from '../../stores/desktopStore';
import { Menu } from '@headlessui/react'; // Transition might not be needed now
import { motion, AnimatePresence } from 'framer-motion'; // Ensure motion is imported
import { FiChevronDown } from 'react-icons/fi'; // Optional: for dropdown indicator

// Helper to get cursor position
const getCursorPosition = (textarea) => {
  const start = textarea.selectionStart;
  const textLines = textarea.value.substring(0, start).split("\n");
  const line = textLines.length;
  const column = textLines[textLines.length - 1].length + 1; // +1 because column is 1-based
  return { line, column };
};

function TextEditor({ context }) {
  const initialFilePath = context?.filePath;
  const windowId = context?.id; // Get window ID from context
  const updateTitle = context?.updateTitle; // <-- Get the callback from context
  const readFile = useDesktopStore((state) => state.readFile);
  const writeFile = useDesktopStore((state) => state.writeFile);
  const markWindowDirty = useDesktopStore((state) => state.markWindowDirty); // <-- Import action
  const markWindowClean = useDesktopStore((state) => state.markWindowClean); // <-- Import action
  const activeWindowId = useDesktopStore((state) => state.activeWindowId); // Get active window ID
  const openSaveAsDialog = useDesktopStore((state) => state.openSaveAsDialog); // <-- Get action
  const closeSaveAsDialog = useDesktopStore((state) => state.closeSaveAsDialog); // <-- Get action (optional here)

  const [currentFilePath, setCurrentFilePath] = useState(initialFilePath);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lineCount, setLineCount] = useState(1); // State for line count
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 }); // State for cursor position
  const textAreaRef = useRef(null);
  const lineNumbersRef = useRef(null); // Ref for line numbers div

  // Function to extract directory from path
  const getDirectoryPath = (path) => {
    if (!path) return '/'; // Default to root?
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash <= 0) return '/'; // Handle root or files directly in root
    return path.substring(0, lastSlash);
  };

  // Function to extract filename from path
  const getFileName = (path) => {
      if (!path) return '';
      return path.substring(path.lastIndexOf('/') + 1);
  }

  // --- Title Update Effect ---
  useEffect(() => {
    if (updateTitle) {
      const baseTitle = getFileName(currentFilePath || 'Untitled');
      const dirtyMark = isDirty ? '*' : '';
      const finalTitle = `${baseTitle}${dirtyMark} - Text Editor`;
      updateTitle(finalTitle);
    }
  }, [currentFilePath, isDirty, updateTitle, getFileName]); // Added isDirty dependency
  // --- END Title Update Effect ---

  // --- Line Count and Cursor Update Logic ---
  const updateEditorState = useCallback(() => {
    if (textAreaRef.current) {
      // Update Line Count
      const lines = textAreaRef.current.value.split('\n').length;
      setLineCount(lines);
      // Update Cursor Position
      setCursorPosition(getCursorPosition(textAreaRef.current));
    }
  }, []); // No dependencies, relies on textAreaRef.current

  // Effect to sync scroll between textarea and line numbers
  useEffect(() => {
    const textArea = textAreaRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textArea || !lineNumbers) return;

    const handleScroll = () => {
      lineNumbers.scrollTop = textArea.scrollTop;
    };

    textArea.addEventListener('scroll', handleScroll);
    return () => textArea.removeEventListener('scroll', handleScroll);
  }, []); // Runs once on mount
  // --- END Line Count and Cursor Update Logic ---

  // --- File Loading ---
  const loadFile = useCallback(async (path) => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    
    if (!path) {
      // Case: New, untitled file
      console.log('[TextEditor] Loading new untitled file.');
      setContent(''); // Start empty
      setIsDirty(false);
      setCurrentFilePath(null); // Explicitly set path to null for new file
      if (windowId !== undefined) markWindowClean(windowId);
      setIsLoading(false); // Finish loading immediately
      setError(null); // Ensure no error is set
      // Use setTimeout to ensure state updates apply before focusing/updating editor state
      setTimeout(() => {
          updateEditorState();
          textAreaRef.current?.focus(); // Focus on the textarea for new file
      }, 0);
      return;
    }

    // Case: Existing file path provided
    console.log(`[TextEditor] Loading file: ${path}`);
    const result = readFile(path);
    if (result.success) {
      setContent(result.data || '');
      setIsDirty(false);
      setCurrentFilePath(path);
      if (windowId !== undefined) markWindowClean(windowId);
      setError(null); // Clear error on success
    } else {
      const errorMsg = result.error || 'Failed to read file.';
      setError(errorMsg);
      toast.error(errorMsg);
      setContent(''); // Clear content on load error
      // Keep currentFilePath as is, maybe user wants to retry?
      if (windowId !== undefined) markWindowClean(windowId); 
      setIsDirty(false); // Treat as clean if load fails
    }
    setIsLoading(false); // Finish loading
    // Update editor state after content is set
    setTimeout(updateEditorState, 0); 
  }, [readFile, windowId, markWindowClean, markWindowDirty, updateEditorState]); // Added markWindowDirty dep just in case, though likely not needed here

  useEffect(() => {
    loadFile(currentFilePath);
  }, [currentFilePath, loadFile]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (!isDirty) {
      setIsDirty(true);
      if (windowId !== undefined) markWindowDirty(windowId); // Mark dirty when first change occurs
    }
    updateEditorState(); // Update lines/cursor on change
  };

  // --- Save / Save As Logic --- 
  const handleSave = useCallback(() => {
    console.log('[TextEditor] handleSave triggered. currentFilePath:', currentFilePath);
    if (!currentFilePath) {
      console.log('[TextEditor] No currentFilePath, opening Save As dialog...');
      triggerSaveAs(); // Call the new function to open the Save As dialog
      return;
    }
    if (!writeFile) {
        toast.error("Save function not available."); return;
    }
    if (error) {
      toast.error("Cannot save due to loading error.");
      return;
    }

    toast.loading('Saving...', { id: 'save-toast' });
    const result = writeFile(currentFilePath, content);
    if (result.success) {
      toast.dismiss('save-toast');
      toast.success('File saved!');
      setIsDirty(false);
      if (windowId !== undefined) markWindowClean(windowId); // Mark clean after successful save
    } else {
      toast.dismiss('save-toast');
      toast.error(result.error || 'Failed to save file.');
    }
  }, [currentFilePath, writeFile, error, content, windowId, markWindowClean, isDirty]);

  // Function to perform the actual save logic, used by Save and Save As callback
  const performSave = (fullPath) => {
    console.log('[TextEditor] performSave called with path:', fullPath);
    if (!writeFile) {
        toast.error("Save function not available."); return { success: false };
    }
    if (error && !isDirty) { // If there was a load error and no new changes, prevent save
        toast.error("Cannot save due to loading error and no changes.");
        return { success: false };
    }

    toast.loading('Saving...', { id: 'save-toast' });
    const result = writeFile(fullPath, content);
    
    if (result.success) {
      toast.dismiss('save-toast');
      toast.success(`File saved: ${getFileName(fullPath)}`);
      setIsDirty(false);
      setCurrentFilePath(fullPath); // Update current path
      if (windowId !== undefined) markWindowClean(windowId);
      if (updateTitle) { // Update title
        const newWindowTitle = `${getFileName(fullPath)} - Text Editor`;
        updateTitle(newWindowTitle);
      }
      closeSaveAsDialog(); // Close the dialog on success
      return { success: true };
    } else {
      toast.dismiss('save-toast');
      toast.error(result.error || 'Failed to save file.');
      // Don't close the dialog on error, let the dialog show the message
      // We might need to pass the error back to the dialog if save is triggered *from* dialog
      return { success: false, error: result.error || 'Failed to save file.' };
    }
  };

  // Function to open the new Save As Dialog
  const triggerSaveAs = () => {
    console.log('[TextEditor] Triggering Save As dialog...');
    openSaveAsDialog({
      initialPath: getDirectoryPath(currentFilePath || '/'),
      initialFilename: getFileName(currentFilePath || 'Untitled.txt'),
      onSave: (chosenPath) => { // Pass the save logic as a callback
        performSave(chosenPath);
        // performSave handles closing the dialog on success
      }
    });
  };

  // === Keyboard Shortcut Effect ===
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
         // Check if this window is the active one
         if (windowId === activeWindowId) {
            event.preventDefault();
            // console.log("Ctrl+S detected in active window:", windowId); // Optional debug log
            handleSave();
         }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [windowId, activeWindowId, handleSave]); // Dependencies are correct
  // === END Keyboard Shortcut Effect ===

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.1, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -5, transition: { duration: 0.075, ease: 'easeIn' } }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* --- NEW Menu Bar --- */}
      <div className="flex-shrink-0 px-1 py-0.5 border-b border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800 flex items-center space-x-1">
        {/* File Menu */} 
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-150 ease-in-out">
              File
            </Menu.Button>
          </div>
          <AnimatePresence>
            <Menu.Items 
              as={motion.div} 
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="origin-top-left absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-10 py-1"
            >
              <Menu.Item>
                {({ active, disabled }) => (
                  <button
                    onClick={handleSave}
                    disabled={disabled}
                    className={`${ active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200' } ${ disabled ? 'opacity-50 cursor-not-allowed' : '' } group flex rounded-md items-center w-full px-3 py-1.5 text-xs`}
                  >
                    <span className="flex-grow text-left">Save</span>
                    <span className="text-gray-400 dark:text-gray-500 ml-auto pl-3">Ctrl+S</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active, disabled }) => (
                  <button
                    onClick={triggerSaveAs}
                    disabled={disabled || isLoading || !!error}
                    className={`${ active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200' } ${ disabled ? 'opacity-50 cursor-not-allowed' : '' } group flex rounded-md items-center w-full px-3 py-1.5 text-xs`}
                  >
                    Save As...
                  </button>
                )}
              </Menu.Item>
              {/* Add other File menu items here (New, Open, Close etc.) */}
            </Menu.Items>
          </AnimatePresence>
        </Menu>

        {/* Edit Menu - Restore Placeholders Carefully */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-150 ease-in-out">
              Edit
            </Menu.Button>
          </div>
           <AnimatePresence>
            <Menu.Items
              as={motion.div}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="origin-top-left absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-10 py-1"
            >
               {/* --- Restore Placeholders --- */}
               <Menu.Item>
                 {({ active }) => ( // No need for disabled state here if always disabled
                   <button 
                    disabled={true} // Disable the button directly
                    className={`${ active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200' } opacity-50 cursor-not-allowed group flex rounded-md items-center w-full px-3 py-1.5 text-xs`}
                   >
                     <span className="flex-grow text-left">Undo</span>
                     <span className="text-gray-400 dark:text-gray-500 ml-auto pl-3">(N/A)</span>
                   </button>
                 )}
               </Menu.Item>
               <Menu.Item>
                 {({ active }) => (
                   <button 
                    disabled={true} 
                    className={`${ active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200' } opacity-50 cursor-not-allowed group flex rounded-md items-center w-full px-3 py-1.5 text-xs`}
                   >
                     <span className="flex-grow text-left">Redo</span>
                     <span className="text-gray-400 dark:text-gray-500 ml-auto pl-3">(N/A)</span>
                   </button>
                 )}
               </Menu.Item>
               
               {/* Restore Separator */}
               <div role="none" className="py-1">
                 <div className="h-px bg-gray-200 dark:bg-gray-600 mx-3" />
               </div>
               {/* End Separator */} 

               <Menu.Item>
                 {({ active }) => (
                   <button 
                    disabled={true} 
                    className={`${ active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200' } opacity-50 cursor-not-allowed group flex rounded-md items-center w-full px-3 py-1.5 text-xs`}
                   >
                     <span className="flex-grow text-left">Find</span>
                     <span className="text-gray-400 dark:text-gray-500 ml-auto pl-3">(N/A)</span>
                   </button>
                 )}
               </Menu.Item>
               {/* --- End Restore Placeholders --- */}
             </Menu.Items>
          </AnimatePresence>
        </Menu>
        {/* Add more menus here (View, Help etc.) */} 
      </div>
      {/* --- END Menu Bar --- */}

      {/* --- Editor Area (with Line Numbers) --- */}
      <div className="flex flex-grow overflow-hidden"> {/* Container for lines + text */}
        {/* Line Numbers - Apply same font/size as textarea */}
        <div 
          ref={lineNumbersRef} 
          className="flex-shrink-0 w-10 md:w-12 text-right pr-2 pt-3 pb-3 text-sm font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 overflow-y-hidden select-none" // Use pt-3, text-sm, font-mono
        >
          {/* Generate line numbers */}
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-[21px]">{i + 1}</div> // Adjust line-height if needed based on textarea's line-height
          ))}
        </div>

        {/* Text Area (ensure line height allows alignment) */}
        <textarea 
          ref={textAreaRef}
          value={isLoading ? 'Loading...' : content} // Show content directly even if error, error shown in status bar
          onChange={handleContentChange}
          onKeyUp={updateEditorState} 
          onClick={updateEditorState} 
          disabled={isLoading} // ONLY disable when strictly loading
          className={`w-full h-full flex-grow p-3 text-sm font-mono resize-none border-none outline-none 
                     leading-[21px] 
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     placeholder-gray-400 dark:placeholder-gray-500 
                     ${isLoading ? 'opacity-60 cursor-not-allowed' : ''} // Apply disabled style only when loading
                     focus:ring-0 focus:outline-none`}
          placeholder={isLoading ? '' : "Start typing..."} // Adjust placeholder based on loading
          spellCheck="false"
          wrap="off" 
        />
      </div>
      {/* --- END Editor Area --- */}

      {/* Status Bar - Show error message if present */} 
      <div className="flex-shrink-0 px-3 py-1 border-t border-gray-200 dark:border-gray-700/50 bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-sm text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
        {/* Left side: File name and dirty indicator */}
        <span className="truncate" title={currentFilePath || 'New File'}> 
          {getFileName(currentFilePath || 'Untitled')}
          {isDirty ? '*' : ''} 
        </span>
        
        {/* Right side: Show Error OR Counts/Position */}
        {error && !isLoading ? ( // Show error only if not loading
          <span className="text-red-500 font-medium truncate" title={error}> 
             Error: {error}
          </span>
        ) : isLoading ? (
           <span className="text-gray-500">Loading...</span>
        ) : (
          <div className="flex items-center space-x-3"> 
            {/* Restore Word/Char Counts */}
            <span title="Word Count">
              Words: {content.trim().split(/\s+/).filter(Boolean).length}
            </span>
            <span title="Character Count">
              Chars: {content.length}
            </span>
            <span title="Line and Column">
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
          </div>
        )}
      </div>
      {/* END Status Bar */} 
    </div>
  );
}

export default TextEditor; 