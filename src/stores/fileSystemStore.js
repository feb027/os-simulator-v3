import { create } from 'zustand';
import { produce } from 'immer'; // Immer simplifies immutable updates

// --- Path Resolution Helper ---

const resolvePath = (rawPath, cwd) => {
  if (!rawPath) return null; // No path provided

  let segments;
  let baseSegments;

  if (rawPath.startsWith('/')) {
    // Absolute path
    baseSegments = [];
    segments = rawPath.split('/').filter(p => p !== '');
  } else {
    // Relative path
    baseSegments = cwd.split('/').filter(p => p !== '');
    segments = rawPath.split('/').filter(p => p !== '');
  }

  let resolvedSegments = [...baseSegments];

  for (const segment of segments) {
    if (segment === '.') {
      // Stay in the current directory (do nothing)
      continue;
    } else if (segment === '..') {
      // Go up one directory
      if (resolvedSegments.length > 0) {
        resolvedSegments.pop();
      } else {
        // Tried to go above root - invalid path
        // console.error('resolvePath: Tried to navigate above root directory');
        return null;
      }
    } else {
      // Go into a subdirectory
      resolvedSegments.push(segment);
    }
  }
  
  // Return the normalized absolute path string
  return '/' + resolvedSegments.join('/');
};

// --- Helper to get node by resolved path string ---

// Adjusted getNode to work with normalized absolute path string
const getNode = (fs, normalizedAbsolutePath) => {
  if (normalizedAbsolutePath === null) return null;
  const pathSegments = normalizedAbsolutePath.split('/').filter(p => p !== '');
  let current = fs['/'];
  let node = { type: 'directory', content: current }; // Start with root

  for (let i = 0; i < pathSegments.length; i++) {
    const part = pathSegments[i];
    if (node.type !== 'directory' || !node.content || !node.content[part]) {
      // console.error(`getNode: Path part not found or not a directory: ${part} in ${normalizedAbsolutePath}`);
      return null; // Path invalid or not a directory along the way
    }
    node = node.content[part]; // Move to the next node
  }
  return node; // Return the final node
};

// --- Zustand Store Definition ---

const useFileSystemStore = create((set, get) => ({
  // Initial file system structure
  fs: {
    '/': { // Root directory always exists
      'home': { type: 'directory', content: { 
        'documents': { type: 'directory', content: {} },
        'readme.txt': { type: 'file', content: 'Welcome to the simulated OS!' }
      } },
      'system': { type: 'directory', content: {} },
    },
  },
  cwd: '/home', // Initial Current Working Directory

  // --- Actions ---

  // Change Current Working Directory
  setCwd: (rawPath) => {
    const { cwd, fs } = get();
    const normalizedPath = resolvePath(rawPath, cwd);
    if (normalizedPath === null) {
      return { success: false, error: `cd: invalid path: ${rawPath}` };
    }
    const node = getNode(fs, normalizedPath);

    if (node && node.type === 'directory') {
      set({ cwd: normalizedPath });
      return { success: true };
    } else {
      return { success: false, error: `cd: '${rawPath}': Not a directory or not found` };
    }
  },

  // List Directory Contents (returns object or null)
  listDirectory: (rawPath) => {
    const { cwd, fs } = get();
    const normalizedPath = resolvePath(rawPath || '.', cwd); // Default to cwd if no path
    const node = getNode(fs, normalizedPath);

    if (node && node.type === 'directory') {
      return { success: true, data: node.content };
    } else {
      return { success: false, error: `ls: cannot access '${rawPath || ''}': No such file or directory` };
    }
  },

  // Create Directory (mkdir)
  createDirectory: (rawPath) => {
    const { cwd } = get(); // Only need cwd initially
    const normalizedPath = resolvePath(rawPath, cwd);

    if (normalizedPath === null || normalizedPath === '/') {
      return { success: false, error: `mkdir: invalid path: ${rawPath}` };
    }
    const pathSegments = normalizedPath.split('/').filter(p => p !== '');
    const dirName = pathSegments.pop(); // Get the name of the new directory
    const parentPath = '/' + pathSegments.join('/');

    let success = false;
    let error = null;

    set(produce((draft) => {
      const parentNode = getNode(draft.fs, parentPath); // Use getNode on draft state

      if (!parentNode || parentNode.type !== 'directory') {
        error = `mkdir: cannot create directory '${rawPath}': Parent directory does not exist`;
        return;
      }
      if (parentNode.content[dirName]) {
        error = `mkdir: cannot create directory '${rawPath}': File exists`;
        return;
      }
      parentNode.content[dirName] = { type: 'directory', content: {} };
      success = true;
    }));

    return { success, error };
  },

  // Create File (touch)
  createFile: (rawPath, content = '') => {
    const { cwd } = get();
    const normalizedPath = resolvePath(rawPath, cwd);

    if (normalizedPath === null || normalizedPath === '/') {
      return { success: false, error: `touch: invalid path: ${rawPath}` };
    }
    const pathSegments = normalizedPath.split('/').filter(p => p !== '');
    const fileName = pathSegments.pop();
    const parentPath = '/' + pathSegments.join('/');

    let success = false;
    let error = null;

    set(produce((draft) => {
        const parentNode = getNode(draft.fs, parentPath);

        if (!parentNode || parentNode.type !== 'directory') {
          error = `touch: cannot touch '${rawPath}': Parent directory does not exist`;
          return;
        }
        if (parentNode.content[fileName]) {
          // Existing file: just update timestamp (simulated by doing nothing here)
          console.warn(`touch: Updating timestamp for existing file '${fileName}' (simulation)`);
          success = true; 
          return; 
        }
        parentNode.content[fileName] = { type: 'file', content: content };
        success = true;
    }));

    return { success, error };
  },

  // TODO: Add actions for delete, rename, readFile, writeFile etc.

}));

export default useFileSystemStore; 