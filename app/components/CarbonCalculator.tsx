'use client';

import React from 'react';
import { UserOptions } from '../utils/carbon';

interface Props {
  options: UserOptions;
  onChange: (options: UserOptions) => void;
}

// Custom arrow icon for selects
const ArrowIcon = () => (
  <div className="absolute right-3 top-[2.2rem] pointer-events-none text-emerald-600">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
  </div>
);

export default function CarbonCalculator({ options, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...options,
      [name]: value,
    });
  };

  const selectClass = "w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/30 focus:border-emerald-500 focus:bg-white/70 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-800 text-sm font-semibold appearance-none cursor-pointer hover:bg-white/60 shadow-sm backdrop-blur-sm";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";
  const groupClass = "relative";

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className={groupClass}>
          <label className={labelClass}>Household Size</label>
          <select name="householdSize" value={options.householdSize} onChange={handleChange} className={selectClass}>
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3-4">3-4 People</option>
            <option value="5+">5+ People</option>
          </select>
          <ArrowIcon />
        </div>

        <div className={groupClass}>
          <label className={labelClass}>Home Size</label>
          <select name="homeSize" value={options.homeSize} onChange={handleChange} className={selectClass}>
            <option value="Small">Apartment</option>
            <option value="Medium">Medium House</option>
            <option value="Large">Large House</option>
          </select>
          <ArrowIcon />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={groupClass}>
          <label className={labelClass}>Car Usage</label>
          <select name="carUsage" value={options.carUsage} onChange={handleChange} className={selectClass}>
            <option value="None">None</option>
            <option value="Low">Low (&lt;5k mi)</option>
            <option value="Average">Avg (~10k mi)</option>
            <option value="High">High (&gt;20k mi)</option>
          </select>
          <ArrowIcon />
        </div>

        <div className={groupClass}>
          <label className={labelClass}>Flights / Year</label>
          <select name="flightFrequency" value={options.flightFrequency} onChange={handleChange} className={selectClass}>
            <option value="None">None</option>
            <option value="Occasional">1-2 Short</option>
            <option value="Frequent">2-3 Long</option>
            <option value="Jetsetter">Frequent</option>
          </select>
          <ArrowIcon />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={groupClass}>
          <label className={labelClass}>Diet</label>
          <select name="diet" value={options.diet} onChange={handleChange} className={selectClass}>
            <option value="Meat Lover">Meat Lover</option>
            <option value="Average">Average</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
          </select>
          <ArrowIcon />
        </div>

        <div className={groupClass}>
          <label className={labelClass}>Recycling</label>
          <select name="recycling" value={options.recycling} onChange={handleChange} className={selectClass}>
            <option value="None">None</option>
            <option value="Some">Some</option>
            <option value="Diligent">Diligent</option>
          </select>
          <ArrowIcon />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={groupClass}>
          <label className={labelClass}>Public Transport</label>
          <select name="publicTransport" value={options.publicTransport} onChange={handleChange} className={selectClass}>
            <option value="None">None</option>
            <option value="Occasional">Occasional</option>
            <option value="Frequent">Frequent</option>
          </select>
          <ArrowIcon />
        </div>

        <div className={groupClass}>
          <label className={labelClass}>Shopping Habits</label>
          <select name="shopping" value={options.shopping} onChange={handleChange} className={selectClass}>
            <option value="Minimal">Minimal</option>
            <option value="Average">Average</option>
            <option value="Shopaholic">Shopaholic</option>
          </select>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
}
