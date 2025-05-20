import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../stores/desktopStore'; // Import the store
import { getIconComponent } from '../../stores/desktopStore'; // Import the getter
import { FiWifi, FiVolume2 } from 'react-icons/fi'; // Icons for system tray
import ContextMenu from '../contextMenu/ContextMenu'; // Import ContextMenu
import VolumeControl from '../systemTray/VolumeControl'; // Import VolumeControl
import WifiPanel from '../systemTray/WifiPanel'; // Import WifiPanel
import DateTimeWidget from '../systemTray/DateTimeWidget'; // Import DateTimeWidget
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

function Taskbar() {
  // Get necessary state and actions from the store
  const icons = useDesktopStore((state) => state.icons); // Need all icons for pinning info
  const windows = useDesktopStore((state) => state.windows);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const pinnedAppIds = useDesktopStore((state) => state.pinnedAppIds);
  const bringToFront = useDesktopStore((state) => state.bringToFront);
  const toggleMinimize = useDesktopStore((state) => state.toggleMinimize);
  const toggleStartMenu = useDesktopStore((state) => state.toggleStartMenu); // Get toggle action
  const pinApp = useDesktopStore((state) => state.pinApp);
  const unpinApp = useDesktopStore((state) => state.unpinApp);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const closeWindow = useDesktopStore((state) => state.closeWindow); // Need close action
  const isTaskbarLocked = useDesktopStore((state) => state.isTaskbarLocked); // <-- Get lock state
  const toggleTaskbarLock = useDesktopStore((state) => state.toggleTaskbarLock); // <-- Get lock action

  // --- Panel State ---
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState(false);
  const [isWifiPanelOpen, setIsWifiPanelOpen] = useState(false);
  const [isDateTimeWidgetOpen, setIsDateTimeWidgetOpen] = useState(false); // State for DateTimeWidget
  const volumeIconRef = useRef(null); // Ref for volume icon button
  const wifiIconRef = useRef(null);   // Ref for wifi icon button
  const dateTimeRef = useRef(null); // Ref for DateTime area

  // --- Clock State and Effect ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timerId);
  }, []); // Empty dependency array means run only on mount and unmount

  // Format time as HH:MM (24-hour format)
  const formattedTime = currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false // Use 24-hour format
      // second: '2-digit' // Optional: include seconds
  });
  // --- End Clock Logic ---

  // --- Date Logic ---
  const formattedDate = currentTime.toLocaleDateString(undefined, { // Use locale default
      weekday: 'short', // e.g., Mon
      year: 'numeric',  // e.g., 2023
      month: 'short', // e.g., Nov
      day: 'numeric',   // e.g., 10
  });
  // --- End Date Logic ---

  // --- Context Menu State ---
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, items: [], targetId: null });

  const handleTaskbarButtonClick = (windowId, iconId) => {
    closeContextMenu(); // Close context menu on regular click
    
    if (windowId !== null) { // If window exists (running app)
        if (windowId === activeWindowId && !windows.find(w => w.id === windowId).minimized) {
          toggleMinimize(windowId);
        } else {
          bringToFront(windowId);
        }
    } else { // If window doesn't exist (pinned app not running)
        openWindow(iconId);
    }
  };

  // --- Context Menu Handlers ---
  const handleTaskbarButtonContextMenu = (e, iconId, windowId = null) => {
    e.preventDefault();
    e.stopPropagation();
    closeContextMenu(); 

    const isPinned = pinnedAppIds.includes(iconId);
    const isRunning = windowId !== null;
    const targetIcon = icons.find(icon => icon.id === iconId);
    const taskbarIsLocked = isTaskbarLocked; // Get lock state for clarity

    const menuItems = [];

    // App Label
    if (targetIcon) {
        menuItems.push({ label: targetIcon.label, disabled: true }); 
        menuItems.push({ separator: true });
    }

    // Pin/Unpin option - Disable if taskbar is locked
    menuItems.push({
        label: isPinned ? 'Unpin from taskbar' : 'Pin to taskbar',
        onClick: () => {
            if (taskbarIsLocked) return; // Do nothing if locked
            if (isPinned) unpinApp(iconId);
            else pinApp(iconId);
            closeContextMenu();
        },
        disabled: taskbarIsLocked // <-- Disable based on lock state
    });

    // Close option (only if running)
    if (isRunning) {
        menuItems.push({
            label: 'Close window',
            onClick: () => {
                closeWindow(windowId);
                closeContextMenu();
            }
            // No need to disable closing windows when taskbar is locked generally
        });
    }

    // Calculate position relative to viewport
    const xPos = e.clientX;
    const yPos = e.clientY; // Will render upwards from click point

    setContextMenu({
        visible: true,
        x: xPos,
        y: yPos - 10, // Offset slightly above click point
        items: menuItems,
        targetId: iconId // Track target for potential future use
    });
  };

  // --- NEW: Handler for Taskbar Background Context Menu ---
  const handleTaskbarContextMenu = (e) => {
    console.log('Taskbar context menu handler triggered. Target:', e.target, 'CurrentTarget:', e.currentTarget);

    // NEW CHECK: Traverse up from the target to see if the click originated inside a button
    let targetElement = e.target;
    while (targetElement && targetElement !== e.currentTarget) {
      // If we find a button before reaching the taskbar container, bail out.
      if (targetElement.tagName === 'BUTTON') { 
          console.log('Click originated within a button, returning.');
          return;
      }
      targetElement = targetElement.parentElement;
    }
    // END NEW CHECK
    
    console.log('Click seems to be on background. Preventing default...');
    e.preventDefault();
    e.stopPropagation();
    closeContextMenu(); // Close any existing menu

    const menuItems = [
      { 
        label: 'Taskbar settings', 
        onClick: () => { openWindow('settings'); closeContextMenu(); }, // <-- Open settings window
        // Keep disabled if needed, but let's enable it since 'settings' icon exists
        // disabled: false 
      },
      { separator: true },
      { 
        label: isTaskbarLocked ? 'Unlock the taskbar' : 'Lock the taskbar', // <-- Dynamic label
        onClick: () => { toggleTaskbarLock(); closeContextMenu(); }, // <-- Toggle lock state
        // disabled: false // <-- Enable this option
      },
    ];

    const xPos = e.clientX;
    const yPos = e.clientY;

    setContextMenu({
      visible: true,
      x: xPos,
      y: yPos - 10, // Offset slightly above click point
      items: menuItems,
      targetId: 'taskbar-background' // Identify the target
    });
  };
  // --- END NEW HANDLER ---

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // --- System Tray Click Handlers ---
  const handleWifiClick = () => {
    setIsWifiPanelOpen(prev => !prev); // Toggle Wifi panel
    setIsVolumePanelOpen(false); // Close other panel
    setIsDateTimeWidgetOpen(false); // Close DateTimeWidget
  };

  const handleVolumeClick = () => {
    setIsVolumePanelOpen(prev => !prev); // Toggle Volume panel
    setIsWifiPanelOpen(false); // Close other panel
    setIsDateTimeWidgetOpen(false); // Close DateTimeWidget
  };

  const handleDateTimeClick = () => { // Handler for DateTime area
    setIsDateTimeWidgetOpen(prev => !prev);
    setIsWifiPanelOpen(false); 
    setIsVolumePanelOpen(false);
  };
  // --- End System Tray Click Handlers ---

  // --- Generate Taskbar Buttons ---
  // Combine pinned apps and running windows, removing duplicates
  const taskbarItems = {};
  // Add pinned apps first
  pinnedAppIds.forEach(id => {
      const iconData = icons.find(icon => icon.id === id);
      if (iconData) {
          taskbarItems[id] = { iconId: id, iconData: iconData, windowId: null }; // Mark as not running initially
      }
  });
  // Add/update running windows
  windows.forEach(win => {
      const iconData = icons.find(icon => icon.id === win.iconId);
      if (iconData) {
          taskbarItems[win.iconId] = { iconId: win.iconId, iconData: iconData, windowId: win.id, win: win }; // Add window info
      }
  });

  // Sort based on original pinned order? Or keep running apps after pinned?
  // For simplicity, convert to array and render
  const sortedTaskbarItems = Object.values(taskbarItems);

  return (
    <div 
      className="taskbar-container absolute bottom-0 left-0 w-full h-12 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white flex items-center px-4 z-50 shadow-lg"
      onContextMenu={handleTaskbarContextMenu} // Add context menu handler to the main div
    >
      {/* Start Button */}
      <button 
        onClick={() => toggleStartMenu()} // Toggle start menu on click
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-4 text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150"
        aria-label="Start Menu"
       >
        Start
      </button>

      {/* Running/Pinned Apps Area */}
      <div className="flex-grow flex items-center space-x-2 overflow-x-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {sortedTaskbarItems.map((item) => {
            const IconComponent = getIconComponent(item.iconData.icon);
            const windowId = item.windowId;
            const win = item.win;
            const isActive = win ? (win.id === activeWindowId && !win.minimized) : false;
            const isMinimized = win ? win.minimized : false;
            const isRunning = windowId !== null;
            
            return (
              <motion.button
                key={item.iconId}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onClick={() => handleTaskbarButtonClick(windowId, item.iconId)} 
                onContextMenu={(e) => handleTaskbarButtonContextMenu(e, item.iconId, windowId)}
                className={`relative flex items-center p-2 h-10 rounded hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-900 flex-shrink-0
                            ${isActive ? 'bg-white/20' : 'bg-transparent'} 
                            ${isMinimized ? 'opacity-60' : 'opacity-100'}
                            ${!isRunning ? 'opacity-70 hover:opacity-90' : 'opacity-100'}`}
                title={item.iconData.label}
              >
                {IconComponent && <IconComponent className="w-5 h-5 mr-2" />} 
                <span className="text-xs truncate max-w-[100px]">{item.iconData.label}</span> 
                {/* Indicator for running apps */} 
                {isRunning && (
                   <motion.span
                      layoutId={`indicator-${item.iconId}`}
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded-full ${isActive ? 'bg-blue-400' : 'bg-gray-500'}`}
                   ></motion.span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* System Tray Area */}
      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
        {/* Wi-Fi Icon Button */}
        <button 
          ref={wifiIconRef} // Attach ref
          onClick={handleWifiClick} 
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 transition-colors duration-150"
          title="Network Status"
        >
           <FiWifi className="w-4 h-4" />
        </button>
        {/* Volume Icon Button */}
        <button 
          ref={volumeIconRef} // Attach ref
          onClick={handleVolumeClick} 
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 transition-colors duration-150"
          title="Volume Control"
        >
            <FiVolume2 className="w-4 h-4" />
        </button>

        {/* Clock and Date Area - Make it a button */}
        <button 
          ref={dateTimeRef} // Attach ref
          onClick={handleDateTimeClick} // Add onClick
          className="text-right focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 cursor-pointer hover:bg-white/10 transition-colors duration-150"
          aria-label="Open calendar and notifications"
        >
          <span className="block text-xs font-mono" title={currentTime.toLocaleString()}>{formattedTime}</span>
          <span className="block text-xs font-mono text-gray-300" title={currentTime.toLocaleDateString(undefined, { dateStyle: 'full' })}>{formattedDate}</span>
        </button>
      </div>

      {/* Context Menu Render */} 
      {contextMenu.visible && (
          <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              items={contextMenu.items}
              onClose={closeContextMenu}
              isSubMenu={false} 
              positionClass="fixed" 
              verticalOrigin="bottom" 
          />
      )}
      
      {/* System Tray Panel Renders - Wrap each in AnimatePresence */}
      <AnimatePresence>
        {isVolumePanelOpen && (
          <VolumeControl 
            key="volume-panel" // Add key for AnimatePresence
            isOpen={isVolumePanelOpen} // Prop name is kept for clarity, but conditional rendering controls presence
            onClose={() => setIsVolumePanelOpen(false)}
            anchorRef={volumeIconRef}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isWifiPanelOpen && (
          <WifiPanel 
            key="wifi-panel" // Add key for AnimatePresence
            isOpen={isWifiPanelOpen}
            onClose={() => setIsWifiPanelOpen(false)}
            anchorRef={wifiIconRef}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDateTimeWidgetOpen && (
          <DateTimeWidget 
            key="datetime-widget" // Add key for AnimatePresence
            isOpen={isDateTimeWidgetOpen}
            onClose={() => setIsDateTimeWidgetOpen(false)}
            anchorRef={dateTimeRef}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Helper class for hiding scrollbar (requires Tailwind config setup or global CSS)
// If scrollbar-hide doesn't work, you might need to add this to your global CSS:
/*
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;  
    scrollbar-width: none;  
}
*/

export default Taskbar; 