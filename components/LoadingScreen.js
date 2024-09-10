import React from 'react';
import { Shield } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="animate-pulse">
        <Shield size={64} className="text-blue-500" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Loading Superhero World...</h2>
      <p className="mt-2 text-gray-400">Assembling your team of heroes</p>
    </div>
  );
};

export default LoadingScreen;