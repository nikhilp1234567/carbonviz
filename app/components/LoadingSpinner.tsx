import React from 'react';
import { Html } from '@react-three/drei';

export default function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin shadow-lg"></div>
        <div className="text-emerald-800 font-bold text-lg tracking-wider animate-pulse">Loading Ecosystem...</div>
      </div>
    </Html>
  );
}
