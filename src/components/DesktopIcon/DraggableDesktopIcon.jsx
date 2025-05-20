import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import DesktopIcon from './DesktopIcon';
import { getIconComponent } from '../../stores/desktopStore'; // Import the getter

function DraggableDesktopIcon({ icon, onDoubleClick, onDragStop }) {
  const nodeRef = useRef(null); // Ref for Draggable

  // Get the actual IconComponent using the identifier from the icon object
  const IconComponent = getIconComponent(icon.icon); // Use the getter

  return (
    // Draggable component wraps the icon container
    <Draggable
      nodeRef={nodeRef} // Pass the ref for StrictMode compatibility
      bounds="parent" // Keep the icon within the bounds of its parent container
      defaultPosition={{ x: icon.position.x, y: icon.position.y }} // Initial position from store
      onStop={(e, data) => {
        // When dragging stops, call the provided handler with id and new position
        onDragStop(icon.id, { x: data.x, y: data.y });
      }}
      cancel=".no-drag" // Optional: Define elements that shouldn't trigger drag (like text label?)
    >
      {/* This div is the draggable element and is positioned by Draggable */}
      <div
        ref={nodeRef}
        className="absolute cursor-grab active:cursor-grabbing" // Set position to absolute for Draggable, add grab cursors
        // No inline style needed here, Draggable handles transform
      >
        {/* Render the actual DesktopIcon component */}
        <DesktopIcon
          IconComponent={IconComponent} // Pass the resolved component
          label={icon.label}
          onDoubleClick={onDoubleClick} // Pass down the double click handler
        />
      </div>
    </Draggable>
  );
}

export default DraggableDesktopIcon; 