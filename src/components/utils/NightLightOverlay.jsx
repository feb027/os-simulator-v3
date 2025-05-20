// src/components/utils/NightLightOverlay.jsx
import React from 'react';
import useDesktopStore from '../../stores/desktopStore';
import { AnimatePresence, motion } from 'framer-motion';

function NightLightOverlay() {
  const isNightLightEnabled = useDesktopStore((state) => state.isNightLightEnabled);

  return (
    <AnimatePresence>
      {isNightLightEnabled && (
        <motion.div 
          className="absolute inset-0 w-full h-full bg-orange-400/10 dark:bg-orange-500/15 pointer-events-none z-[5]" 
          // z-index: above background(0), below icons(10?), below windows(dynamic), below taskbar(50?)
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Slower transition for night light
          aria-hidden="true" 
        />
      )}
    </AnimatePresence>
  );
}

export default NightLightOverlay;