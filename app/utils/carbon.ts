export interface CarbonInputs {
  electricity: number; // kWh per month
  gas: number; // Therms per month
  mileage: number; // Miles per year
  flights: number; // Hours per year
  diet: number; // kg per year
  recycling: number; // kg per year (adjustment)
  publicTransport: number; // kg per year
  shopping: number; // kg per year
}

export interface UserOptions {
  householdSize: '1' | '2' | '3-4' | '5+';
  homeSize: 'Small' | 'Medium' | 'Large';
  carUsage: 'None' | 'Low' | 'Average' | 'High';
  flightFrequency: 'None' | 'Occasional' | 'Frequent' | 'Jetsetter';
  diet: 'Meat Lover' | 'Average' | 'Vegetarian' | 'Vegan';
  recycling: 'None' | 'Some' | 'Diligent';
  publicTransport: 'None' | 'Occasional' | 'Frequent';
  shopping: 'Minimal' | 'Average' | 'Shopaholic';
}

export type Ecosystem = 'Forest' | 'Rainforest' | 'Mangrove' | 'Peatland' | 'Grassland';

export const convertUserOptionsToInputs = (options: UserOptions): CarbonInputs => {
  let electricity = 0;
  let gas = 0;
  let mileage = 0;
  let flights = 0;
  let diet = 0;
  let recycling = 0;
  let publicTransport = 0;
  let shopping = 0;

  // 1. Home Energy (Electricity & Gas)
  // Base estimates per month based on home size + people
  const baseElec = { 'Small': 200, 'Medium': 350, 'Large': 600 };
  const baseGas = { 'Small': 15, 'Medium': 30, 'Large': 60 };
  
  // Multipliers for household size
  const sizeMult = { '1': 1, '2': 1.2, '3-4': 1.5, '5+': 1.8 };
  
  electricity = baseElec[options.homeSize] * sizeMult[options.householdSize];
  gas = baseGas[options.homeSize] * sizeMult[options.householdSize];

  // 2. Car Usage (Miles per year)
  // None: 0, Low: 3000, Average: 10000, High: 20000
  switch (options.carUsage) {
    case 'None': mileage = 0; break;
    case 'Low': mileage = 3000; break;
    case 'Average': mileage = 10000; break;
    case 'High': mileage = 20000; break;
  }

  // 3. Flights (Hours per year)
  // None: 0, Occasional: 4 (1-2 short hauls), Frequent: 15 (2-3 medium/long), Jetsetter: 50+
  switch (options.flightFrequency) {
    case 'None': flights = 0; break;
    case 'Occasional': flights = 4; break;
    case 'Frequent': flights = 15; break;
    case 'Jetsetter': flights = 50; break;
  }

  // 4. Diet (kg CO2e per year)
  // Meat Lover: 3.3t, Average: 2.5t, Vegetarian: 1.7t, Vegan: 1.5t
  switch (options.diet) {
    case 'Meat Lover': diet = 3300; break;
    case 'Average': diet = 2500; break;
    case 'Vegetarian': diet = 1700; break;
    case 'Vegan': diet = 1500; break;
  }

  // 5. Recycling (kg CO2e per year adjustment)
  // None: +200, Some: 0, Diligent: -200
  switch (options.recycling) {
    case 'None': recycling = 200; break;
    case 'Some': recycling = 0; break;
    case 'Diligent': recycling = -200; break;
  }
  
  // 6. Public Transport (kg CO2e per year)
  // None: 0, Occasional: 200, Frequent: 500
  switch (options.publicTransport) {
    case 'None': publicTransport = 0; break;
    case 'Occasional': publicTransport = 200; break;
    case 'Frequent': publicTransport = 500; break;
  }

  // 7. Shopping Habits (kg CO2e per year - embedded carbon)
  // Minimal: 500, Average: 1500, Shopaholic: 4000
  switch (options.shopping) {
    case 'Minimal': shopping = 500; break;
    case 'Average': shopping = 1500; break;
    case 'Shopaholic': shopping = 4000; break;
  }

  return { electricity, gas, mileage, flights, diet, recycling, publicTransport, shopping };
};

export const calculateCarbon = (inputs: CarbonInputs) => {
  // Annualize monthly inputs
  const electricityKg = inputs.electricity * 12 * 0.4; // ~0.4 kg per kWh
  const gasKg = inputs.gas * 12 * 5.3; // ~5.3 kg per therm
  const carKg = inputs.mileage * 0.404; // ~404g per mile
  const flightKg = inputs.flights * 180; // ~180kg per hour (w/ radiative forcing)
  const dietKg = inputs.diet;
  const recyclingKg = inputs.recycling;
  const publicTransportKg = inputs.publicTransport;
  const shoppingKg = inputs.shopping;

  const totalKg = electricityKg + gasKg + carKg + flightKg + dietKg + recyclingKg + publicTransportKg + shoppingKg;
  const totalTonnes = totalKg / 1000;

  return { totalKg, totalTonnes };
};

export const calculateRestoration = (totalKg: number, type: Ecosystem) => {
  // Absorption rates per year
  switch (type) {
    case 'Forest':
      return { count: Math.ceil(totalKg / 20), unit: 'Trees', label: 'Trees to Offset' };
    case 'Rainforest':
      return { count: Math.ceil(totalKg / 25), unit: 'Trees', label: 'Trees to Offset' };
    case 'Mangrove':
      return { count: Math.ceil(totalKg / 30), unit: 'Trees', label: 'Trees to Offset' };
    case 'Peatland':
      return { count: Math.ceil(totalKg / 0.4), unit: 'm²', label: 'm² to Restore' };
    case 'Grassland':
      return { count: Math.ceil(totalKg / 0.15), unit: 'm²', label: 'm² to Restore' };
    default:
      return { count: 0, unit: 'Units', label: 'Units' };
  }
};