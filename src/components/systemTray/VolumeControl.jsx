import React, { useState, useEffect, useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { motion } from 'framer-motion'; // Import motion

function VolumeControl({ isOpen, onClose, anchorRef }) {
  // ... (existing state and logic: volume, isMuted, panelRef, handleClickOutside) ...
  const [volume, setVolume] = useState(50); 
  const [isMuted, setIsMuted] = useState(false);
  const panelRef = useRef(null);

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

  // Calculate position
  const getPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 };
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      bottom: window.innerHeight - rect.top + 8, 
      left: rect.left + rect.width / 2, 
    };
  };
  const position = getPosition();

  // ... (handleVolumeChange, toggleMute) ...
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    console.log('Volume set to:', newVolume); 
  };

  const toggleMute = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    setVolume(muted ? 0 : 50);
    console.log('Mute toggled:', muted);
  };

  // Animation Variants
  const panelVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.15, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  // Note: We no longer return null. AnimatePresence handles the conditional rendering lifecycle.
  // if (!isOpen) return null;

  return (
    <motion.div // Use motion.div
      ref={panelRef}
      // key prop is now added in Taskbar.jsx where AnimatePresence is used
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 z-[60] p-4 w-64 transform -translate-x-1/2" // Keep position logic, remove animation style
      style={{ 
        bottom: `${position.bottom}px`, 
        left: `${position.left}px`,
        // animation: 'slide-up-fade 150ms ease-out forwards' // <-- Remove this
      }}
      onClick={(e) => e.stopPropagation()} 
    >
      {/* ... (inner content: button, input, span) ... */}
      <div className="flex items-center space-x-3">
        <button onClick={toggleMute} className="text-gray-300 hover:text-white p-1 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded">
          {isMuted || volume === 0 ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-800"
          aria-label="Volume slider"
        />
        <span className="text-xs text-gray-300 w-8 text-right">{isMuted ? 'Muted' : `${volume}%`}</span>
      </div>
    </motion.div>
  );
}

export default VolumeControl;

// Remove old keyframes comment if desired
/*
@keyframes slide-up-fade {
  ...
}
*/
 