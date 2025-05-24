'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SafeImage({ src, alt, ...props }) {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!src) return;

    fetch(src, { method: 'HEAD' })
      .then((res) => setValid(res.ok))
      .catch(() => setValid(false));
  }, [src]);

  if (!valid) {
    return <Image src={'/cat.png'} alt={alt} {...props} />; // Or fallback <Image />
  }

  return <Image src={src} alt={alt} {...props} />;
}
