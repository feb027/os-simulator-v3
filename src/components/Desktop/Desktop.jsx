import React from 'react';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Taskbar from '../taskbar/Taskbar';
import DraggableDesktopIcon from '../desktopIcon/DraggableDesktopIcon';
import Window from '../window/Window'; // Import Window component
import useDesktopStore from '../../stores/desktopStore'; // Import the store
import StartMenu from '../startMenu/StartMenu'; // Import StartMenu
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import ConfirmModal from '../modal/ConfirmModal'; // <-- Import ConfirmModal
import SaveAsDialog from '../modal/SaveAsDialog'; // <-- Import SaveAsDialog

// Import app components
import FileExplorer from '../apps/FileExplorer';
import Terminal from '../apps/Terminal'; // Import Terminal
import Settings from '../apps/Settings'; // Import Settings component
import TextEditor from '../apps/TextEditor'; // Import TextEditor
import ImageViewer from '../apps/ImageViewer'; // Import ImageViewer
// Import other apps here as needed (e.g., import Terminal from '../apps/Terminal')

// Helper function to get the correct app component based on ID
const getAppComponent = (iconId, context) => {
  switch (iconId) {
    case 'file-explorer':
      return <FileExplorer context={context}/>;
    case 'terminal': // Add case for terminal
      return <Terminal context={context}/>;
    case 'settings':
      return <Settings context={context}/>; // Add case for settings
    case 'text-editor': // Add case for text editor
      return <TextEditor context={context}/>; // Pass context
    case 'image-viewer': return <ImageViewer context={context}/>; // Add case for image viewer
    default:
      return null; // Or a default placeholder component
  }
};

function Desktop() {
  // Get state from the store
  const icons = useDesktopStore((state) => state.icons);
  const windows = useDesktopStore((state) => state.windows);
  const desktopBackground = useDesktopStore((state) => state.desktopBackground);
  // Get actions
  const openWindow = useDesktopStore((state) => state.openWindow);
  const moveIcon = useDesktopStore((state) => state.moveIcon);
  const isStartMenuOpen = useDesktopStore((state) => state.isStartMenuOpen); // Get state
  // Confirmation Modal state and actions
  const confirmationModal = useDesktopStore((state) => state.confirmationModal);
  const hideConfirmation = useDesktopStore((state) => state.hideConfirmation);
  const isNightLightEnabled = useDesktopStore((state) => state.isNightLightEnabled); // <-- Get Night Light state

  const handleIconDoubleClick = (iconId) => {
    openWindow(iconId); // Call the store action to open a window
  };

  // Handler for when icon dragging stops
  const handleIconDragStop = (iconId, position) => {
    // Call the store action to update the icon's position
    moveIcon(iconId, position);
  };

  // Determine background class/style
  let backgroundStyle = {};
  let backgroundClasses = 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700'; // Default

  if (desktopBackground) {
    if (desktopBackground.type === 'gradient-1') {
      backgroundClasses = 'bg-gradient-to-br from-blue-500 to-purple-600'; // Match settings button
    } else if (desktopBackground.type === 'gradient-2') {
      backgroundClasses = 'bg-gradient-to-br from-green-400 to-blue-500'; // Match settings button
    } else if (desktopBackground.type === 'solid-gray') {
      backgroundClasses = 'bg-gray-500'; // Match settings button
    } else if (desktopBackground.type === 'custom-image' && desktopBackground.customUrl) {
      backgroundClasses = ''; // Remove default gradient/solid
      backgroundStyle = {
        backgroundImage: `url(${desktopBackground.customUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  }

  return (
    <div 
       className={`desktop-container relative h-screen w-screen overflow-hidden ${backgroundClasses} ${isNightLightEnabled ? 'night-light-active' : ''}`}
       style={backgroundStyle}
    >
      {/* Night Light Overlay - REMOVED */}
      {/* <NightLightOverlay /> */}
      
      {/* Toaster Component for Notifications */}
      <Toaster 
        position="bottom-right" // Position toasts at bottom-right
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000, // Show for 4 seconds
          style: {
            background: '#363636', // Dark background
            color: '#fff', // White text
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
           error: {
            duration: 5000, // Show errors longer
             theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />
      
      {/* Main desktop area excluding taskbar */}
      <div className="absolute inset-0 w-full h-[calc(100%-3rem)] overflow-hidden">
        {icons.map((icon) => (
          <DraggableDesktopIcon
            key={icon.id}
            icon={icon} // Pass the whole icon object
            onDoubleClick={() => handleIconDoubleClick(icon.id)}
            onDragStop={handleIconDragStop} // Pass the drag stop handler
          />
        ))}

        {/* Render Open Windows - Wrap with AnimatePresence */}
        <AnimatePresence>
          {windows.map((win) => (
            // Render Window only if NOT minimized
            !win.minimized && (
              <Window
                key={win.id} // Key is crucial for AnimatePresence
                id={win.id}
                title={win.title}
                zIndex={win.zIndex}
                width={win.width}
                height={win.height}
                x={win.x}
                y={win.y}
                minimized={win.minimized}
                maximized={win.maximized}
                context={win.context} // Pass context to Window
              >
                {getAppComponent(win.iconId, win.context) || <p>Content for {win.title} (Not Implemented)</p>}
              </Window>
            )
          ))}
        </AnimatePresence>

        {/* Render Start Menu if open, wrapped in AnimatePresence */}
        <AnimatePresence>
          {isStartMenuOpen && <StartMenu key="start-menu" />} {/* Add key prop */}
        </AnimatePresence>

      </div>

      {/* Add class name to Taskbar container for click outside detection */}
      <div className="taskbar-container"> 
        <Taskbar />
      </div>

      {/* Confirmation Modal Render */}
      <ConfirmModal
        isOpen={confirmationModal.isOpen}
        onClose={hideConfirmation} // Use hide action
        onConfirm={confirmationModal.onConfirm || (() => {})} // Pass the confirm callback from state
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Close Anyway" // Customize button text if needed
        cancelText="Cancel"
      />

      {/* Save As Dialog Render */}
      <SaveAsDialog /> {/* Render the new dialog; its visibility is handled internally via store state */}

    </div>
  );
}

export default Desktop; 