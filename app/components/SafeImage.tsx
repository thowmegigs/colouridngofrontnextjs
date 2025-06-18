'use client';

import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type ShimmerImageProps = ImageProps & {
  fallbackSrc?: string;
};

const SafeImage = ({
  src,
  alt,
  fallbackSrc = '/placeholder.png',
  className = '',
  ...props
}: ShimmerImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      onLoad={() => setLoading(false)}
      onError={() => {
        setLoading(false);
        setError(true);
      }}
      className={clsx(
        'transition-opacity duration-300',
        loading && 'bg-gray-200 ',
        !loading && 'opacity-100',
        className
      )}
      {...props}
    />
  );
};

export default SafeImage;
