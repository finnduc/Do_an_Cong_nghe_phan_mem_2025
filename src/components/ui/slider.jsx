'use client';

import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';

export default function DualRangeSlider({
  defaultValue = [0, 100000],
  min = 0,
  max = 100000,
  step = 1,
}) {
  const [range, setRange] = useState(defaultValue);
  return (
    <div>
      <Slider.Root
        value={range}
        onValueChange={(val) => setRange(val)}
        min={min}
        max={max}
        step={step}
        className="relative flex items-center w-full h-5 touch-none select-none"
      >
        <Slider.Track className="relative flex-1 h-[3px] bg-black/40 rounded-full">
          <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-3 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-black/50"
          aria-label="Minimum"
        />
        <Slider.Thumb
          className="block size-3 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-black/50"
          aria-label="Maximum"
        />
      </Slider.Root>

      {/* Hiển thị giá trị ngay bên dưới */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>Min: {range[0]}</span>
        <span>Max: {range[1]}</span>
      </div>
    </div>
  );
}