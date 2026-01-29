export interface CarbonInputs {
  electricity: number; // kWh per month
  gas: number; // Therms per month
  mileage: number; // Miles per year
  flights: number; // Hours per year
}

export interface UserOptions {
  householdSize: '1' | '2' | '3-4' | '5+';
  homeSize: 'Small' | 'Medium' | 'Large';
  carUsage: 'None' | 'Low' | 'Average' | 'High';
  flightFrequency: 'None' | 'Occasional' | 'Frequent' | 'Jetsetter';
}

export type Ecosystem = 'Forest' | 'Rainforest' | 'Mangrove' | 'Peatland' | 'Grassland';

export const convertUserOptionsToInputs = (options: UserOptions): CarbonInputs => {
  let electricity = 0;
  let gas = 0;
  let mileage = 0;
  let flights = 0;

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

  return { electricity, gas, mileage, flights };
};

export const calculateCarbon = (inputs: CarbonInputs) => {
  // Annualize monthly inputs
  const electricityKg = inputs.electricity * 12 * 0.4; // ~0.4 kg per kWh
  const gasKg = inputs.gas * 12 * 5.3; // ~5.3 kg per therm
  const carKg = inputs.mileage * 0.404; // ~404g per mile
  const flightKg = inputs.flights * 90; // ~90kg per hour

  const totalKg = electricityKg + gasKg + carKg + flightKg;
  const totalTonnes = totalKg / 1000;

  return { totalKg, totalTonnes };
};

export const calculateRestoration = (totalKg: number, type: Ecosystem) => {
  // Absorption rates per year
  switch (type) {
    case 'Forest':
      return { count: Math.ceil(totalKg / 20), unit: 'Trees', label: 'Trees Needed' };
    case 'Rainforest':
      return { count: Math.ceil(totalKg / 25), unit: 'Trees', label: 'Rainforest Trees' };
    case 'Mangrove':
      return { count: Math.ceil(totalKg / 30), unit: 'Trees', label: 'Mangroves' };
    case 'Peatland':
      return { count: Math.ceil(totalKg / 1.5), unit: 'm²', label: 'Area to Restore' };
    case 'Grassland':
      return { count: Math.ceil(totalKg / 0.5), unit: 'm²', label: 'Area to Restore' };
    default:
      return { count: 0, unit: 'Units', label: 'Units' };
  }
};