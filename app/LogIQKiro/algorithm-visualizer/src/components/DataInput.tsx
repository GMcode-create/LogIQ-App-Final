import React, { useState } from 'react';

interface DataInputProps {
  onDataChange: (data: number[]) => void;
  currentData: number[];
}

export const DataInput: React.FC<DataInputProps> = ({ onDataChange, currentData }) => {
  const [inputValue, setInputValue] = useState(currentData.join(', '));
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setError('');

    if (!value.trim()) {
      setError('Please enter some numbers');
      return;
    }

    try {
      const numbers = value
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => {
          const num = parseFloat(s);
          if (isNaN(num)) {
            throw new Error(`"${s}" is not a valid number`);
          }
          return Math.round(num);
        });

      if (numbers.length === 0) {
        setError('Please enter at least one number');
        return;
      }

      if (numbers.length > 50) {
        setError('Maximum 50 numbers allowed for performance');
        return;
      }

      onDataChange(numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const generateRandomData = (size: number, min: number = 1, max: number = 100) => {
    const data = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    setInputValue(data.join(', '));
    onDataChange(data);
    setError('');
  };

  return (
    <div className="data-input bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Input Data</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter numbers (comma-separated):
        </label>
        <textarea
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
          className="w-full p-2 border border-gray-300 rounded-md resize-none h-20"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Generate:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generateRandomData(8, 1, 50)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            8 Random (1-50)
          </button>
          <button
            onClick={() => generateRandomData(15, 1, 100)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            15 Random (1-100)
          </button>
          <button
            onClick={() => generateRandomData(25, 1, 200)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            25 Random (1-200)
          </button>
          <button
            onClick={() => onDataChange([5, 4, 3, 2, 1])}
            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            Reverse Sorted
          </button>
          <button
            onClick={() => onDataChange([1, 2, 3, 4, 5])}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Already Sorted
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Current array: [{currentData.join(', ')}] ({currentData.length} elements)
      </div>
    </div>
  );
};