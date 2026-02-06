import React from 'react';

export default function AboutContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-700 font-medium">
      <p>
        <strong className="text-emerald-800">Welcome to CarbonViz</strong>, an immersive interactive tool designed to bridge the gap between abstract carbon footprint numbers and tangible environmental impact. In a world where climate change discussions often revolve around invisible gases and complex statistics, CarbonViz offers a clear, visual representation of how personal lifestyle choices affect our planet&apos;s diverse ecosystems. By translating data into visual metaphors, we aim to make the invisible visible.
      </p>
      <p>
        At the heart of the application is a <strong className="text-emerald-800">dynamic Carbon Calculator</strong>. By inputting simple details about your daily life—such as household size, transportation habits, dietary preferences, and recycling practices—CarbonViz instantly estimates your annual carbon dioxide emissions. The calculator uses up-to-date emissions factors to provide a realistic snapshot of your footprint. But we don&apos;t just stop at the numbers.
      </p>
      <p>
        CarbonViz transforms this data into a <strong className="text-emerald-800">living 3D simulation</strong>. As your calculated footprint grows or shrinks, you witness the direct consequences on nature. We model five distinct biomes: <strong className="text-emerald-800">Forests, Rainforests, Mangroves, Peatlands, and Grasslands</strong>. Watch as a high-carbon lifestyle might deplete a lush forest, creating a barren landscape, or see how sustainable choices allow a mangrove ecosystem to thrive, teeming with life and biodiversity. This visual feedback is immediate and powerful.
      </p>
      <p>
        Beyond visualization, we empower you with actionable <strong className="text-emerald-800">Restoration Stats</strong>. We calculate exactly what is required to restore the balance, quantifying your impact in terms of trees to be planted or hectares of land to be conserved. This tangible feedback loop encourages experimentation—try adjusting your car usage or diet in the calculator and immediately see how many fewer trees are needed to offset your life.
      </p>
      <p>
        Whether you are an eco-enthusiast looking to optimize your habits, a student learning about environmental science, or just curious about your environmental footprint, CarbonViz provides a beautiful, non-judgmental space to explore. We believe that understanding is the first step towards action, and by seeing the beauty we can save, we are inspired to make better choices for our shared future.
      </p>
    </div>
  );
}