import React, { useEffect, useRef } from 'react';
import useDesktopStore from '../../stores/desktopStore';
import { getIconComponent } from '../../stores/desktopStore'; // Import icon getter
import { motion } from 'framer-motion'; // Import motion

function StartMenu() {
  const isOpen = useDesktopStore((state) => state.isStartMenuOpen);
  const toggleStartMenu = useDesktopStore((state) => state.toggleStartMenu);
  const icons = useDesktopStore((state) => state.icons); // Get list of apps
  const openWindow = useDesktopStore((state) => state.openWindow);
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Close if clicked outside the menu and not on the taskbar (prevent immediate reopen)
      const taskbar = document.querySelector('.taskbar-container'); // Need a class on taskbar div
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        (!taskbar || !taskbar.contains(event.target))
      ) {
        toggleStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleStartMenu]);

  // Define animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: 20, // Start slightly lower
      transition: { duration: 0.15, ease: "easeOut" }
    },
    visible: {
      opacity: 1,
      y: 0, // Move to final position
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const handleAppClick = (iconId) => {
    openWindow(iconId);
    toggleStartMenu(false); // Close menu after opening app
  };

  // Filter icons that should appear in the Start Menu (optional)
  // For now, show all defined icons
  const appIcons = icons;

  return (
    <motion.div // Use motion.div
      ref={menuRef}
      key="start-menu-content" // Key for the motion component itself
      variants={menuVariants} // Apply variants
      initial="hidden"       // Start hidden
      animate="visible"      // Animate to visible
      exit="hidden"         // Animate back to hidden on exit
      className="absolute bottom-1 left-1 w-[280px] bg-gray-800 bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 dark:border-gray-600/50 z-[60] overflow-hidden"
    >
      <div className="flex flex-col max-h-[400px] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-400 px-3 py-2 border-b border-gray-700 dark:border-gray-600/50 flex-shrink-0">Applications</h3>
        <ul className="p-1 space-y-0.5 flex-grow">
          {appIcons.map((icon) => {
            const IconComponent = getIconComponent(icon.icon);
            return (
              <li key={icon.id}>
                <button 
                  onClick={() => handleAppClick(icon.id)}
                  className="w-full flex items-center px-3 py-1.5 text-sm text-gray-100 dark:text-gray-200 rounded hover:bg-blue-600 focus:bg-blue-700 focus:outline-none transition-colors duration-100"
                >
                  {IconComponent ? (
                    <IconComponent className="w-5 h-5 mr-3 text-gray-300 flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 mr-3 flex-shrink-0">?</span> // Placeholder
                  )}
                  <span className="truncate">{icon.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {/* Optional: Add Power/Settings buttons at the bottom */}
        {/* <div className="border-t border-gray-700 dark:border-gray-600/50 p-2 mt-auto flex-shrink-0">...</div> */}
      </div>
    </motion.div>
  );
}

export default StartMenu;

// Remove the old @keyframes comment if desired
/*
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up ease-out forwards;
}
*/ 