import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";

interface ReviewImagesGalleryProps {
  allImages: string[];
  maxVisible?: number;
}

const ReviewImagesGallery: React.FC<ReviewImagesGalleryProps> = ({
  allImages,
  maxVisible = 5,
}) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
console.log('heree ',allImages)
  if (!allImages || allImages.length === 0) return null;

  const slides = allImages as any;
  const visibleImages = allImages.slice(0, maxVisible);
  const remaining = allImages.length - maxVisible;

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {visibleImages.map((img: any, i) => {
          const isLastVisible = i === maxVisible - 1 && remaining > 0;

          return (
            <div
              key={i}
              className="relative w-[80px] h-[80px] rounded overflow-hidden cursor-pointer group"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              <img
                src={img.src}
                alt={`review-img-${i}`}
                className="w-full h-full object-cover group-hover:opacity-80 transition"
              />
              {isLastVisible && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-semibold">
                  +{remaining}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Thumbnails]}
        thumbnails={{ vignette: true }}
        onIndexChange={(newIndex) => setIndex(newIndex)}
      />
    </>
  );
};

export default ReviewImagesGallery;
