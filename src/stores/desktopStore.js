import { create } from 'zustand';
import { produce } from 'immer';
import { persist } from 'zustand/middleware';
import { FaFolder } from "react-icons/fa"; // Example icon for File Explorer
import { FiTerminal, FiSettings, FiFileText, FiImage } from "react-icons/fi"; // Added FiImage

// --- Icon Mapping ---
// Maps string identifiers to actual icon components
const iconComponentMap = {
  folder: FaFolder,
  terminal: FiTerminal,
  settings: FiSettings,
  'file-text': FiFileText, // Added text editor icon
  'image': FiImage, // Added image viewer icon
  default: null // Or perhaps: () => ' ? ' 
};

// Function to get an icon component by name
export const getIconComponent = (iconName) => {
    // If the mapping returns null, DesktopIcon can handle the placeholder
    return iconComponentMap[iconName] || null;
};

// --- Initial State Values (Use string identifiers for icons) ---
const initialIcons = [
  // Store 'icon' as a string identifier now
  { id: 'file-explorer', label: 'File Explorer', icon: 'folder', position: { x: 20, y: 20 } },
  { id: 'terminal', label: 'Terminal', icon: 'terminal', position: { x: 20, y: 130 } },
  { id: 'settings', label: 'Settings', icon: 'settings', position: { x: 20, y: 240 } },
  { id: 'text-editor', label: 'Text Editor', icon: 'file-text', position: { x: 120, y: 20 } }, // Added Text Editor icon
  { id: 'image-viewer', label: 'Image Viewer', icon: 'image', position: { x: 120, y: 130 } }, // Added Image Viewer icon
];
const initialFs = {
  '/': { 
    'home': { type: 'directory', content: { 
      'documents': { type: 'directory', content: {}, size: 0, lastModified: new Date(2023, 10, 10, 9, 0, 0) },
      'readme.txt': { type: 'file', content: 'Welcome to the simulated OS!\nEdit this file content.', size: 1024, lastModified: new Date(2023, 10, 11, 14, 30, 0) },
      'image.png': { type: 'file', content: '', size: 153600, lastModified: new Date(2023, 9, 5, 11, 15, 0) },
    } },
    'system': { type: 'directory', content: { 
      'config.sys': { type: 'file', content: 'CONFIG_DATA', size: 512, lastModified: new Date(2023, 8, 1, 0, 0, 0)}
    }, size: 0, lastModified: new Date(2023, 8, 1, 0, 0, 0) },
  },
};
const initialCwd = '/home';

// Default window dimensions
const DEFAULT_WINDOW_WIDTH = 800;
const DEFAULT_WINDOW_HEIGHT = 600;

// --- Counters (Managed outside persisted state, rehydrated on load) ---
let nextWindowId = 0;
let highestZIndex = 0;

// --- Deep Copy Helper for FS Nodes (avoids sharing references) ---
const deepCopyNode = (node) => {
  if (!node) return null;
  if (node.type === 'file') {
    // Simple copy for files (assuming content is primitive or easily copied)
    return { ...node }; 
  } else if (node.type === 'directory') {
    const newContent = {};
    for (const key in node.content) {
      newContent[key] = deepCopyNode(node.content[key]); // Recursively copy content
    }
    return { type: 'directory', content: newContent };
  }
  return null; // Should not happen for valid nodes
};

// Helper function to join paths correctly (needed for copyItem)
const joinPaths = (...paths) => {
  return '/' + paths.filter(Boolean).join('/').replace(/\/+/g, '/');
};

