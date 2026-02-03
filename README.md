# CarbonViz - Restoration Visualizer

CarbonViz is an interactive web application that helps users understand their carbon footprint and visualizes the environmental impact through immersive 3D ecosystems. By inputting lifestyle choices, users can see their estimated annual CO₂ emissions and learn what it would take to offset them through various ecosystem restoration efforts.

## 🌟 Key Features

*   **Interactive Carbon Calculator**: Estimate your annual carbon footprint based on:
    *   Household & Home Size
    *   Energy Usage
    *   Transportation (Car, Flights, Public Transport)
    *   Diet & Consumption Habits
*   **3D Ecosystem Visualization**:
    *   Explore 5 distinct ecosystems: **Forest, Rainforest, Mangrove, Peatland, and Grassland**.
    *   **Dynamic Visuals**: The health/density of the 3D ecosystem reacts in real-time to your carbon footprint. A lower footprint results in a lush, thriving environment, while a higher footprint visibly impacts the ecosystem's density.
*   **Restoration Metrics**: Instantly calculate the restoration effort required to offset your emissions:
    *   Number of trees to plant (for Forests, Rainforests, Mangroves).
    *   Area ($m^2$) of land to restore (for Peatlands, Grasslands).
*   **Responsive Design**: Fully optimized for both desktop and mobile experiences.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **3D Graphics**:
    *   [Three.js](https://threejs.org/)
    *   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
    *   [React Three Drei](https://github.com/pmndrs/drei)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/carbonviz.git
    cd carbonviz
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧮 How It Works

### Carbon Calculation (`app/utils/carbon.ts`)

The application takes qualitative user inputs (e.g., "Meat Lover" diet, "Frequent" flyer) and converts them into quantitative carbon emissions estimates (kg CO₂e/year).

*   **Input Conversion**: Each option maps to a specific carbon value. For example:
    *   *Diet*: "Vegan" (~1.5t) vs "Meat Lover" (~3.3t).
    *   *Flights*: "None" (0h) vs "Jetsetter" (50h+).
*   **Total Calculation**: The sum of all categories (Electricity, Gas, Transport, Diet, etc.) provides the total annual footprint.

### Restoration Logic

Different ecosystems have different carbon sequestration rates. The app calculates the offset requirements based on these approximate rates:

*   **Forest**: ~20kg CO₂/tree/year
*   **Rainforest**: ~25kg CO₂/tree/year
*   **Mangrove**: ~30kg CO₂/tree/year
*   **Peatland**: ~0.4kg CO₂/m²/year
*   **Grassland**: ~0.15kg CO₂/m²/year

### 3D Visualization Logic

The 3D scene is built using `React Three Fiber`.
*   **Dynamic Health**: A `visualDensity` factor (0.0 to 1.0) is calculated based on the user's footprint relative to a maximum baseline (35 tonnes).
*   **Islands**: Each ecosystem is represented as an "Island" component (e.g., `ForestIsland.tsx`). These components use the `visualDensity` prop to determine how many trees or plants to render, visually representing the impact of the carbon footprint.

## 📂 Project Structure

```
├── app/
│   ├── components/         # React components
│   │   ├── animals/        # 3D Animal models
│   │   ├── islands/        # 3D Ecosystem islands
│   │   ├── CarbonVizClient.tsx # Main client wrapper
│   │   ├── ThreeScene.tsx  # 3D Canvas setup
│   │   └── ...
│   ├── utils/
│   │   └── carbon.ts       # Calculation logic
│   └── page.tsx            # Entry point
├── public/                 # Static assets
└── ...
```

## 📄 License

[MIT](LICENSE)