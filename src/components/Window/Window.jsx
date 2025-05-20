import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';
import useDesktopStore from '../../stores/desktopStore';
import { motion } from 'framer-motion';

// Default Min/Max dimensions for ResizableBox
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const MAX_WIDTH = Infinity; // Or calculate based on viewport
const MAX_HEIGHT = Infinity; // Or calculate based on viewport

function Window({ id, title, children, zIndex, width, height, x, y, minimized, maximized, context }) {
  // Get actions from store
  const bringToFront = useDesktopStore((state) => state.bringToFront);
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const resizeAndMoveWindow = useDesktopStore((state) => state.resizeAndMoveWindow);
  const toggleMinimize = useDesktopStore((state) => state.toggleMinimize);
  const toggleMaximize = useDesktopStore((state) => state.toggleMaximize);
  const updateWindowTitle = useDesktopStore((state) => state.updateWindowTitle);

  const nodeRef = useRef(null);

  // Determine dynamic classes and styles
  const windowClasses = `
    absolute 
    ${maximized ? 'border-none rounded-none' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-300/30 dark:border-gray-600/30'}
    overflow-hidden
  `;

  // Draggable props
  const draggableProps = {
    nodeRef: nodeRef,
    handle: '.window-header',
    bounds: 'parent',
    position: maximized ? { x: 0, y: 0 } : { x: x, y: y }, // Use stored position or (0,0) if maximized
    onStart: () => bringToFront(id),
    onStop: (e, data) => {
      if (!maximized) {
          moveWindow(id, { x: data.x, y: data.y });
      }
    },
    disabled: maximized, // Disable dragging when maximized
  };

  // Helper to stop propagation for button clicks
  const handleButtonClick = (e, action) => {
    e.stopPropagation(); // Prevent click from bubbling up to parent div
    action();
  };

  // --- NEW Resize Handler ---
  const handleResize = (event, { size, handle }) => {
    event.stopPropagation(); // Prevent potential interference

    const newWidth = Math.max(MIN_WIDTH, size.width);
    const newHeight = Math.max(MIN_HEIGHT, size.height);

    let newX = x; // Start with current position
    let newY = y;

    const deltaWidth = newWidth - width;
    const deltaHeight = newHeight - height;

    // Adjust position based on the handle used for resizing
    if (handle.includes('w')) { // Resizing from left
      newX = x - deltaWidth;
    }
    if (handle.includes('n')) { // Resizing from top
      newY = y - deltaHeight;
    }

    // Call the combined store action
    resizeAndMoveWindow(id, { width: newWidth, height: newHeight, x: newX, y: newY });
  };
  // --- END NEW Resize Handler ---

  // --- Callback for updating title --- 
  const handleTitleUpdate = (newTitle) => {
    updateWindowTitle(id, newTitle);
  };
  // --- END Callback ---

  // Animation variants for the window
  const windowVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, // Start smaller
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.25, ease: "easeOut" } 
    }
  };

  return (
    <Draggable {...draggableProps}>
      <div ref={nodeRef} className="absolute" style={{ zIndex }}>
        <motion.div
          variants={windowVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={windowClasses}
        >
          <ResizableBox
            width={width}
            height={height}
            minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
            maxConstraints={[MAX_WIDTH, MAX_HEIGHT]}
            onResize={handleResize}
            className={`flex flex-col h-full ${maximized ? 'rounded-none' : 'rounded-lg'}`}
            style={{ width: '100%', height: '100%' }}
            resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
            draggableOpts={{ disabled: maximized }}
          >
            <div 
              className="flex flex-col h-full"
              onClick={() => bringToFront(id)}
            >
              <div className={`window-header h-8 flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-between px-2 border-b border-gray-300/50 dark:border-gray-600/50 ${maximized ? 'cursor-default' : 'cursor-move'}`}>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {title || 'Untitled Window'}
                </span>
                <div className="flex space-x-1">
                  <button onClick={(e) => handleButtonClick(e, () => toggleMinimize(id))} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600" aria-label="Minimize">
                    <VscChromeMinimize className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button onClick={(e) => handleButtonClick(e, () => toggleMaximize(id))} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600" aria-label={maximized ? "Restore" : "Maximize"}>
                    {maximized ? 
                      <VscChromeRestore className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : 
                      <VscChromeMaximize className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    }
                  </button>
                  <button onClick={(e) => handleButtonClick(e, () => closeWindow(id))} className="p-1 rounded hover:bg-red-500 hover:text-white" aria-label="Close">
                    <VscChromeClose className="w-4 h-4 text-gray-700 dark:text-gray-300 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {React.isValidElement(children) 
                  ? React.cloneElement(children, { context: { ...context, id: id, updateTitle: handleTitleUpdate } })
                  : children}
              </div>
            </div>
          </ResizableBox>
        </motion.div>
      </div>
    </Draggable>
  );
}

export default Window; 