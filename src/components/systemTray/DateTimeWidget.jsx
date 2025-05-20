import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function DateTimeWidget({ isOpen, onClose, anchorRef }) {
  const panelRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update time every second while open
  useEffect(() => {
    if (!isOpen) return;
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, [isOpen]);

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
    // Position above the anchor, aligned to the right edge
    return {
      bottom: window.innerHeight - rect.top + 8, // 8px gap
      right: window.innerWidth - rect.right, // Align to the right edge of anchor
    };
  };

  const position = getPosition();

  // Basic calendar rendering (can be replaced with a library later)
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ...
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today;
      days.push(
        <div 
          key={`day-${day}`} 
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs 
                     ${isToday ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}
        >
          {day}
        </div>
      );
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="mt-3">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-200">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            {/* Add Prev/Next month buttons later */}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {dayNames.map(name => <div key={name} className="text-xs font-medium text-gray-300">{name}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days}
        </div>
      </div>
    );
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
      className="fixed bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 z-[60] p-4 w-[300px]" // Fixed width
      style={{
        bottom: `${position.bottom}px`,
        right: `${position.right}px`, // Use right alignment
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        {/* Current Date and Time Display */}
        <div className="border-b border-gray-700/50 pb-2 mb-2">
            <p className="text-lg font-semibold text-gray-100">{currentDate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</p>
            <p className="text-sm text-gray-300">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Simple Calendar */} 
        {renderCalendar()}

        {/* Notification Placeholder (Optional) */}
        {/* <div className="mt-4 border-t border-gray-700/50 pt-2 text-center text-xs text-gray-500"> (Notifications placeholder) </div> */}
      </div>
    </motion.div>
  );
}

export default DateTimeWidget;

// Remove old keyframes comment if desired
/*
@keyframes slide-up-fade-right {
  from {
    opacity: 0;
    transform: translateY(10px); // Starts lower
  }
  to {
    opacity: 1;
    transform: translateY(0); // Ends at final position
  }
}
*/ 