import React, { useState, useEffect, useRef } from 'react';
import { FiWifi, FiWifiOff, FiSettings } from 'react-icons/fi'; // Wifi icons
import { motion } from 'framer-motion'; // Import motion

function WifiPanel({ isOpen, onClose, anchorRef }) {
  const panelRef = useRef(null);
  // Placeholder state
  const [isConnected, setIsConnected] = useState(true);
  const [networkName, setNetworkName] = useState('MyNetwork_5G');
  const [signalStrength, setSignalStrength] = useState(4); // 0-4 bars

  // Close panel if clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
       if (panelRef.current && !panelRef.current.contains(event.target) && 
          anchorRef.current && !anchorRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  // Calculate position (similar to VolumeControl)
  const getPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 };
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      bottom: window.innerHeight - rect.top + 8, // 8px gap
      left: rect.left + rect.width / 2,
    };
  };

  const position = getPosition();

  // Placeholder action
  const handleNetworkSettings = () => {
    alert('Opening Network Settings... (Placeholder)');
    onClose(); // Close panel after action
  };

  // Simple signal strength indicator (can be improved)
  const SignalIcon = () => {
    // Basic representation, could use different icons per strength level
    return isConnected ? <FiWifi className="w-5 h-5 text-blue-400" /> : <FiWifiOff className="w-5 h-5 text-gray-500" />;
  };

  // Animation Variants
  const panelVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.15, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <motion.div
      ref={panelRef}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 z-[60] p-4 w-72 transform -translate-x-1/2" // Center horizontally
      style={{
        bottom: `${position.bottom}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b border-gray-700/50 pb-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-200">Wi-Fi</h3>
          {/* Placeholder: Toggle switch could go here */} 
        </div>

        <div className="flex items-center space-x-3 p-2 rounded hover:bg-white/10 cursor-default">
          <SignalIcon />
          <div className="flex-grow">
            <p className="text-sm text-gray-100">{isConnected ? networkName : 'Not Connected'}</p>
            <p className="text-xs text-gray-400">{isConnected ? 'Connected, secured' : 'Available networks nearby'}</p>
          </div>
           {/* Placeholder: Disconnect button could go here if connected */} 
        </div>

        {/* Placeholder for list of other networks */}
        <div className="text-center text-xs text-gray-500 py-2">
          (Network list placeholder)
        </div>

        <div className="border-t border-gray-700/50 pt-2 mt-1">
          <button 
            onClick={handleNetworkSettings}
            className="w-full flex items-center justify-center px-3 py-1.5 text-sm text-gray-200 rounded hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors duration-100"
          >
            <FiSettings className="w-4 h-4 mr-2"/>
            Network & Internet settings
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default WifiPanel; 