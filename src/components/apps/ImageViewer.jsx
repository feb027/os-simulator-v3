import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../stores/desktopStore'; // Import store
import { FiZoomIn, FiZoomOut, FiRefreshCw, FiMaximize, FiRotateCcw, FiRotateCw, FiAlertTriangle, FiLoader } from 'react-icons/fi'; // Icons for controls and rotation
import { motion, AnimatePresence } from 'framer-motion'; // Re-import motion

// Style for checkerboard background
const checkerboardStyle = {
  backgroundImage: [
    'linear-gradient(45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, #ccc 75%)',
    'linear-gradient(-45deg, transparent 75%, #ccc 75%)'
  ].join(','), // Join into a single string
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
};

function ImageViewer({ context }) {
  const filePath = context?.filePath;
  const windowId = context?.id; // Get window ID from context
  const readFile = useDesktopStore((state) => state.readFile); // Get readFile action
  const activeWindowId = useDesktopStore((state) => state.activeWindowId); // Get active window ID

  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1); // Zoom level
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Pan offset
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // State for rotation angle
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 }); // State for dimensions
  const imageRef = useRef(null); // Ref for the image element
  const containerRef = useRef(null); // Ref for the container
  const [showControls, setShowControls] = useState(true); // State for control visibility
  const controlsTimeoutRef = useRef(null); // Ref for hide controls timeout
  
  const fileName = filePath ? filePath.substring(filePath.lastIndexOf('/') + 1) : 'Image';

  useEffect(() => {
    if (!filePath) {
      setError('No file path provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageDataUrl(null);
    setNaturalDimensions({ width: 0, height: 0 }); // Reset dimensions
    setZoom(1); // Reset zoom/pan on new image load
    setPan({ x: 0, y: 0 });
    setRotation(0); // Reset rotation on new image load

    // Read the file content (which should be the Data URL) from the store
    const result = readFile(filePath); 

    if (result.success) {
      if (typeof result.data === 'string' && result.data.startsWith('data:image')) {
          const dataUrl = result.data;
          setImageDataUrl(dataUrl);
          // Create an image object to get dimensions
          const img = new Image();
          img.onload = () => {
              setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              // Optional: Initial fit-to-screen on load? 
              // handleFitToScreen(img.naturalWidth, img.naturalHeight); 
          };
          img.onerror = () => {
              console.error("Failed to load image element to get dimensions for:", filePath);
              setError('Could not read image dimensions.');
          };
          img.src = dataUrl; // Set src AFTER defining onload/onerror
      } else {
          console.error("File content is not a valid Data URL:", result.data);
          setError('Invalid image data in file.');
      }
    } else {
      setError(result.error || 'Failed to read image file data.');
    }
    setIsLoading(false);

  }, [filePath, readFile]);

  // --- Control Visibility Logic ---
  const handleShowControls = () => {
      setShowControls(true);
      // Clear existing timeout if mouse moves again
      if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
      }
      // Set timeout to hide controls after a delay
      controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
      }, 2500); // Hide after 2.5 seconds of inactivity
  };

  const handleHideControlsImmediately = () => {
      if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
      return () => {
          if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
          }
      };
  }, []);

  // --- Zoom Handlers ---
  const handleZoom = (factor) => { // Removed clientX, clientY parameters
    const newZoom = Math.max(0.1, Math.min(zoom * factor, 10));
    setZoom(newZoom);
    // If coordinates were removed, the complex pan calculation is gone.
    // Pan remains unchanged unless explicitly centered (logic not added here).
  };
  const handleZoomIn = () => handleZoom(1.3);
  const handleZoomOut = () => handleZoom(1 / 1.3);

  // --- Rotation Handlers ---
  const handleRotate = (degrees) => {
    setRotation(prev => (prev + degrees) % 360);
  };
  const handleRotateLeft = () => handleRotate(-90);
  const handleRotateRight = () => handleRotate(90);

  // --- Reset View Handler ---
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0); // Reset rotation
  };

  // --- Pan Handlers ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsPanning(true);
    setStartPan({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
    if (imageRef.current) imageRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUpOrLeave = () => {
    if (isPanning) {
      setIsPanning(false);
      if (imageRef.current) imageRef.current.style.cursor = 'grab';
    }
  };

  // --- Mouse Wheel Zoom Handler (updated) ---
  const handleWheelZoom = (e) => {
    e.preventDefault(); 
    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1; 
    handleZoom(zoomFactor); // Call handleZoom without coordinates
  };

  // --- Keyboard Shortcut Handler ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only process shortcuts if this window is active
      if (windowId !== activeWindowId) return;

      let processed = false;
      switch (e.key) {
        case '+':
        case '=': // Often on the same key as +
        case 'ArrowUp':
          handleZoomIn();
          processed = true;
          break;
        case '-':
        case '_': // Often on the same key as -
        case 'ArrowDown':
          handleZoomOut();
          processed = true;
          break;
        case '0':
        case 'r':
          handleResetView();
          processed = true;
          break;
        default:
          break;
      }
      if (processed) {
         e.preventDefault(); // Prevent default browser actions for these keys
         e.stopPropagation(); // Stop event bubbling if needed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // Re-attach listener if windowId or activeWindowId changes
  }, [windowId, activeWindowId, handleZoomIn, handleZoomOut, handleResetView]); // Add handlers to dependency array

  // --- Fit to Screen Handler ---
  const handleFitToScreen = (imgWidth = naturalDimensions.width, imgHeight = naturalDimensions.height) => {
      if (!containerRef.current || !imgWidth || !imgHeight) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const padding = 32; // Add some padding around the fitted image (16px each side)

      const zoomLevel = Math.min(
          (containerWidth - padding) / imgWidth,
          (containerHeight - padding) / imgHeight,
          1 // Don't zoom in past 100% when fitting
      );
      
      setZoom(Math.max(0.05, zoomLevel)); // Ensure zoom doesn't become too small
      setPan({ x: 0, y: 0 }); // Reset pan when fitting
      setRotation(0); // Also reset rotation when fitting
  };

  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-gray-400 p-4">
             <FiLoader className="animate-spin text-3xl mb-2"/>
             <span>Loading image...</span>
          </div>
      );
  }
  
  if (error || !imageDataUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-red-400 p-4 text-center">
         <FiAlertTriangle className="text-3xl mb-2"/>
         <span>Error: {error || 'Could not load image data.'}</span>
      </div>
    );
  }

  // Basic check for common image extensions (can be expanded)
