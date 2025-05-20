import React, { useState, useEffect } from 'react';
import { FaFolder, FaChevronRight, FaChevronDown, FaSpinner } from 'react-icons/fa';
import useDesktopStore from '../../stores/desktopStore';

// Helper function to join paths correctly
const joinPaths = (...paths) => {
  return '/' + paths.filter(Boolean).join('/').replace(/\/+/g, '/');
};

function TreeNode({ 
  nodePath, name, level, 
  currentPath, // Path of the main explorer view (source of drag)
  onNavigate, 
  expandedNodes, toggleNode, 
  treeData, loadingPaths, 
  draggedItemNames, // Set of names being dragged from FileExplorer
  onDropItem, // Function from FileExplorer to handle the drop
  dragOverNodePath, // The path currently being hovered over in the sidebar
  setDragOverNodePath // Function to set the dragOverNodePath state in sidebar
}) {
  const isExpanded = expandedNodes[nodePath];
  const isActive = nodePath === currentPath;
  const nodeInfo = treeData[nodePath];
  const isLoading = loadingPaths.has(nodePath);
  const isBeingDraggedOver = dragOverNodePath === nodePath;

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the toggle icon
    toggleNode(nodePath);
  };

  const handleNavigate = (e) => {
     e.stopPropagation();
     onNavigate(nodePath);
  };

  // --- Drag and Drop Handlers for Sidebar Nodes ---
  const handleDragOver = (e) => {
    // Check if something is being dragged from the main view
    if (!draggedItemNames || draggedItemNames.size === 0) {
      return; 
    }

    // Prevent dropping into the originating folder or into one of the selected items
    if (nodePath === currentPath || draggedItemNames.has(name)) { // Simplified check using name assuming unique within currentPath
      // More robust check: compare full source paths with dest path
      const sourcePaths = Array.from(draggedItemNames).map(n => joinPaths(currentPath, n));
      if (nodePath === currentPath || sourcePaths.includes(nodePath)) {
         setDragOverNodePath(null); // Ensure highlight is removed
         e.dataTransfer.dropEffect = 'none';
         return; 
      }
    }

    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    setDragOverNodePath(nodePath); // Highlight this node
  };

  const handleDragLeave = () => {
    // Only clear if leaving the specific element that set the state
    if (dragOverNodePath === nodePath) {
        setDragOverNodePath(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItemNames || dragOverNodePath !== nodePath) {
        setDragOverNodePath(null);
        return; // Invalid drop
    }

    const sourceNamesJSON = e.dataTransfer.getData('application/json');
    let sourceNames = [];
    try {
        sourceNames = JSON.parse(sourceNamesJSON);
        if (!Array.isArray(sourceNames)) throw new Error("Invalid data");
    } catch (error) {
        console.error("Failed to parse dragged item data in sidebar:", error);
        setDragOverNodePath(null);
        return;
    }

    // Call the handler passed from FileExplorer
    onDropItem(sourceNames, nodePath); 
    setDragOverNodePath(null); // Clear highlight
  };
  // --- End Drag and Drop Handlers ---

  // Determine if this node has subdirectories to allow expansion
  // We might know this upfront or need to fetch first
  // For now, assume any directory *might* have subdirectories
  const canExpand = true; // Simplification for now

  return (
    <div>
      <div 
        className={`flex items-center p-1 pl-${2 + level * 2} rounded cursor-pointer transition-colors duration-100 
                   ${isActive 
                     ? 'bg-blue-200 dark:bg-blue-800 font-semibold' /* Adjusted active style */ 
                     : 'hover:bg-gray-200 dark:hover:bg-gray-700'} 
                   ${isBeingDraggedOver ? 'bg-green-200 dark:bg-green-800 outline outline-1 outline-green-500' : ''}`}
        onClick={handleNavigate}
        title={nodePath}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {canExpand && (
          <span onClick={handleToggle} className="mr-1 flex-shrink-0">
            {isLoading ? (
               <FaSpinner className="animate-spin" />
            ) : isExpanded ? (
              <FaChevronDown className="w-3 h-3" />
            ) : (
              <FaChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        <FaFolder className={`w-4 h-4 mr-2 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-500'}`} /> {/* Adjusted active icon color */}
        <span className="truncate text-sm">{name}</span>
      </div>
      {isExpanded && !isLoading && nodeInfo?.items && (
        <div className="border-l border-gray-300 dark:border-gray-600 ml-3"> 
          {Object.entries(nodeInfo.items)
                 .sort(([nameA], [nameB]) => nameA.localeCompare(nameB)) // Sort alphabetically
                 .map(([subName]) => (
                    <TreeNode
                      key={subName}
                      nodePath={joinPaths(nodePath, subName)}
                      name={subName}
                      level={level + 1}
                      currentPath={currentPath}
                      onNavigate={onNavigate}
                      expandedNodes={expandedNodes}
                      toggleNode={toggleNode}
                      treeData={treeData}
                      loadingPaths={loadingPaths}
                      draggedItemNames={draggedItemNames}
                      onDropItem={onDropItem}
                      dragOverNodePath={dragOverNodePath}
                      setDragOverNodePath={setDragOverNodePath}
                    />
                 ))
           }
           {Object.keys(nodeInfo.items).length === 0 && (
                <div className={`pl-${4 + level * 2} text-xs text-gray-500 italic`}>empty</div>
           )}
        </div>
      )}
    </div>
  );
}


function FileTreeSidebar({ currentPath, onNavigate, draggedItemNames, onDropItem }) {
  const listDirectory = useDesktopStore((state) => state.listDirectory);
  const fs = useDesktopStore((state) => state.fs); // To trigger refresh on global FS changes

  const [expandedNodes, setExpandedNodes] = useState({ '/': true }); // Expand root by default
  const [treeData, setTreeData] = useState({}); // Stores { path: { items: {...} } } only for directories
  const [loadingPaths, setLoadingPaths] = useState(new Set());
  const [dragOverNodePath, setDragOverNodePath] = useState(null); // State for drop highlight

  const fetchNodeData = async (nodePath, forceRefetch = false) => {
    // Allow refetch OR fetch if not loaded/loading
    if (!forceRefetch && (loadingPaths.has(nodePath) || treeData[nodePath])) {
      // If not forcing refetch, and node is loaded/loading, do nothing.
      // Note: If forcing refetch, we proceed even if already loaded.
      return;
    } 

    setLoadingPaths(prev => new Set(prev).add(nodePath));
    try {
      const result = listDirectory(nodePath);
      if (result.success) {
        // Filter only directories for the tree view
        const directoriesOnly = Object.entries(result.data)
          .filter(([, details]) => details.type === 'directory')
          .reduce((acc, [name, details]) => {
            acc[name] = details;
            return acc;
          }, {});
        
        setTreeData(prev => ({ ...prev, [nodePath]: { items: directoriesOnly } }));
      } else {
        console.error(`Failed to list directory ${nodePath}:`, result.error);
        // Keep node expandable but show no children on error? Or mark as failed?
         setTreeData(prev => ({ ...prev, [nodePath]: { items: {}, error: true } })); // Store empty items on error
      }
    } catch (error) {
      console.error(`Error fetching node data for ${nodePath}:`, error);
       setTreeData(prev => ({ ...prev, [nodePath]: { items: {}, error: true } })); // Store empty items on error
    } finally {
      setLoadingPaths(prev => {
        const next = new Set(prev);
        next.delete(nodePath);
        return next;
      });
    }
  };

  const toggleNode = (nodePath) => {
    setExpandedNodes(prev => {
      const next = {...prev};
      const isCurrentlyExpanded = !!next[nodePath];
      if(isCurrentlyExpanded) {
        delete next[nodePath]; // Collapse
      } else {
        next[nodePath] = true; // Expand
         // Fetch data if expanding and not already loaded/loading
        if (!treeData[nodePath] && !loadingPaths.has(nodePath)) {
           fetchNodeData(nodePath);
        }
      }
      return next;
    });
  };
  
  // Fetch root data on mount and when FS changes
  useEffect(() => {
    // When the global filesystem changes, re-fetch data for all currently expanded nodes
    // to ensure consistency without collapsing the tree.
    const currentExpanded = expandedNodes; // Capture the current state
    const nodesToRefresh = Object.keys(currentExpanded);

    // console.log("[FS Effect] Refreshing nodes:", nodesToRefresh); // Optional debug log

    nodesToRefresh.forEach(nodePath => {
      fetchNodeData(nodePath, true); // Pass forceRefetch = true
    });

    // Ensure root is always considered for refresh if not already in expandedNodes list
    // (though it usually should be if the app just loaded)
    if (!currentExpanded['/']) {
      fetchNodeData('/', true);
    }

  }, [fs, expandedNodes]); // Depend on fs state AND expandedNodes (read comment below)
  // NOTE on dependencies: We added expandedNodes here. Why?
  // While the *intent* is to react only to `fs` changes, reading `expandedNodes` inside
  // the effect technically makes it a dependency. If `expandedNodes` changed concurrently
  // with `fs` (unlikely but possible), omitting it could lead to stale data being used.
  // It's generally safer to include all reactive values read inside the effect.
  // The fetchNodeData guard (`!forceRefetch && ...`) prevents unnecessary fetches
  // if only expandedNodes changes without an fs change triggering forceRefetch.

  // Ensure the current path and its ancestors are expanded and loaded
  useEffect(() => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    let pathToCheck = '/';
    const necessaryExpansions = {'/': true};

    const checkAndLoad = async (pathToLoad) => {
       if (!treeData[pathToLoad] && !loadingPaths.has(pathToLoad)) {
          await fetchNodeData(pathToLoad); // Wait for fetch to complete before checking next segment
       }
    };
    
    const expandAncestors = async () => {
      await checkAndLoad('/'); // Ensure root is loaded
      for (const segment of pathSegments) {
          pathToCheck = joinPaths(pathToCheck, segment);
          necessaryExpansions[pathToCheck] = true;
          await checkAndLoad(pathToCheck); // Load ancestor if needed
      }
       setExpandedNodes(prev => ({ ...prev, ...necessaryExpansions }));
    };

    expandAncestors();

  }, [currentPath]); // Run when currentPath changes


  return (
    <div className="file-tree-sidebar w-48 flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-2 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <TreeNode 
        nodePath="/"
        name="Root" 
        level={0}
        currentPath={currentPath}
        onNavigate={onNavigate}
        expandedNodes={expandedNodes}
        toggleNode={toggleNode}
        treeData={treeData}
        loadingPaths={loadingPaths}
        draggedItemNames={draggedItemNames}
        onDropItem={onDropItem}
        dragOverNodePath={dragOverNodePath}
        setDragOverNodePath={setDragOverNodePath}
      />
    </div>
  );
}

export default FileTreeSidebar; 