import React from 'react';
import CarbonVizClient from './components/CarbonVizClient';

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-gradient-to-b bg-blue-300 text-gray-800 font-sans">
      <CarbonVizClient />
    </main>
  );
}