// src/components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number; // El progreso en porcentaje (0 a 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
      <div
        className="h-full bg-green-500"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default ProgressBar;
