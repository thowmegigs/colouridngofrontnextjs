'use client'

import { useEffect } from 'react';

type PreloadAsset = { url: string; type: 'image' | 'video' }

export default function DynamicPreload({ assets }: { assets: PreloadAsset[] }) {
  useEffect(() => {
    const preloadLinks: HTMLLinkElement[] = []

    assets.forEach(({ url, type }) => {
      if (!url) return

      if (type === 'image') {
        const img = new Image()
        img.src = url
      } else if (type === 'video') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'video'
        link.href = url
        link.type = 'video/mp4'
        document.head.appendChild(link)
        preloadLinks.push(link)
      }
    })

    // Clean up on unmount
    return () => {
      preloadLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
    }
  }, [assets])

  return null
}
