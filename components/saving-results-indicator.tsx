import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SavingIndicatorProps {
  isVisible: boolean;
}

export const SavingResultsIndicator: React.FC<SavingIndicatorProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="px-4 py-3 shadow-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center space-x-3">
              {/* Animated spinner using Lucide icon */}
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              
              {/* Text with subtle animation */}
              <motion.span
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-sm font-medium text-foreground"
              >
                Result is being saved...
              </motion.span>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};