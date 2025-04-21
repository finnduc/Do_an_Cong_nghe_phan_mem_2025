import { useState } from 'react';

const DualRangeSlider = () => {
  const [minVal, setMinVal] = useState(20);
  const [maxVal, setMaxVal] = useState(80);
  const min = 0;
  const max = 100;

  // Đảm bảo min luôn nhỏ hơn max
  const handleMinChange = (e) => {
    const val = Math.min(+e.target.value, maxVal - 1);
    setMinVal(val);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(+e.target.value, minVal + 1);
    setMaxVal(val);
  };

  return (
    <div className="relative w-full max-w-md px-4 py-8">
      <div className="relative h-2 bg-gray-300 rounded">
        <div
          className="absolute h-2 bg-blue-500 rounded"
          style={{
            left: `${(minVal / max) * 100}%`,
            width: `${((maxVal - minVal) / max) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
        />
      </div>
      <div className="flex justify-between mt-4 text-sm">
        <span>Min: {minVal}</span>
        <span>Max: {maxVal}</span>
      </div>
    </div>
  );
};

export default DualRangeSlider;