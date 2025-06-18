'use client';

import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type FadeImageProps = ImageProps & {
  fallbackSrc?: string;
};

const FadeImage = ({
  src,
  alt,
  fallbackSrc = '/placeholder.png',
  className = '',
  ...props
}: FadeImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={clsx('relative', className)}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Actual image */}
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true); // end shimmer even if error
        }}
        className={clsx(
          'transition-opacity duration-700 ease-in-out object-cover w-full h-full',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};

export default FadeImage;
