import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      fill="none" 
      className={className}
    >
      <path 
        d="M24.5 25H7.5C4.46 25 2 22.54 2 19.5C2 16.65 4.17 14.29 6.94 14.05C7.53 9.87 11.13 6.5 15.5 6.5C19.87 6.5 23.47 9.87 24.06 14.05C26.83 14.29 29 16.65 29 19.5C29 22.54 26.54 25 24.5 25Z" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        fill="rgba(236, 253, 245, 0.5)"
      />
      <text 
        x="16" 
        y="20" 
        fontFamily="sans-serif" 
        fontWeight="bold" 
        fontSize="9" 
        textAnchor="middle" 
        fill="currentColor"
      >
        CO₂
      </text>
    </svg>
  );
}
