// ImageGalleryWithZoom.jsx
import { image_base_url } from '@/contant';
import Image from 'next/image';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


export default function ImageGalleryWithZoom({ images, selectedVariant, product, activeImage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(activeImage);
   
    const openLightbox = (index) => {
        setStartIndex(index);
        setIsOpen(true);
    };

    return (
        <>
            {/* Main Gallery */}
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}" 
        style="width: 14px; height: 14px; background:#000000; margin: 4px; border-radius: 2px;">
      </span>`;
                    },
                }}
                className="relative custom-swiper pb-6" // add bottom padding to make space for pagination
            >
                {images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <Image
                            src={`${image_base_url}${img}`}
                            width={400}
                            height={500}
                            alt={`img-${i}`}
                            className="cursor-pointer w-full h-full object-cover" // use object-cover for full image fit
                            onClick={() => openLightbox(i)}
                            priority={false}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-10 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg z-50 hover:bg-red-500 hover:text-white transition"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    {/* Zoomable Swiper with Navigation */}
                    <Swiper
                        zoom={true}
                        navigation={true}
                        modules={[Zoom, Navigation]}
                        initialSlide={startIndex}
                        spaceBetween={10}
                        slidesPerView={1}
                        className="w-full h-full"
                        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                    >
                        {images.map((img, i) => {
                            return <SwiperSlide key={i}>
                                <div className="swiper-zoom-container">
                                    <Image width={400} height={400} src={`${image_base_url}${img}`} alt={`Zoom ${i}`} priority={false} />
                                </div>
                            </SwiperSlide>
                        })}
                    </Swiper>
                </div>
            )}
        </>
    );
}

