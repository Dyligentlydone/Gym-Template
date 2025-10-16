import React from 'react';
import { motion } from 'framer-motion';
import WhyConstellation from './WhyConstellation/WhyConstellation';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent pb-2"
          >
            What's Your Why?
          </motion.h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <WhyConstellation />
        </motion.div>
      </div>
    </div>
  );
}