import React from 'react';
import { Player } from '../types/game';
import { Check, Plus, Minus } from 'lucide-react';

interface TrickInputProps {
  player: Player;
  label: string;
  description?: string;
  maxValue: number;
  disallowedValue?: number;
  onValueSelected: (value: number) => void;
  prediction?: number;
}

interface SelectedValue {
  value: number;
  confirmed: boolean;
}

interface SelectedValue {
  value: number;
  confirmed: boolean;
}

const TrickInput: React.FC<TrickInputProps> = ({
  player,
  label,
  description,
  maxValue,
  disallowedValue,
  onValueSelected,
  prediction
}) => {
  const [selectedValue, setSelectedValue] = React.useState<number>(0);
  const totalAvailableTricks = maxValue * 4; // This was the bug - using an arbitrary multiplier
  
  const handleIncrement = () => {
    if (selectedValue + 1 === disallowedValue) return;
    setSelectedValue(prev => Math.min(maxValue, prev + 1));
  };
  
  const handleDecrement = () => {
    setSelectedValue(prev => Math.max(0, prev - 1));
  };
  
  const handleConfirm = () => {
    onValueSelected(selectedValue);
    setSelectedValue(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-center mb-2">
        {player.name}: {label} kiezen
      </h3>
      
      {description && (
        <p className="text-center text-amber-600 text-sm mb-4 bg-amber-50 p-2 rounded-md">
          {description}
        </p>
      )}
      
      {prediction !== undefined && (
        <p className="text-center text-gray-600 mb-2">
          Voorspelling: {prediction}
        </p>
      )}
      
      <div className="flex flex-col items-center space-y-4 mt-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleDecrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none transition-colors"
            disabled={selectedValue === 0}
          >
            <Minus size={24} />
          </button>
          <span className="text-4xl font-bold w-16 text-center">{selectedValue}</span>
          <button
            onClick={handleIncrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none transition-colors"
            disabled={selectedValue === maxValue || selectedValue + 1 === disallowedValue}
          >
            <Plus size={24} />
          </button>
        </div>
        
        <button
          onClick={handleConfirm}
          className="flex items-center py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Check size={18} className="mr-2" />
          Bevestig {selectedValue} {label}
        </button>
      </div>
      
      {selectedValue + 1 === disallowedValue && (
        <p className="text-sm text-amber-600 text-center mt-4">
          Let op: Je kunt niet {disallowedValue} slagen voorspellen omdat dit het totaal gelijk zou maken aan het aantal beschikbare slagen.
        </p>
      )}
    </div>
  );
};

export default TrickInput;