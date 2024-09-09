import React from 'react';
import { motion } from 'framer-motion';

const StatBar = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon}
    <span className="text-white ml-2">{label}:</span>
    <div className="ml-auto bg-gray-700 w-32 h-4 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${(value / 500) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <span className="text-white ml-2 w-8 text-right">{value}</span>
  </div>
);

export default StatBar;