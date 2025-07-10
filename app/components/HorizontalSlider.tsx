// components/HorizontalSlider.js
'use client';

import { useRef } from 'react';
import ProductCard from './product-card';

export default function HorizontalSlider({ items }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
    sliderRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded"
      >
        ◀
      </button>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto scroll-smooth space-x-4 px-8 py-4"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-[200px] h-40 bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-md"
          >
           <ProductCard {...item} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded"
      >
        ▶
      </button>
    </div>
  );
}
