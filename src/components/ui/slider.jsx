"use client";

import * as Slider from "@radix-ui/react-slider";

export default function DualRangeSlider({
  value,
  onValueChange,
  min = 0,
  max = 100000,
  step = 1,
}) {
  return (
    <div>
      <Slider.Root
        // Sử dụng giá trị từ prop 'value'
        value={value}
        // Gọi hàm từ prop 'onValueChange' khi giá trị thay đổi
        onValueChange={onValueChange}
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
      <div className="flex justify-between text-xs text-gray-600">
        <span>Min: {value[0]}</span>
        <span>Max: {value[1]}</span>
      </div>
    </div>
  );
}