// --- Store Definition with Persist Middleware ---
const useDesktopStore = create(
  persist(
    (set, get) => {
      // --- Helper Functions needing state/get (stay inside) ---
      const resolvePath = (rawPath, cwd) => {
        if (!rawPath) return null;
        let segments;
        let baseSegments;
        if (rawPath.startsWith('/')) {
          baseSegments = [];
          segments = rawPath.split('/').filter(p => p !== '');
        } else {
          baseSegments = cwd.split('/').filter(p => p !== '');
          segments = rawPath.split('/').filter(p => p !== '');
        }
        let resolvedSegments = [...baseSegments];
        for (const segment of segments) {
          if (segment === '.') { continue; }
          if (segment === '..') {
            if (resolvedSegments.length > 0) { resolvedSegments.pop(); } else { return null; }
          } else {
            resolvedSegments.push(segment);
          }
        }
        return '/' + resolvedSegments.join('/');
      };
      
      const getNode = (fs, normalizedAbsolutePath) => {
        if (normalizedAbsolutePath === null) return null;
        const pathSegments = normalizedAbsolutePath.split('/').filter(p => p !== '');
        let current = fs['/'];
        // Handle root case directly
        if (pathSegments.length === 0) return { type: 'directory', content: current }; 
        let node = { type: 'directory', content: current };
        for (let i = 0; i < pathSegments.length; i++) {
          const part = pathSegments[i];
          if (node.type !== 'directory' || !node.content || !node.content[part]) { return null; }
          node = node.content[part];
        }
        return node;
      };
      // --- END Helpers inside ---

      // --- Actions (Defined separately for clarity) ---
      const actions = {
        // === Desktop Actions ===
        openWindow: (iconId, context = null) => {
          const { icons, windows } = get();
          const icon = icons.find(i => i.id === iconId);
          if (!icon) {
            console.error("[desktopStore] openWindow failed: Icon not found for id:", iconId);
            return;
          }
          console.log("[desktopStore] Found icon:", icon); // Log 1

          // Don't automatically reuse minimized windows if context is provided (e.g., opening a specific file)
          // If needed, more complex logic could find an existing editor for the SAME file path.
          if (!context) { 
            const existingWindow = windows.find(w => w.iconId === iconId && w.minimized);
            if (existingWindow) {
              get().toggleMinimize(existingWindow.id);
              return;
            }
          }
          
          highestZIndex++;
          const newWindowId = nextWindowId++;
          console.log("[desktopStore] Generated new ID and ZIndex:", {newWindowId, highestZIndex}); // Log 2
          
          const offsetX = (windows.length % 5) * 30;
          const offsetY = (windows.length % 5) * 30;
          const centeredX = Math.max(0, (window.innerWidth / 2) - (DEFAULT_WINDOW_WIDTH / 2) + offsetX);
          const centeredY = Math.max(0, (window.innerHeight / 2) - (DEFAULT_WINDOW_HEIGHT / 2) + offsetY);
          console.log("[desktopStore] Calculated position:", {centeredX, centeredY}); // Log 3

          // Keep initial title logic for now, TextEditor can update it
          const initialTitle = context?.filePath 
              ? `${context.filePath.split('/').pop()} - ${icon.label}` 
              : icon.label; // Generic title if no path

          const newWindow = {
            id: newWindowId, iconId: icon.id, 
            title: initialTitle, 
            zIndex: highestZIndex,
            width: DEFAULT_WINDOW_WIDTH, height: DEFAULT_WINDOW_HEIGHT,
            x: centeredX, y: centeredY,
            minimized: false, maximized: false, previousState: null,
            context: context, 
          };
          console.log("[desktopStore] Adding new window:", newWindow); // Original Log (now Log 4)
          set({ windows: [...windows, newWindow], activeWindowId: newWindowId });
        },
        closeWindow: (windowId) => {
          const { dirtyWindowIds, windows } = get();

          // Get the actual closing logic into a separate function
          const performClose = () => {
            set((state) => {
              const remainingWindows = state.windows.filter((w) => w.id !== windowId);
              let newActiveWindowId = state.activeWindowId;
              if (state.activeWindowId === windowId) {
                newActiveWindowId = remainingWindows.length > 0
                  ? [...remainingWindows].sort((a, b) => b.zIndex - a.zIndex)[0].id
                  : null;
              }
              const newDirtyIds = state.dirtyWindowIds.filter(id => id !== windowId);
              return {
                windows: remainingWindows,
                activeWindowId: newActiveWindowId,
                dirtyWindowIds: newDirtyIds
              };
            });
          };

          // Check if the window is dirty
          if (dirtyWindowIds.includes(windowId)) {
            const window = windows.find(w => w.id === windowId);
            const title = window ? `${window.title || 'Window'} - Unsaved Changes` : 'Unsaved Changes';
            const message = `Do you want to close without saving changes in ${window?.title || 'this window'}?`;
            
            // Show custom confirmation modal instead of window.confirm
            get().showConfirmation(title, message, performClose); 
            
            // Abort the default closing flow here, the modal will handle it
            return; 
          } else {
            // If not dirty, close immediately
            performClose();
          }
        },
        bringToFront: (windowId) => {
          const { windows, activeWindowId } = get();
          const targetWindow = windows.find(w => w.id === windowId);
          if (!targetWindow) return;
          if (targetWindow.minimized) {
            get().toggleMinimize(windowId);
            return;
          }
          if (activeWindowId === windowId) return;
          highestZIndex++;
          set({ 
            windows: windows.map(w => w.id === windowId ? { ...w, zIndex: highestZIndex } : w),
            activeWindowId: windowId
          });
        },
        moveWindow: (windowId, position) => {
           set(produce(draft => {
              const win = draft.windows.find(w => w.id === windowId);
              if (win && !win.maximized) { win.x = position.x; win.y = position.y; }
           }));
        },
        resizeWindow: (windowId, size) => {
            set(produce(draft => {
                const win = draft.windows.find(w => w.id === windowId);
                if (win && !win.maximized) { win.width = size.width; win.height = size.height; }
            }));
        },
        toggleMinimize: (windowId) => {
            set(produce(draft => {
                const winIndex = draft.windows.findIndex(w => w.id === windowId);
                if (winIndex === -1) return;
                const isMinimized = draft.windows[winIndex].minimized;
                draft.windows[winIndex].minimized = !isMinimized;
                if (isMinimized) {
                    highestZIndex++;
                    draft.windows[winIndex].zIndex = highestZIndex;
                    draft.activeWindowId = windowId;
                } else {
                    if (draft.activeWindowId === windowId) {
                        const otherWindows = draft.windows.filter(w => w.id !== windowId && !w.minimized);
                        draft.activeWindowId = otherWindows.length > 0
                            ? [...otherWindows].sort((a, b) => b.zIndex - a.zIndex)[0].id : null;
                    }
                }
            }));
        },
        toggleMaximize: (windowId) => {
            set(produce(draft => {
                const win = draft.windows.find(w => w.id === windowId);
                if (!win) return;
                if (win.maximized) {
                    if (win.previousState) {
                        win.width = win.previousState.width; win.height = win.previousState.height;
                        win.x = win.previousState.x; win.y = win.previousState.y;
                        win.previousState = null;
                    }
                    win.maximized = false;
                } else {
                    win.previousState = { width: win.width, height: win.height, x: win.x, y: win.y };
                    win.x = 0; win.y = 0;
                    win.width = window.innerWidth; win.height = window.innerHeight - 48;
                    win.maximized = true;
                }
                highestZIndex++;
                win.zIndex = highestZIndex;
                draft.activeWindowId = windowId;
            }));
        },
        moveIcon: (iconId, newPosition) => {
          set(produce((draft) => {
            const iconIndex = draft.icons.findIndex(icon => icon.id === iconId);
            if (iconIndex !== -1) { draft.icons[iconIndex].position = { x: newPosition.x, y: newPosition.y }; }
          }));
        },
        resizeAndMoveWindow: (windowId, { width, height, x, y }) => {
            set(produce(draft => {
                const win = draft.windows.find(w => w.id === windowId);
                if (win && !win.maximized) {
                    win.width = width; win.height = height;
                    win.x = x; win.y = y;
                }
            }));
        },
        
        // === File System Actions ===
        setCwd: (rawPath) => {
          const { cwd, fs } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (normalizedPath === null) { return { success: false, error: `cd: invalid path: ${rawPath}` }; }
          const node = getNode(fs, normalizedPath);
          if (node && node.type === 'directory') {
            set({ cwd: normalizedPath });
            return { success: true };
          } else {
            return { success: false, error: `cd: '${rawPath}': Not a directory or not found` };
          }
        },
        listDirectory: (rawPath) => {
          const { cwd, fs } = get();
          const normalizedPath = resolvePath(rawPath || '.', cwd);
          const node = getNode(fs, normalizedPath);
          if (node && node.type === 'directory') {
            return { success: true, data: node.content };
          } else {
            return { success: false, error: `ls: cannot access '${rawPath || ''}': No such file or directory` };
          }
        },
        createDirectory: (rawPath) => {
          const { cwd } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (normalizedPath === null || normalizedPath === '/') { return { success: false, error: `mkdir: invalid path: ${rawPath}` }; }
          const pathSegments = normalizedPath.split('/').filter(p => p !== '');
          const dirName = pathSegments.pop();
          const parentPath = '/' + pathSegments.join('/');
          let success = false; let error = null;
          set(produce((draft) => {
            const parentNode = getNode(draft.fs, parentPath);
            if (!parentNode || parentNode.type !== 'directory') {
              error = `mkdir: cannot create directory '${rawPath}': Parent directory does not exist`; return;
            }
            if (parentNode.content[dirName]) {
              error = `mkdir: cannot create directory '${rawPath}': File exists`; return;
            }
            parentNode.content[dirName] = {
              type: 'directory', content: {}, size: 0, lastModified: new Date(),
            };
            success = true;
          }));
          return { success, error };
        },
        createFile: (rawPath, options = { content: '', size: 0 }) => {
          const initialContent = options.content ?? '';
          const initialSize = options.size ?? initialContent.length; // Calculate size if not provided

          const { cwd } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (normalizedPath === null || normalizedPath === '/') { return { success: false, error: `touch: invalid path: ${rawPath}` }; }
          const pathSegments = normalizedPath.split('/').filter(p => p !== '');
          const fileName = pathSegments.pop();
          const parentPath = '/' + pathSegments.join('/');
          let success = false; let error = null;
          set(produce((draft) => {
              const parentNode = getNode(draft.fs, parentPath);
              if (!parentNode || parentNode.type !== 'directory') {
                error = `touch: cannot touch '${rawPath}': Parent directory does not exist`; return;
              }
              if (parentNode.content[fileName]) {
                console.warn(`touch: Updating timestamp for existing file '${fileName}' (simulation)`);
                // Also update modified time here?
                if(parentNode.content[fileName].type === 'file') {
                    parentNode.content[fileName].lastModified = new Date();
                }
                success = true; return; 
              }
              parentNode.content[fileName] = {
                type: 'file', 
                content: initialContent, 
                size: initialSize, 
                lastModified: new Date(),
              };
              success = true;
          }));
          return { success, error };
        },
        deleteItem: (rawPath) => {
          const { cwd } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (normalizedPath === null || normalizedPath === '/') {
            return { success: false, error: `delete: invalid path: ${rawPath}` };
          }
          const pathSegments = normalizedPath.split('/').filter(p => p !== '');
          const itemName = pathSegments.pop();
          const parentPath = '/' + pathSegments.join('/');
          let success = false; let error = null;
          set(produce((draft) => {
            const parentNode = getNode(draft.fs, parentPath);
            if (!parentNode || parentNode.type !== 'directory') {
              error = `delete: cannot delete '${rawPath}': Parent directory does not exist`; return;
            }
            if (!parentNode.content[itemName]) {
              error = `delete: cannot delete '${rawPath}': Item does not exist`; return;
            }
            if (parentNode.content[itemName].type === 'directory' && Object.keys(parentNode.content[itemName].content).length > 0) {
               error = `delete: cannot delete '${rawPath}': Directory not empty`; return; 
            }
            delete parentNode.content[itemName];
            success = true;
          }));
          return { success, error };
        },
        renameItem: (rawPath, newName) => {
          const { cwd } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (!newName || newName.includes('/')) {
            return { success: false, error: `rename: invalid new name: ${newName}` };
          }
          if (normalizedPath === null || normalizedPath === '/') {
            return { success: false, error: `rename: invalid path: ${rawPath}` };
          }
          const pathSegments = normalizedPath.split('/').filter(p => p !== '');
          const oldName = pathSegments.pop();
          const parentPath = '/' + pathSegments.join('/');
          let success = false; let error = null;
          set(produce((draft) => {
            const parentNode = getNode(draft.fs, parentPath);
            if (!parentNode || parentNode.type !== 'directory') {
              error = `rename: cannot rename '${rawPath}': Parent directory does not exist`; return;
            }
            if (!parentNode.content[oldName]) {
              error = `rename: cannot rename '${rawPath}': Item does not exist`; return;
            }
            if (parentNode.content[newName]) {
              error = `rename: cannot rename to '${newName}': Name already exists`; return;
            }
            const itemToRename = parentNode.content[oldName];
            itemToRename.lastModified = new Date();
            parentNode.content[newName] = itemToRename;
            delete parentNode.content[oldName];
            success = true;
          }));
          return { success, error };
        },
        readFile: (rawPath) => {
          const { cwd, fs } = get();
          const normalizedPath = resolvePath(rawPath, cwd);
          if (normalizedPath === null) {
            return { success: false, error: `cat: invalid path: ${rawPath}` };
          }
          const node = getNode(fs, normalizedPath);
          if (!node) {
            return { success: false, error: `cat: ${rawPath}: No such file or directory` };
          }
          if (node.type !== 'file') {
            return { success: false, error: `cat: ${rawPath}: Is a directory` };
          }
          return { success: true, data: node.content };
        },
        moveItem: (rawSourcePath, rawDestPath) => {
            const { cwd } = get();
            const sourcePath = resolvePath(rawSourcePath, cwd);
            let destPath = resolvePath(rawDestPath, cwd);
            if (sourcePath === null || destPath === null) {
                return { success: false, error: `mv: invalid path specified` };
            }
            if (sourcePath === '/') { return { success: false, error: `mv: cannot move root directory` }; }
            let success = false; let error = null;
            set(produce((draft) => {
                const sourceSegments = sourcePath.split('/').filter(p => p !== '');
                const sourceName = sourceSegments.pop();
                const sourceParentPath = '/' + sourceSegments.join('/');
                const sourceParentNode = getNode(draft.fs, sourceParentPath);
                if (!sourceParentNode || sourceParentNode.type !== 'directory' || !sourceParentNode.content[sourceName]) {
                    error = `mv: cannot stat '${rawSourcePath}': No such file or directory`; return;
                }
                const sourceNode = sourceParentNode.content[sourceName];
                let destNode = getNode(draft.fs, destPath);
                let destName = sourceName;
                let destParentNode = null;
                if (destNode && destNode.type === 'directory') {
                    destParentNode = destNode.content;
                    destPath = destPath === '/' ? `/${sourceName}` : `${destPath}/${sourceName}`;
                    if (destParentNode[destName]) {
                         error = `mv: cannot move '${rawSourcePath}' to '${rawDestPath}/${sourceName}': Destination exists`; return;
                    }
                } else if (destNode) {
                     error = `mv: cannot overwrite non-directory '${rawDestPath}' with directory or file`; return;
                } else {
                    const destSegments = destPath.split('/').filter(p => p !== '');
                    if (destSegments.length === 0) { error = `mv: cannot move '${rawSourcePath}' to '/'`; return; }
                    destName = destSegments.pop();
                    const destParentPath = '/' + destSegments.join('/');
                    const parentCheck = getNode(draft.fs, destParentPath);
                     if (!parentCheck || parentCheck.type !== 'directory') {
                         error = `mv: cannot move '${rawSourcePath}' to '${rawDestPath}': Parent directory does not exist`; return;
                     }
                     destParentNode = parentCheck.content;
                }
                if (sourceNode.type === 'directory' && destPath.startsWith(sourcePath + '/')) {
                    error = `mv: cannot move directory into itself, '${rawSourcePath}' to '${rawDestPath}'`; return;
                }
                if (destParentNode) {
                    sourceNode.lastModified = new Date();
                    destParentNode[destName] = sourceNode;
                    delete sourceParentNode.content[sourceName];
                    success = true;
                } else {
                     error = `mv: failed to determine destination parent node for '${rawDestPath}'`;
                }
            }));
            return { success, error };
        },
        copyItem: (rawSourcePath, rawDestPath) => {
            const { cwd } = get();
            const sourcePath = resolvePath(rawSourcePath, cwd);
            let destPath = resolvePath(rawDestPath, cwd);
            if (sourcePath === null || destPath === null) { return { success: false, error: `cp: invalid path specified` }; }
            if (sourcePath === '/') { return { success: false, error: `cp: cannot copy root directory` }; }
            let success = false; let error = null;
            const sourceNodeInitial = getNode(get().fs, sourcePath);
            if (!sourceNodeInitial) { return { success: false, error: `cp: cannot stat '${rawSourcePath}': No such file or directory` }; }
            set(produce((draft) => {
                const sourceSegments = sourcePath.split('/').filter(p => p !== '');
                const sourceName = sourceSegments.pop();
                let destNode = getNode(draft.fs, destPath);
                let destName = sourceName; 
                let destParentNodeContent = null;
                let destParentPath = null;
                if (destNode && destNode.type === 'directory') {
                    destParentNodeContent = destNode.content;
                    destParentPath = destPath;
                    destPath = joinPaths(destPath, sourceName);
                    // Name conflict check now happens after potentially resolving parent
                } else if (destNode) {
                    error = `cp: cannot overwrite non-directory '${rawDestPath}'`; return;
                } else {
                    const destSegments = destPath.split('/').filter(p => p !== '');
                    if (destSegments.length === 0) { error = `cp: cannot copy to root '/'`; return; }
                    destName = destSegments.pop();
                    destParentPath = '/' + destSegments.join('/');
                    const parentCheck = getNode(draft.fs, destParentPath);
                    if (!parentCheck || parentCheck.type !== 'directory') {
                        error = `cp: cannot copy to '${rawDestPath}': Parent directory does not exist`; return;
                    }
                    destParentNodeContent = parentCheck.content;
                }
                // Ensure destParentNodeContent is resolved before conflict check
                if (!destParentNodeContent) {
                     error = `cp: failed to determine destination parent node for '${rawDestPath}'`; return;
                }
                let originalDestName = destName;
                let counter = 1;
                while (destParentNodeContent[destName]) {
                  const extensionIndex = originalDestName.lastIndexOf('.');
                  const baseName = extensionIndex > 0 ? originalDestName.substring(0, extensionIndex) : originalDestName;
                  const extension = extensionIndex > 0 ? originalDestName.substring(extensionIndex) : '';
                  counter++;
                  destName = `${baseName} (${counter})${extension}`;
                  if (counter > 100) { error = `cp: Could not find a unique name for copy of '${originalDestName}'`; return; }
                }
                if(originalDestName !== destName) {
                     destPath = joinPaths(destParentPath, destName);
                }
                if (sourceNodeInitial.type === 'directory' && destPath.startsWith(sourcePath + '/')) {
                     error = `cp: cannot copy directory into itself, '${rawSourcePath}' to '${rawDestPath}'`; return;
                }
                const copiedNode = deepCopyNode(sourceNodeInitial);
                copiedNode.lastModified = new Date();
                destParentNodeContent[destName] = copiedNode; 
                success = true;
            }));
            return { success, error };
        },
        
        // === Clipboard Actions ===
        setClipboard: (operation, paths) => {
            if ((operation !== 'copy' && operation !== 'cut') || !Array.isArray(paths) || paths.length === 0) {
                console.error('Invalid setClipboard arguments');
                return;
            }
            console.log("Setting clipboard:", { operation, paths }); // Debug log
            set({ clipboard: { operation, paths } });
        },
        clearClipboard: () => {
            console.log("Clearing clipboard"); // Debug log
            set({ clipboard: null });
        },

        // === NEW: writeFile Action ===
        writeFile: (rawPath, content) => {
            const { cwd } = get();
            const normalizedPath = resolvePath(rawPath, cwd);
            if (normalizedPath === null || normalizedPath === '/') { 
                return { success: false, error: `write: invalid path: ${rawPath}` }; 
            }

            let success = false;
            let error = null;

            set(produce((draft) => {
                const pathSegments = normalizedPath.split('/').filter(p => p !== '');
                const fileName = pathSegments.pop();
                const parentPath = '/' + pathSegments.join('/');
                const parentNode = getNode(draft.fs, parentPath);

                if (!parentNode || parentNode.type !== 'directory') {
                    error = `write: cannot write to '${rawPath}': Parent directory does not exist`; return;
                }
                const existingNode = parentNode.content[fileName];

                if (existingNode && existingNode.type !== 'file') {
                    // Cannot overwrite a directory with a file
                    error = `write: cannot write to '${rawPath}': Destination exists and is not a file`; return;
                } else if (existingNode) {
                    // Update existing file
                    existingNode.content = content;
                    existingNode.size = content.length;
                    existingNode.lastModified = new Date();
                } else {
                    // Create new file
                    parentNode.content[fileName] = {
                        type: 'file',
                        content: content,
                        size: content.length,
                        lastModified: new Date(),
                    };
                }
                success = true;
            }));

            return { success, error };
        },
        // === END writeFile Action ===

        // === Settings Actions ===
        setFileExplorerSetting: (key, value) => {
            set(produce(draft => {
                // Basic validation or allow any key?
                if (key === 'defaultView' && (value === 'grid' || value === 'list')) {
                    draft.fileExplorerSettings[key] = value;
                } else if (key === 'showHiddenFiles' && typeof value === 'boolean') {
                    draft.fileExplorerSettings[key] = value;
                } else {
                    console.warn(`Attempted to set invalid File Explorer setting: ${key}=${value}`);
                }
            }));
        },
        setDesktopBackground: (background) => { // Expects { type: string, customUrl?: string | null }
            // Basic validation
            if (typeof background !== 'object' || !background.type) {
                console.error("Invalid background object passed to setDesktopBackground:", background);
                return;
            }
            // Clear customUrl if type is not custom
            const finalUrl = background.type === 'custom-image' ? background.customUrl : null;
            console.log("[desktopStore] Setting background:", { type: background.type, customUrl: finalUrl });
            set({ desktopBackground: { type: background.type, customUrl: finalUrl } });
        },

        // === NEW: UI Actions ===
        toggleStartMenu: (forceState) => {
           set((state) => ({ isStartMenuOpen: typeof forceState === 'boolean' ? forceState : !state.isStartMenuOpen }));
           // If opening, ensure other potential popups are closed (e.g., context menus)
           // if ((typeof forceState === 'boolean' ? forceState : !get().isStartMenuOpen)) {
           //    // Close context menu if needed (would require context menu state here or a global event)
           // }
        },
        
        // === NEW Taskbar Actions ===
        toggleTaskbarLock: () => {
          set(produce((draft) => {
            draft.isTaskbarLocked = !draft.isTaskbarLocked;
          }));
          console.log('Taskbar lock toggled:', get().isTaskbarLocked); // Optional log
        },
        // === END NEW Taskbar Actions ===

        // === NEW: Taskbar Actions ===
        pinApp: (iconId) => {
            set(produce(draft => {
                if (!draft.pinnedAppIds.includes(iconId)) {
                    draft.pinnedAppIds.push(iconId);
                }
            }));
        },
        unpinApp: (iconId) => {
            set(produce(draft => {
                draft.pinnedAppIds = draft.pinnedAppIds.filter(id => id !== iconId);
            }));
        },

        // === NEW Dirty State Actions ===
        markWindowDirty: (windowId) => {
          set(produce((draft) => {
            if (!draft.dirtyWindowIds.includes(windowId)) {
              draft.dirtyWindowIds.push(windowId);
            }
          }));
        },
        markWindowClean: (windowId) => {
          set(produce((draft) => {
            draft.dirtyWindowIds = draft.dirtyWindowIds.filter(id => id !== windowId);
          }));
        },
        // === END NEW Dirty State Actions ===

        // === NEW Confirmation Modal Actions ===
        showConfirmation: (title, message, onConfirm) => {
          set({ 
            confirmationModal: {
              isOpen: true,
              title: title,
              message: message,
              onConfirm: onConfirm, // Store the confirmation callback
            }
          });
        },
        hideConfirmation: () => {
          set({ 
            confirmationModal: {
              isOpen: false,
              title: '',
              message: '',
              onConfirm: null,
            }
          });
        },
        // === END NEW Confirmation Modal Actions ===

        // === NEW Window Title Update Action ===
        updateWindowTitle: (windowId, newTitle) => {
          set(produce((draft) => {
            const win = draft.windows.find(w => w.id === windowId);
            if (win) {
              win.title = newTitle;
            }
          }));
        },
        // === END NEW Action ===

        // === NEW Save As Dialog Actions ===
        openSaveAsDialog: (options) => { 
          // options = { initialPath: string, initialFilename: string, onSave: (fullPath) => void }
          set({ 
            saveAsDialog: {
              isOpen: true,
              initialPath: options.initialPath || '/', // Default to root if none provided
              initialFilename: options.initialFilename || 'Untitled.txt',
              onSave: options.onSave || null, // Callback to execute with the chosen path
            }
          });
        },
        closeSaveAsDialog: () => {
          set({ 
            saveAsDialog: {
              isOpen: false,
              initialPath: '/',
              initialFilename: '',
              onSave: null,
            }
          });
        },
        // === END NEW Save As Dialog Actions ===

        // === Settings / Persistence Actions === 
        updateSettings: (newSettings) => set(produce((state) => {
            // Merge potentially nested settings 
            for (const key in newSettings) {
                if (typeof newSettings[key] === 'object' && newSettings[key] !== null && !Array.isArray(newSettings[key])) {
                    // If it's an object, merge deeply
                    state.settings[key] = { ...(state.settings[key] || {}), ...newSettings[key] };
                } else {
                    // Otherwise, just assign
                    state.settings[key] = newSettings[key];
                }
            }
        })),
        
        // NEW: Specific action for File Explorer Settings
        updateFileExplorerSettings: (newFESettings) => set(produce((state) => {
             state.fileExplorerSettings = { 
                 ...(state.fileExplorerSettings || {}), // Keep existing settings
                 ...newFESettings // Overwrite with new ones
             };
         })),

        toggleNightLight: () => set(produce((state) => {
            state.isNightLightEnabled = !state.isNightLightEnabled;
        })),

      };

      // --- Returned State and Actions --- 
      return {
        // State slices
        icons: initialIcons,
        windows: [],
        activeWindowId: null,
        activeDesktopElementId: null, // Track selected desktop icon
        contextMenu: { visible: false, x: 0, y: 0, items: [], targetId: null, targetType: null },
        startMenuOpen: false, // Keep track of start menu visibility
        isDragging: false, // Track if an item is being dragged
        draggedItemId: null,
        draggedItemType: null, // 'icon' or 'window'
        // --- File System State ---
        fs: initialFs,
        cwd: initialCwd, // Current working directory for terminal or new file explorers
        // --- Taskbar State ---
        pinnedAppIds: ['file-explorer', 'terminal'], // Default pinned apps
        isTaskbarLocked: false, // <-- NEW STATE
        // Add other states as needed
        clipboard: null,
        // --- NEW: Settings State ---
        fileExplorerSettings: { defaultView: 'grid', showHiddenFiles: false },
        // --- NEW: Desktop Settings State ---
        desktopBackground: { type: 'gradient-1', customUrl: null },
        // --- NEW: UI State ---
        isStartMenuOpen: false,
        dirtyWindowIds: [], // <-- NEW STATE for unsaved changes
        confirmationModal: { isOpen: false, title: '', message: '', onConfirm: null }, // <-- NEW STATE
        saveAsDialog: { isOpen: false, initialPath: '/', initialFilename: '', onSave: null }, // <-- NEW STATE
        settings: { // General application settings
            theme: 'system', // 'light', 'dark', 'system'
            // Add other general settings here
        },
        isNightLightEnabled: false, // <-- NEW state for Night Light

        // All actions merged
        ...actions,
        // --- Hydration Logic (optional but useful for counters/non-persisted) ---
        _rehydrate: () => {
          const state = get();
          // Reset/recalculate non-persisted counters based on persisted state
          if (state.windows && state.windows.length > 0) {
            nextWindowId = Math.max(...state.windows.map(w => w.id)) + 1;
            highestZIndex = Math.max(...state.windows.map(w => w.zIndex));
          } else {
            nextWindowId = 0;
            highestZIndex = 0;
          }
          console.log("Store rehydrated", { nextWindowId, highestZIndex });
        },
        // Add helpers to the returned state
        resolvePath: resolvePath, 
        getNode: getNode,
      };
    },
    {
      name: 'os-simulator-storage', 
      partialize: (state) => ({
        // Only persist necessary state
        icons: state.icons,
        windows: state.windows,
        activeWindowId: state.activeWindowId,
        fs: state.fs,
        cwd: state.cwd,
        fileExplorerSettings: state.fileExplorerSettings,
        desktopBackground: state.desktopBackground, // Persist desktop background settings
        pinnedAppIds: state.pinnedAppIds, // Persist pinned apps
        // Do not persist clipboard or isStartMenuOpen
        settings: state.settings,
        isTaskbarLocked: state.isTaskbarLocked, // Persist taskbar lock state
        isNightLightEnabled: state.isNightLightEnabled, // <-- Persist Night Light state
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) console.error("Failed to hydrate state:", error);
          else if (state?.windows) {
             highestZIndex = Math.max(0, ...state.windows.map(w => Number(w.zIndex) || 0));
             nextWindowId = Math.max(0, ...state.windows.map(w => Number(w.id) || 0)) + 1;
             console.log("Rehydrated counters: nextId=", nextWindowId, "maxZ=", highestZIndex);
          }
        }
      },
      merge: (persistedState, currentState) => {
        // Custom merge logic if needed, for now default deep merge is likely fine
        // Ensure non-persisted state (like clipboard) isn't overwritten by absence in persistedState
        return { ...currentState, ...persistedState, clipboard: currentState.clipboard }; 
      },
    }
  )
);

export default useDesktopStore;