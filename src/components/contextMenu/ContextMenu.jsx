import React, { useEffect, useRef } from 'react';

function ContextMenu({ 
  x, y, items, onClose, 
  // Optional props for positioning/styling variations
  positionClass = "absolute", // Default to absolute, can be "fixed"
  verticalOrigin = "top" // Default 'top', can be 'bottom' to try opening upwards
}) {
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    // Add listener when menu is mounted
    document.addEventListener('mousedown', handleClickOutside);
    // Add listener for escape key
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Remove listener when menu is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]); // Rerun if onClose changes

  // Calculate final position style
  const style = {};
  if (verticalOrigin === 'bottom') {
    // Try to position above the click point
    // This needs refinement based on menu height, which isn't known initially
    // For now, just use the y directly, assuming parent logic offsets it.
    style.bottom = `${window.innerHeight - y}px`; 
    style.left = `${x}px`;
  } else {
    // Default: position below the click point
    style.top = `${y}px`;
    style.left = `${x}px`;
  }

  return (
    <div
      ref={menuRef}
      className={`${positionClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg py-1 z-[100] min-w-[150px]`}
      style={style}
      // Prevent context menu on the context menu itself
      onContextMenu={(e) => e.preventDefault()}
    >
      <ul className="list-none p-0 m-0">
        {items.map((item, index) => (
          <li key={index}>
            {item.separator ? (
              <hr className="border-t border-gray-200 dark:border-gray-700 my-1" />
            ) : (
              <button
                onClick={() => {
                  item.onClick?.(); // Call onClick if it exists
                  // onClose(); // Close menu after action (handled by caller maybe?)
                }}
                disabled={item.disabled}
                className="w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu; 