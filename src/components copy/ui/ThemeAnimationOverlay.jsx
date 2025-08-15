import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This component is now separate and will be rendered at the root level of your layout.
const ThemeAnimationOverlay = ({ animation, setAnimation, theme }) => {
  // We'll hardcode the variant for now since it's used in one place.
  // You can pass it as a prop if you need different animations elsewhere.
  const variant = 'circle-blur'; 

  return (
    <AnimatePresence>
      {animation && animation.type === 'circle' && (
        <motion.div
          key={animation.key}
          initial={{ clipPath: animation.clipPath.initial }}
          animate={{ clipPath: animation.clipPath.animate }}
          exit={{ clipPath: animation.clipPath.initial }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onAnimationComplete={() => setAnimation(null)}
          // High z-index to cover everything. pointer-events-none allows clicks to go through.
          className={`pointer-events-none fixed inset-0 z-[9999] ${
            variant === 'circle-blur' ? 'backdrop-blur-lg' : ''
          } ${theme === 'dark' ? 'bg-white' : 'bg-zinc-900'}`}
        />
      )}
      {/* You can add the GIF variant logic here if needed */}
    </AnimatePresence>
  );
};

export default ThemeAnimationOverlay;