//   const isSupportedImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileName);
// This check might not be necessary anymore as we check the data URL prefix

  return (
    <div 
       ref={containerRef}
       className="flex items-center justify-center h-full w-full bg-gray-700 dark:bg-gray-800 p-0 overflow-hidden relative select-none" // overflow hidden, no padding, relative
       style={checkerboardStyle} // Apply checkerboard
       onMouseMove={(e) => { handleMouseMove(e); handleShowControls(); }} // Show controls on move
       onMouseUp={handleMouseUpOrLeave}
       onMouseLeave={handleHideControlsImmediately} // Hide immediately on leave
       onWheel={handleWheelZoom} // Add wheel event listener
    >
      <img 
        ref={imageRef}
        src={imageDataUrl} 
        alt={fileName}
        className={`block shadow-lg transition-transform duration-100 ease-out ${isPanning ? '' : 'cursor-grab'}`} // Dynamic cursor
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
          maxWidth: 'none', // Allow image to exceed container bounds when zoomed
          maxHeight: 'none',
          willChange: 'transform', // Hint for performance
          cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' // Combined cursor logic
        }}
        onMouseDown={handleMouseDown}
        draggable={false} // Prevent native image dragging
        onError={(e) => {
          e.target.onerror = null; 
          e.target.alt = `Could not display image: ${fileName}`;
          setError('Browser could not render image data.');
          setImageDataUrl(null); // Clear invalid data url
          console.error(`Failed to render image from Data URL for: ${filePath}`);
        }}
      />

      {/* Controls Overlay with Animation */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white rounded-lg px-3 py-1.5 flex items-center space-x-3 text-sm z-10" 
            initial={{ opacity: 0, y: 10 }} // Add animation props back
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Rotation Controls */} 
            <button onClick={handleRotateLeft} className="p-1 hover:bg-white/20 rounded" title="Rotate Left">
              <FiRotateCcw className="w-4 h-4"/>
            </button>
            <button onClick={handleRotateRight} className="p-1 hover:bg-white/20 rounded" title="Rotate Right">
              <FiRotateCw className="w-4 h-4"/>
            </button>
            {/* Fit Button */} 
            <button onClick={() => handleFitToScreen()} className="p-1 hover:bg-white/20 rounded ml-2" title="Fit to Screen">
              <FiMaximize className="w-4 h-4"/>
            </button>
            {/* Zoom Controls (grouped) */} 
            <div className="flex items-center space-x-1.5 ml-2 border-l border-white/20 pl-3">
              <button onClick={handleZoomOut} className="p-1 hover:bg-white/20 rounded" title="Zoom Out">
                <FiZoomOut className="w-4 h-4"/>
              </button>
              <span className="tabular-nums min-w-[40px] text-center cursor-default" title="Zoom Level">{(zoom * 100).toFixed(0)}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:bg-white/20 rounded" title="Zoom In">
                <FiZoomIn className="w-4 h-4"/>
              </button>
            </div>
            {/* Reset Button */} 
            <button onClick={handleResetView} className="p-1 hover:bg-white/20 rounded ml-2 border-l border-white/20 pl-3" title="Reset View (100% Zoom, No Rotation)">
              <FiRefreshCw className="w-4 h-4"/>
            </button>
            {/* Display Dimensions */}
            {naturalDimensions.width > 0 && (
                <span className="ml-2 border-l border-white/20 pl-3 text-xs opacity-80 cursor-default" title="Original Dimensions">
                   {naturalDimensions.width} x {naturalDimensions.height}
                </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImageViewer; 