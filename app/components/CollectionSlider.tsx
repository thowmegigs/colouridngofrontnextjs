// components/HorizontalSlider.js
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import SafeImage from './SafeImage';

export default function CollectionSlider({ items }) {
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
        className="hidden md:block absolute left-[10px] md:left-[18px] top-1/2 -translate-y-1/2 z-10 bg-white shadow opacity-70 px-2 py-1 rounded"
      >
        ◀
      </button>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto space-x-4 px-1  scrollbar-hide"
      >
        {items.map((item, index) => (
           <Link
              key={item.id}
              href={`/collection/${item.slug}`}
                 className="min-w-[50%] md:min-w-[25%] bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-md"
      
            >
         
            <SafeImage
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={600}
              height={300}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
              className="w-full rounded-lg transition-transform group-hover:scale-105"
            />
         
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded hidden md:block"
      >
        ▶
      </button>
    </div>
  );
}
