import React from 'react';

// Accept IconComponent as a prop
function DesktopIcon({ IconComponent, label, onDoubleClick }) {

  // Default placeholder if no IconComponent is provided (now handled by getIconComponent)
  // const DefaultIcon = () => (
  //   <div className="w-12 h-12 bg-gray-300 mb-1 flex items-center justify-center rounded text-gray-700">
  //     ? {/* Indicate missing icon */}
  //   </div>
  // );
  // const ActualIcon = IconComponent || DefaultIcon;

  // Ensure IconComponent is a valid component before rendering
  const ValidIcon = IconComponent || (() => <div className="w-10 h-10 mb-1 text-white flex items-center justify-center">?</div>); 

  return (
    // Apply onDoubleClick directly to the button
    <button
      className="flex flex-col items-center justify-center p-2 m-1 w-24 h-24 text-center rounded 
                 hover:bg-blue-500 hover:bg-opacity-40 /* Adjust hover background */ 
                 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-blue-500 focus:bg-opacity-50 
                 transition-colors duration-150 text-white" // Ensure text is white
      onDoubleClick={onDoubleClick} // Handler is on the button itself
      aria-label={label}
    >
      {/* Render the icon component */}
      <div className="w-10 h-10 mb-1 flex items-center justify-center pointer-events-none"> {/* Ensure icon area doesn't block clicks */} 
          <ValidIcon className="text-white text-3xl" /> {/* Adjust size as needed */} 
      </div>
      {/* Label text */}
      <span className="text-xs mt-1 break-words w-full pointer-events-none"> {/* Ensure label doesn't block clicks */} 
        {label}
      </span>
    </button>
  );
}

export default DesktopIcon; 