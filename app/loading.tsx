'use client';

import Image from 'next/image';

type LoadingScreenProps = {
  logoSrc?: string;      // Path to your logo (defaults to /logo.png)
  logoAlt?: string;
};

export default function LoadingScreen({
  logoSrc = '/loading.gif',
  logoAlt = 'Logo',
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={100}
        height={80}
        priority
        className="select-none"
      />

    </div>
  );
}
