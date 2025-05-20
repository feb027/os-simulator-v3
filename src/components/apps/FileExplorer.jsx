import React, { useState, useEffect, useRef } from 'react';
import { FaFolder, FaFile, FaArrowLeft, FaThLarge, FaList } from 'react-icons/fa';
import { FiFileText, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useDesktopStore from '../../stores/desktopStore';
import ContextMenu from '../contextMenu/ContextMenu';
import InputModal from '../modal/InputModal';
import ConfirmModal from '../modal/ConfirmModal';
import FileTreeSidebar from './FileTreeSidebar';
import SimpleDisplayModal from '../modal/SimpleDisplayModal';
import { VscChromeClose } from 'react-icons/vsc';

// Helper function to join paths correctly (duplicated from Sidebar for now)
const joinPaths = (...paths) => {
  return '/' + paths.filter(Boolean).join('/').replace(/\/+/g, '/');
};

// --- Helper Functions for Formatting ---
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (bytes === undefined || bytes === null) return '-'; // Handle missing size
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(date) {
  if (!date) return '-';
  // Check if it's already a Date object or needs conversion (e.g., from stringified JSON)
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date'; // Handle invalid date strings
  // Use locale formatting for better internationalization
  return dateObj.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit'
  });
}

function FileExplorer() {
  // --- Refs ---
  const containerRef = useRef(null);
  const pathInputRef = useRef(null); // Ref for the path input element

  // --- Store Access ---
  const listDirectory = useDesktopStore((state) => state.listDirectory);
  const initialCwd = useDesktopStore((state) => state.cwd);
  const fs = useDesktopStore((state) => state.fs);
  const createDirectory = useDesktopStore((state) => state.createDirectory);
  const createFile = useDesktopStore((state) => state.createFile);
  const deleteItem = useDesktopStore((state) => state.deleteItem);
  const renameItem = useDesktopStore((state) => state.renameItem);
  const moveItem = useDesktopStore((state) => state.moveItem);
  const clipboard = useDesktopStore((state) => state.clipboard);
  const setClipboard = useDesktopStore((state) => state.setClipboard);
  const clearClipboard = useDesktopStore((state) => state.clearClipboard);
  const copyItem = useDesktopStore((state) => state.copyItem);
  const setCwd = useDesktopStore((state) => state.setCwd);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const fileExplorerSettings = useDesktopStore((state) => state.fileExplorerSettings);
  const updateFileExplorerSettings = useDesktopStore((state) => state.updateFileExplorerSettings);

  // --- Local State ---
  const [currentPath, setCurrentPath] = useState(initialCwd);
  const [items, setItems] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, items: [], target: null });
  
  // Modal States
  const [modalState, setModalState] = useState({
    isNewFolderOpen: false,
    isNewFileOpen: false,
    isRenameOpen: false,
    isDeleteOpen: false,
    targetItems: [],
    error: null,
  });

  const [selectedItemNames, setSelectedItemNames] = useState(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState(-1);
  const [draggedItemNames, setDraggedItemNames] = useState(null);
  const [dragOverFolderName, setDragOverFolderName] = useState(null);
  const [viewMode, setViewMode] = useState(fileExplorerSettings?.defaultView || 'grid');
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [propertiesItem, setPropertiesItem] = useState(null);
  // Path editing state
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [editingPathValue, setEditingPathValue] = useState('');
  // Search state
  const [rawSearchTerm, setRawSearchTerm] = useState(''); // Raw input value
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced value for filtering
  // OS Drag state
  const [isOsDraggingOver, setIsOsDraggingOver] = useState(false);

  // --- Computed/Derived State ---
  const sortedItems = Object.entries(items).map(([name, details]) => ({ name, ...details })).sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  // Filter items based on settings and DEBOUNCED search term
  const itemsToShow = fileExplorerSettings?.showHiddenFiles 
      ? sortedItems 
      : sortedItems.filter(item => !item.name.startsWith('.')); 

  const filteredItems = debouncedSearchTerm
    ? itemsToShow.filter(item => 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : itemsToShow; 

  // --- Effects ---
  useEffect(() => {
    const result = listDirectory(currentPath);
    setItems(result.success ? result.data : {});
    closeContextMenu();
    setSelectedItemNames(new Set());
    setLastClickedIndex(-1);
    setRawSearchTerm(''); // Clear search when navigating
    setDebouncedSearchTerm(''); // Clear debounced search too
  }, [currentPath, fs, listDirectory]);

  // Effect to focus input when entering path edit mode
  useEffect(() => {
    if (isEditingPath) {
      pathInputRef.current?.focus();
      pathInputRef.current?.select(); // Select existing text
    }
  }, [isEditingPath]);

  // NEW: Effect for Debouncing Search Term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(rawSearchTerm);
    }, 300); // 300ms debounce delay

    // Cleanup function to clear the timeout if the raw term changes quickly
    return () => {
      clearTimeout(handler);
    };
  }, [rawSearchTerm]); // Re-run effect when rawSearchTerm changes

  // --- Event Handlers ---
  const handleItemDoubleClick = (itemName, itemType) => {
    closeContextMenu();
    setSelectedItemNames(new Set());
    setLastClickedIndex(-1);
    if (itemType === 'directory') {
      const newPath = joinPaths(currentPath, itemName);
      setCurrentPath(newPath);
    } else {
      // Handle file opening
      const lowerCaseName = itemName.toLowerCase();
      if (lowerCaseName.endsWith('.txt')) {
          const filePath = joinPaths(currentPath, itemName);
          // Open in Text Editor app instead of modal
          openWindow('text-editor', { filePath: filePath }); 
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(lowerCaseName)) {
          const filePath = joinPaths(currentPath, itemName);
          // For simulation, pass the path directly. Assumes path is accessible as a URL.
          // In a real scenario, you might need to serve the file or use data URLs.
          openWindow('image-viewer', { filePath: filePath });
      } else {
          toast.error(`Cannot open this file type: ${itemName}`);
      }
    }
  };

  const navigateUp = () => {
    closeContextMenu();
    setSelectedItemNames(new Set());
    setLastClickedIndex(-1);
    if (currentPath === '/') return;
    const pathSegments = currentPath.split('/').filter(p => p !== '');
    pathSegments.pop();
    const newPath = pathSegments.length === 0 ? '/' : '/' + pathSegments.join('/');
    setCurrentPath(newPath);
  };

  const closeContextMenu = () => setContextMenu(prev => ({ ...prev, visible: false, target: null }));

  const handleItemClick = (e, itemName, index) => {
    e.stopPropagation();
    closeContextMenu();

    const ctrlPressed = e.metaKey || e.ctrlKey;
    const shiftPressed = e.shiftKey;

    setSelectedItemNames(prevSelected => {
      const newSelected = new Set(prevSelected);

      if (shiftPressed && lastClickedIndex !== -1) {
        const start = Math.min(lastClickedIndex, index);
        const end = Math.max(lastClickedIndex, index);
        const rangeSelected = new Set();
        for (let i = start; i <= end; i++) {
          rangeSelected.add(sortedItems[i].name);
        }
        return rangeSelected;
      } else if (ctrlPressed) {
        if (newSelected.has(itemName)) {
          newSelected.delete(itemName);
        } else {
          newSelected.add(itemName);
        }
        setLastClickedIndex(index);
        return newSelected;
      } else {
        setLastClickedIndex(index);
        return new Set([itemName]);
      }
    });
  };

  const handleBackgroundClick = () => {
    setSelectedItemNames(new Set());
    setLastClickedIndex(-1);
    closeContextMenu();
  };

  // Context Menu Triggers
  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    handleBackgroundClick();
    const menuItems = [
        { label: 'New Folder', onClick: openNewFolderModal }, 
        { label: 'New File', onClick: openNewFileModal }
    ];

    if (clipboard) {
        menuItems.push({ label: 'Paste', onClick: handlePaste });
    }

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const xPos = e.clientX - containerRect.left;
    const yPos = e.clientY - containerRect.top;
    setContextMenu({
      visible: true,
      x: xPos,
      y: yPos,
      target: null,
      items: menuItems,
    });
  };

  const handleItemContextMenu = (e, item, index) => {
    e.preventDefault();
    e.stopPropagation();

    const itemName = item.name;
    let currentSelection = new Set(selectedItemNames);

    if (!currentSelection.has(itemName)) {
        currentSelection = new Set([itemName]);
        setSelectedItemNames(currentSelection);
        setLastClickedIndex(index);
    }

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const xPos = e.clientX - containerRect.left;
    const yPos = e.clientY - containerRect.top;

    const menuItems = [];
    if (currentSelection.size >= 1) {
        menuItems.push({ label: 'Copy', onClick: handleCopy });
        menuItems.push({ label: 'Cut', onClick: handleCut });
    }
    if (currentSelection.size === 1) {
        menuItems.push({ label: 'Rename', onClick: () => openRenameModal(item) });
    }
    if (currentSelection.size >= 1) {
        const itemsToDelete = sortedItems.filter(i => currentSelection.has(i.name));
        menuItems.push({ label: 'Delete', onClick: () => openDeleteModal(itemsToDelete) });
    }
    if (currentSelection.size === 1) {
        menuItems.push({ separator: true });
        menuItems.push({ label: 'Properties', onClick: () => openPropertiesModal(item) });
    }

    if(menuItems.length > 0) {
      setContextMenu({
        visible: true,
        x: xPos,
        y: yPos,
        target: item,
        items: menuItems,
      });
    } else {
       closeContextMenu();
    }
  };

  // Modal Openers
  const openNewFolderModal = () => {
    closeContextMenu();
    setModalState(prev => ({ ...prev, isNewFolderOpen: true, targetItems: [], error: null }));
  };

  const openNewFileModal = () => {
    closeContextMenu();
    setModalState(prev => ({ ...prev, isNewFileOpen: true, targetItems: [], error: null }));
  };

  const openRenameModal = (item) => {
    closeContextMenu();
    setModalState(prev => ({ ...prev, isRenameOpen: true, targetItems: [item], error: null }));
  };

  const openDeleteModal = (items) => {
    closeContextMenu();
    setModalState(prev => ({ ...prev, isDeleteOpen: true, targetItems: items, error: null }));
  };

  // Modal Submit/Confirm Handlers
  const handleCreateFolderSubmit = (folderName) => {
    const newPath = (currentPath === '/' ? '' : currentPath) + '/' + folderName;
    const result = createDirectory(newPath);
    if (!result.success) {
      setModalState(prev => ({...prev, error: result.error || 'Folder name invalid or already exists.'}))
      toast.error(result.error || 'Failed to create folder.');
    } else {
      toast.success(`Folder '${folderName}' created.`);
      closeModal();
    }
  };

  const handleCreateFileSubmit = (fileName) => {
    const newPath = (currentPath === '/' ? '' : currentPath) + '/' + fileName;
    const result = createFile(newPath);
     if (!result.success) {
      setModalState(prev => ({...prev, error: result.error || 'File name invalid or already exists.'}))
      toast.error(result.error || 'Failed to create file.');
    } else {
      toast.success(`File '${fileName}' created.`);
      closeModal();
    }
  };

  const handleRenameSubmit = (newName) => {
    if (!modalState.targetItems || modalState.targetItems.length !== 1) return;
    const targetItem = modalState.targetItems[0];
    const oldPath = (currentPath === '/' ? '' : currentPath) + '/' + targetItem.name;
    const result = renameItem(oldPath, newName);
    if (!result.success) {
      setModalState(prev => ({...prev, error: result.error || 'Rename failed. Name invalid or already exists.'}))
      toast.error(result.error || 'Failed to rename item.');
    } else {
      toast.success(`Renamed to '${newName}'.`);
      setSelectedItemNames(new Set([newName]));
      setLastClickedIndex(sortedItems.findIndex(item => item.name === newName));
      closeModal();
    }
  };

  const handleDeleteConfirm = () => {
    if (!modalState.targetItems || modalState.targetItems.length === 0) return;

    let successCount = 0;
    let errorCount = 0;
    const itemNames = modalState.targetItems.map(item => item.name);

    modalState.targetItems.forEach(item => {
      const itemPath = (currentPath === '/' ? '' : currentPath) + '/' + item.name;
      const result = deleteItem(itemPath);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        toast.error(result.error || `Failed to delete '${item.name}'.`);
      }
    });

    if (successCount > 0) {
       const message = successCount === 1
         ? `'${itemNames[0]}' deleted.`
         : `${successCount} items deleted.`;
       toast.success(message);
    }
    if (errorCount === 0) {
       setSelectedItemNames(new Set());
       setLastClickedIndex(-1);
    }

    closeModal();
  };
  
  // Close Modal Handlers
  const closeModal = () => {
    setModalState({
      isNewFolderOpen: false,
      isNewFileOpen: false,
      isRenameOpen: false,
      isDeleteOpen: false,
      targetItems: [],
      error: null,
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, itemName) => {
    if (!selectedItemNames.has(itemName)) {
      e.preventDefault();
      return;
    }

    const namesToDrag = Array.from(selectedItemNames);
    e.dataTransfer.setData('application/json', JSON.stringify(namesToDrag));
    e.dataTransfer.setData('text/plain', itemName);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemNames(new Set(namesToDrag));
  };

  const handleDragOver = (e, folderName) => {
    if (draggedItemNames && items[folderName]?.type === 'directory') {
       if (!draggedItemNames.has(folderName)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOverFolderName(folderName);
          return;
       }
    } 
    e.dataTransfer.dropEffect = 'none';
    setDragOverFolderName(null);
  };

  const handleDragLeave = () => {
    setDragOverFolderName(null);
  };

  const handleDrop = (e, targetFolderName) => {
    e.preventDefault();
    setDragOverFolderName(null);

    const sourceNamesJSON = e.dataTransfer.getData('application/json');
    let sourceNames = [];
    try {
       sourceNames = JSON.parse(sourceNamesJSON);
       if (!Array.isArray(sourceNames)) throw new Error("Invalid data");
    } catch (error) {
       console.error("Failed to parse dragged item data:", error);
       setDraggedItemNames(null);
       return;
    }

    if (sourceNames.length === 0 || !items[targetFolderName] || items[targetFolderName].type !== 'directory' || sourceNames.includes(targetFolderName)) {
       console.log("Drop cancelled: Invalid conditions on drop.");
       setDraggedItemNames(null);
       return;
    }

    const destDirPath = (currentPath === '/' ? '' : currentPath) + '/' + targetFolderName;
    let successCount = 0;
    let errorCount = 0;
    let firstError = null;

    sourceNames.forEach(sourceName => {
      const sourcePath = (currentPath === '/' ? '' : currentPath) + '/' + sourceName;
      console.log(`Attempting move: ${sourcePath} -> ${destDirPath}`);
      const result = moveItem(sourcePath, destDirPath);

      if (!result.success) {
        errorCount++;
        if (!firstError) firstError = result.error || `Failed to move '${sourceName}'`;
        console.error(`Failed move: ${sourcePath} -> ${destDirPath}`, result.error);
      } else {
        successCount++;
      }
    });

    if (successCount > 0) {
      const message = successCount === 1 && sourceNames.length === 1
         ? `Moved '${sourceNames[0]}' into '${targetFolderName}'.`
         : `Moved ${successCount} item${successCount > 1 ? 's' : ''} into '${targetFolderName}'.`;
      toast.success(message);
    }
    if (errorCount > 0) {
      toast.error(`Failed to move ${errorCount} item${errorCount > 1 ? 's' : ''}. ${firstError ? `(${firstError})` : ''}`);
    }

    setDraggedItemNames(null);
    if (errorCount === 0) {
       setSelectedItemNames(new Set());
       setLastClickedIndex(-1);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemNames(null);
    setDragOverFolderName(null);
  };

  // --- NEW: Handler for dropping items onto the sidebar tree ---
  const handleSidebarDrop = (sourceNames, destNodePath) => {
      // Prevent dropping onto the source folder itself via sidebar
      if(destNodePath === currentPath) {
         console.log("Sidebar Drop prevented: Source and destination are the same.");
         return;
      }
      // Prevent dropping items into one of the items being dragged (if it's a folder)
       if (sourceNames.some(name => joinPaths(currentPath, name) === destNodePath)) {
           console.log("Sidebar Drop prevented: Cannot drop selection into itself.");
           return;
       }
       if (sourceNames.length === 0) {
           console.log("Sidebar Drop cancelled: No source items found.");
           return;
       }

       let successCount = 0;
       let errorCount = 0;
       let firstError = null;

       sourceNames.forEach(sourceName => {
         const sourcePath = joinPaths(currentPath, sourceName); // Source is always relative to currentPath
         // Destination is the absolute path from the sidebar node
         console.log(`Attempting move (Sidebar Drop): ${sourcePath} -> ${destNodePath}`);
         const result = moveItem(sourcePath, destNodePath); // moveItem expects absolute source and dest directory

         if (!result.success) {
           errorCount++;
           if (!firstError) firstError = result.error || `Failed to move '${sourceName}'`;
           console.error(`Failed move: ${sourcePath} -> ${destNodePath}`, result.error);
         } else {
           successCount++;
         }
       });

       // Report outcome
       if (successCount > 0) {
         const destFolderName = destNodePath.split('/').pop() || 'Root';
         const message = successCount === 1 && sourceNames.length === 1
           ? `Moved '${sourceNames[0]}' into '${destFolderName}'.`
           : `Moved ${successCount} item${successCount > 1 ? 's' : ''} into '${destFolderName}'.`;
         toast.success(message);
       }
       if (errorCount > 0) {
         toast.error(`Failed to move ${errorCount} item${errorCount > 1 ? 's' : ''}. ${firstError ? `(${firstError})` : ''}`);
       }

       // Clear selection if all moves were successful
       if (errorCount === 0) {
         setSelectedItemNames(new Set());
         setLastClickedIndex(-1);
       }
       // Ensure drag state is cleared after sidebar drop handling
       setDraggedItemNames(null);
       // Drag state (draggedItemNames) will be cleared by handleDragEnd automatically
  };
  // --- END NEW Sidebar Drop Handler ---

  // --- Clipboard Handlers ---
  const handleCopy = () => {
    const selectedPaths = Array.from(selectedItemNames).map(name => joinPaths(currentPath, name));
    if (selectedPaths.length > 0) {
        setClipboard('copy', selectedPaths);
        toast.success(`${selectedPaths.length} item(s) copied to clipboard.`);
    }
    closeContextMenu();
  };

  const handleCut = () => {
    const selectedPaths = Array.from(selectedItemNames).map(name => joinPaths(currentPath, name));
    if (selectedPaths.length > 0) {
        setClipboard('cut', selectedPaths);
        toast.success(`${selectedPaths.length} item(s) cut to clipboard.`);
    }
    closeContextMenu();
  };

  const handlePaste = async () => {
    closeContextMenu();
    if (!clipboard) {
      toast.error("Clipboard is empty.");
      return;
    }

    const { operation, paths: sourcePaths } = clipboard;
    const destinationDir = currentPath;
    let successCount = 0;
    let errorCount = 0;
    let firstError = null;

    toast.loading(`Pasting ${sourcePaths.length} item(s)...`, { id: 'paste-toast' });

    for (const sourcePath of sourcePaths) {
        // Ensure source still exists, especially for 'cut'
        // (Though store actions should handle this implicitly)
        const action = operation === 'copy' ? copyItem : moveItem;
        const result = action(sourcePath, destinationDir);

        if (!result.success) {
            errorCount++;
            if (!firstError) firstError = result.error || `Failed to ${operation} item`;
            console.error(`Failed ${operation}: ${sourcePath} -> ${destinationDir}`, result.error);
        } else {
            successCount++;
        }
    }

    toast.dismiss('paste-toast');
    if (successCount > 0) {
        toast.success(`Successfully ${operation === 'copy' ? 'copied' : 'moved'} ${successCount} item(s).`);
    }
    if (errorCount > 0) {
        toast.error(`Failed to ${operation} ${errorCount} item(s). ${firstError ? `(${firstError})` : ''}`);
    }

    // Clear clipboard only on successful 'cut' operation IF all items were moved
    if (operation === 'cut' && errorCount === 0) {
        clearClipboard();
    }
  };

  // --- Properties Modal Handler ---
  const openPropertiesModal = (item) => {
     setPropertiesItem(item);
     setIsPropertiesOpen(true);
     closeContextMenu();
  };

  const closePropertiesModal = () => {
     setIsPropertiesOpen(false);
     setPropertiesItem(null);
  };

  // --- Path Bar Handlers ---
  const handleBreadcrumbClick = (targetPath) => {
    setIsEditingPath(false); // Ensure edit mode is off
    setCurrentPath(targetPath);
  };

  const handlePathEditStart = () => {
    setEditingPathValue(currentPath); // Set input value to current path
    setIsEditingPath(true); // Enter edit mode
    // Focus is handled by useEffect
  };

  const handlePathInputChange = (e) => {
    setEditingPathValue(e.target.value);
  };

  const handlePathInputBlur = () => {
    setIsEditingPath(false); // Exit edit mode on blur, discarding changes
  };

  const handlePathInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent potential form submission if wrapped in form
      const newPath = editingPathValue.trim();
      const result = setCwd(newPath); // Use setCwd as it handles relative/absolute paths
      if (result.success) {
        // setCurrentPath will be updated via store subscription indirectly
        // or directly if setCwd doesn't trigger a re-render based on cwd change?
        // For safety, let's also call setCurrentPath if the resolved path is different
        // (resolvePath isn't directly available here, but setCwd handles it)
        setIsEditingPath(false); // Exit edit mode
      } else {
        toast.error(result.error || `Invalid path: ${newPath}`);
        // Keep editing mode active on error?
        // pathInputRef.current?.focus();
        // pathInputRef.current?.select();
      }
    } else if (e.key === 'Escape') {
        setIsEditingPath(false); // Exit edit mode on Escape, discard changes
    }
  };

  // --- Native Drag/Drop Handlers for OS Files ---
  const handleOsDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Check if dragged items contain files
      if (e.dataTransfer.types.includes('Files')) {
         setIsOsDraggingOver(true);
      }
  };

  const handleOsDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
       // Explicitly set drop effect (though default might be okay)
       e.dataTransfer.dropEffect = 'copy'; 
  };

  const handleOsDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Heuristic to prevent flickering when moving over child elements
      // Check if the related target is outside the main drop zone
      const dropZone = containerRef.current; // Assuming containerRef points to the main content div
       if (!dropZone || !dropZone.contains(e.relatedTarget)) {
          setIsOsDraggingOver(false);
       } else {
           // console.log("Drag leave ignored, likely over child");
       }
  };

  const handleOsDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOsDraggingOver(false);

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) {
          return;
      }

      console.log(`[FileExplorer] Dropped ${files.length} files from OS.`);
      let successCount = 0;
      let errorCount = 0;
      let readPromises = [];

      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const newFilePath = joinPaths(currentPath, file.name);

          console.log(` - Processing dropped file: ${file.name} (Size: ${file.size}, Type: ${file.type})`);

          // Basic check to prevent overwriting directories (more robust check in store action)
          // if (items[file.name]?.type === 'directory') {
          //    toast.error(`Cannot overwrite directory '${file.name}'`);
          //    errorCount++;
          //    continue;
          // }
          
          // Read text files, otherwise just pass metadata
          if (file.type.startsWith('image/')) { // Handle image files
              const reader = new FileReader();
              const promise = new Promise((resolve, reject) => {
                  reader.onload = (readEvent) => {
                      const dataUrl = readEvent.target.result;
                      // Store the Data URL as content
                      const result = createFile(newFilePath, { content: dataUrl, size: file.size });
                      if (result.success) {
                          successCount++;
                          resolve();
                      } else {
                          toast.error(result.error || `Failed to create image file entry '${file.name}'`);
                          errorCount++;
                          reject(result.error);
                      }
                  };
                  reader.onerror = (error) => {
                      toast.error(`Error reading image file '${file.name}'`);
                      errorCount++;
                      reject(error);
                  };
                  reader.readAsDataURL(file); // Read as Data URL
              });
              readPromises.push(promise);
          } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) { // Handle text files
              const reader = new FileReader();
              const promise = new Promise((resolve, reject) => {
                  reader.onload = (readEvent) => {
                      const content = readEvent.target.result;
                      const result = createFile(newFilePath, { content: content, size: file.size });
                      if (result.success) {
                          successCount++;
                          resolve();
                      } else {
                          toast.error(result.error || `Failed to create file '${file.name}'`);
                          errorCount++;
                          reject(result.error);
                      }
                  };
                  reader.onerror = (error) => {
                      toast.error(`Error reading file '${file.name}'`);
                      errorCount++;
                      reject(error);
                  };
                  reader.readAsText(file);
              });
              readPromises.push(promise);
          } else {
              // For non-text files, just create the entry with size
              const result = createFile(newFilePath, { content: '', size: file.size });
              if (result.success) {
                  successCount++;
              } else {
                  toast.error(result.error || `Failed to create file '${file.name}'`);
                  errorCount++;
              }
          }
      }

      // Wait for all file reads (if any) to complete before showing final toast
      Promise.allSettled(readPromises).then(() => {
          if (successCount > 0) {
              toast.success(`Successfully added ${successCount} file(s).`);
          }
          // Error toasts are shown individually during processing
          console.log(`OS Drop finished: ${successCount} success, ${errorCount} errors.`);
          // Filesystem should update via store watcher
      });
  };

  // NEW: Function to handle view mode change and save setting
  const changeViewMode = (newMode) => {
    setViewMode(newMode);
    updateFileExplorerSettings({ defaultView: newMode }); // Save to store
  };

  // --- Render Logic ---
  // Generate breadcrumb segments
  const pathSegments = currentPath === '/' 
      ? [{ name: 'Root', path: '/' }] 
      : ['/', ...currentPath.split('/').filter(Boolean)].map((segment, index, arr) => {
          const name = segment === '/' ? 'Root' : segment;
          const path = segment === '/' 
              ? '/' 
              : '/' + arr.slice(1, index + 1).join('/');
          return { name, path };
      });

  // Helper function to get the appropriate icon component based on item type/name
  const getItemIcon = (item) => {
    if (item.type === 'directory') {
      return <FaFolder className="text-yellow-400"/>;
    }
    const lowerCaseName = item.name.toLowerCase();
    if (lowerCaseName.endsWith('.txt')) {
      return <FiFileText className="text-gray-400 dark:text-gray-300"/>;
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(lowerCaseName)) {
      return <FiImage className="text-gray-400 dark:text-gray-300"/>;
    } else {
      return <FaFile className="text-gray-400 dark:text-gray-300"/>; // Default file icon
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 relative"
      onClick={handleBackgroundClick}
    >
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700 space-x-2 flex-shrink-0">
        <button onClick={navigateUp} disabled={currentPath === '/'} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 transition-colors duration-150" aria-label="Go up a directory">
          <FaArrowLeft className="w-4 h-4" />
        </button>
        
        {/* Path/Breadcrumb Area */}
        <div className="flex-grow bg-white dark:bg-gray-900 rounded px-2 py-1 h-7 min-w-0" onClick={!isEditingPath ? handlePathEditStart : undefined}>
          {isEditingPath ? (
            <input 
              ref={pathInputRef}
              type="text"
              value={editingPathValue}
              onChange={handlePathInputChange}
              onBlur={handlePathInputBlur}
              onKeyDown={handlePathInputKeyDown}
              className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 p-0"
            />
          ) : (
            <div className="flex items-center h-full overflow-hidden whitespace-nowrap">
              {pathSegments.map((segment, index) => (
                <React.Fragment key={segment.path}>
                  {index > 0 && <span className="mx-1 text-gray-400 dark:text-gray-500 text-xs">/</span>}
                  <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering edit mode
                        if (index < pathSegments.length - 1) { // Don't navigate if clicking last segment
                            handleBreadcrumbClick(segment.path);
                        }
                    }}
                    className={`text-sm p-0 m-0 bg-transparent border-none rounded px-1 
                               ${index === pathSegments.length - 1 
                                 ? 'font-semibold text-gray-800 dark:text-gray-200 cursor-default' 
                                 : 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 hover:underline'} `}
                    title={segment.path}
                    disabled={index === pathSegments.length - 1}
                  >
                    {segment.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        
        {/* Search Input - Use rawSearchTerm for value */}
        <div className="relative flex-shrink-0">
          <input 
            type="search" 
            placeholder="Search..." 
            value={rawSearchTerm} // Use raw term for input value
            onChange={(e) => setRawSearchTerm(e.target.value)} // Update raw term on change
            className="px-2 py-1 h-7 text-sm bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
          />
           {rawSearchTerm && ( // Show clear button based on raw term
              <button 
                 onClick={() => { setRawSearchTerm(''); setDebouncedSearchTerm(''); }} // Clear both terms
                 className="absolute right-1 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                 aria-label="Clear search"
              >
                  <VscChromeClose className="w-4 h-4" />
              </button>
           )}
        </div>

        {/* View Mode Toggle Buttons - Use changeViewMode */} 
        <button 
          onClick={() => changeViewMode('grid')} // Use new handler
          className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} transition-colors duration-150`}
          aria-label="Grid View"
          title="Grid View"
          disabled={viewMode === 'grid'}
        >
          <FaThLarge className="w-4 h-4" />
        </button>
        <button 
          onClick={() => changeViewMode('list')} // Use new handler
          className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} transition-colors duration-150`}
          aria-label="List View"
          title="List View"
          disabled={viewMode === 'list'}
        >
          <FaList className="w-4 h-4" />
        </button>
      </div>

      {/* Main container with Sidebar and Content */}
      <div className="flex flex-grow overflow-hidden"> 

        {/* Sidebar */}
        <FileTreeSidebar 
           currentPath={currentPath} 
           onNavigate={setCurrentPath} 
           draggedItemNames={draggedItemNames} // Pass dragged items state
           onDropItem={handleSidebarDrop} // Pass the drop handler
        />

        {/* Main Content Area (Items List/Grid) */}
        <div 
           className={`flex-grow overflow-auto p-2 relative ${isOsDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/50 border-2 border-dashed border-blue-400 dark:border-blue-600' : ''}`}
           onContextMenu={handleBackgroundContextMenu}
           // Add native drag handlers
           onDragEnter={handleOsDragEnter}
           onDragOver={handleOsDragOver} 
           onDragLeave={handleOsDragLeave}
           onDrop={handleOsDrop}
           ref={containerRef} // Use containerRef for checking dragleave target
        >
          {filteredItems.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic text-center mt-4">
              {rawSearchTerm ? `No items found matching "${rawSearchTerm}"` : 'Folder is empty'}
            </div>
          ) : viewMode === 'grid' ? (
            // --- GRID VIEW --- 
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
              {filteredItems.map((item) => {
                const originalIndex = sortedItems.findIndex(sortedItem => sortedItem.name === item.name);
                const isSelected = selectedItemNames.has(item.name);
                const isDraggingThis = draggedItemNames?.has(item.name);
                const isDragOverTarget = item.type === 'directory' && dragOverFolderName === item.name;
                const itemPath = joinPaths(currentPath, item.name); // Get full item path
                const isCut = clipboard?.operation === 'cut' && clipboard?.paths.includes(itemPath); // Check if item is cut
                return (
                  <li 
                    key={item.name}
                    className={`item p-2 flex flex-col items-center justify-center text-center cursor-pointer rounded break-words transition-colors duration-100 
                               ${isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} 
                               ${isDragOverTarget ? 'outline outline-2 outline-blue-500 dark:outline-blue-400 outline-offset-1 bg-blue-100 dark:bg-blue-800/50' : ''} 
                               ${isDraggingThis ? 'opacity-50 scale-95' : isCut ? 'opacity-60' : ''}`} // Apply opacity if dragging OR cut
                    onClick={(e) => handleItemClick(e, item.name, originalIndex)}
                    onDoubleClick={() => handleItemDoubleClick(item.name, item.type)}
                    onContextMenu={(e) => handleItemContextMenu(e, item, originalIndex)}
                    draggable={selectedItemNames.has(item.name)}
                    onDragStart={(e) => handleDragStart(e, item.name)}
                    onDragEnd={handleDragEnd}
                    onDragOver={item.type === 'directory' ? (e) => handleDragOver(e, item.name) : undefined}
                    onDragLeave={item.type === 'directory' ? handleDragLeave : undefined}
                    onDrop={item.type === 'directory' ? (e) => handleDrop(e, item.name) : undefined}
                    title={item.name}
                  >
                    <div className="text-4xl mb-1">{getItemIcon(item)}</div>
                    <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap w-full">
                      {item.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
             // --- LIST VIEW --- 
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-2 w-1/2">Name</th>
                            <th scope="col" className="px-4 py-2">Type</th>
                            <th scope="col" className="px-4 py-2">Size</th>
                            <th scope="col" className="px-4 py-2">Date Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => {
                          const originalIndex = sortedItems.findIndex(sortedItem => sortedItem.name === item.name);
                          const isSelected = selectedItemNames.has(item.name);
                          const isDraggingThis = draggedItemNames?.has(item.name);
                          const isDragOverTarget = item.type === 'directory' && dragOverFolderName === item.name;
                          const itemPath = joinPaths(currentPath, item.name); // Get full item path
                          const isCut = clipboard?.operation === 'cut' && clipboard?.paths.includes(itemPath); // Check if item is cut
                          return (
                            <tr 
                              key={item.name}
                              className={`border-b dark:border-gray-700 cursor-pointer transition-colors duration-100 relative 
                                         ${isSelected 
                                           ? 'bg-blue-100 dark:bg-blue-800/80 border-l-2 border-blue-500 dark:border-blue-400' 
                                           : 'hover:bg-gray-50 dark:hover:bg-gray-600/50'} 
                                         ${isDragOverTarget ? 'outline outline-1 outline-blue-500 dark:outline-blue-400 outline-offset-0 bg-blue-50 dark:bg-blue-900/30' : ''} 
                                         ${isDraggingThis || isCut ? 'opacity-60' : ''}`} // Apply opacity if dragging OR cut
                              onClick={(e) => handleItemClick(e, item.name, originalIndex)}
                              onDoubleClick={() => handleItemDoubleClick(item.name, item.type)}
                              onContextMenu={(e) => handleItemContextMenu(e, item, originalIndex)}
                              draggable={selectedItemNames.has(item.name)}
                              onDragStart={(e) => handleDragStart(e, item.name)}
                              onDragEnd={handleDragEnd}
                              onDragOver={item.type === 'directory' ? (e) => handleDragOver(e, item.name) : undefined}
                              onDragLeave={item.type === 'directory' ? handleDragLeave : undefined}
                              onDrop={item.type === 'directory' ? (e) => handleDrop(e, item.name) : undefined}
                            >
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                    <span className="w-4 h-4 mr-2 flex-shrink-0">{getItemIcon(item)}</span>
                                    <span className="truncate" title={item.name}>{item.name}</span>
                                </td>
                                <td className="px-4 py-2 capitalize">{item.type}</td>
                                <td className="px-4 py-2 text-right">{item.type === 'file' ? formatBytes(item.size) : '-'}</td>
                                <td className="px-4 py-2">{formatDate(item.lastModified)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar - Update message to use debounced term for count */}
      <div className="p-1 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        {selectedItemNames.size > 0
           ? `${selectedItemNames.size} item${selectedItemNames.size > 1 ? 's' : ''} selected`
           : `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}${debouncedSearchTerm ? ` found matching "${debouncedSearchTerm}"` : ''}` // Use debounced term in status
        }
      </div>

      {/* Render Context Menu - Position relative to the main container */}
      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={closeContextMenu} />}

      {/* Render Modals Conditionally */}
      <InputModal
        isOpen={modalState.isNewFolderOpen}
        onClose={closeModal}
        title="Create New Folder"
        label="Folder Name:"
        onSubmit={handleCreateFolderSubmit}
        submitText="Create"
      />
      <InputModal
        isOpen={modalState.isNewFileOpen}
        onClose={closeModal}
        title="Create New File"
        label="File Name:"
        onSubmit={handleCreateFileSubmit}
        submitText="Create"
      />
      <InputModal
        isOpen={modalState.isRenameOpen}
        onClose={closeModal}
        title={`Rename "${modalState.targetItems[0]?.name}"`}
        label="New Name:"
        initialValue={modalState.targetItems[0]?.name || ''}
        onSubmit={handleRenameSubmit}
        submitText="Rename"
      />
      <ConfirmModal
        isOpen={modalState.isDeleteOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
      >
        Are you sure you want to delete {modalState.targetItems.length > 1 ? `${modalState.targetItems.length} items` : `"${modalState.targetItems[0]?.name}"`}? This action cannot be undone.
      </ConfirmModal>
      <SimpleDisplayModal
        isOpen={isPropertiesOpen}
        onClose={closePropertiesModal}
        title={`Properties: ${propertiesItem?.name}`}
      >
        {propertiesItem && (
            <div className="text-sm space-y-2 p-4">
                <p><strong>Name:</strong> {propertiesItem.name}</p>
                <p><strong>Type:</strong> {propertiesItem.type === 'directory' ? 'Folder' : 'File'}</p>
                <p><strong>Location:</strong> {currentPath}</p>
                <p><strong>Size:</strong> {propertiesItem.type === 'file' ? formatBytes(propertiesItem.size) : '-'}</p>
                <p><strong>Modified:</strong> {formatDate(propertiesItem.lastModified)}</p>
                {/* Add Created date if available later */}
            </div>
        )}
      </SimpleDisplayModal>

    </div>
  );
}

export default FileExplorer; 