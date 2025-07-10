// components/VideoSlider.jsx
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import { image_base_url } from '@/contant';

import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';


export default function VideoSlider({data}:any) {
    const videos=data.videos;
  
  return (
   <div className="w-full mx-auto ">
      <Swiper
       
   
       navigation={{
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }}
      modules={[Navigation]}
        
        spaceBetween={10}
       slidesPerView={2}
      
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }}
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id} >
            <Link href={`/product/${video.slug}`}>
               <CustomVideoPlayer src={`${image_base_url}/storage/videos/${video.video}`} />
            </Link>
        
          </SwiperSlide>
        ))}
      
      </Swiper>
    </div>
  );
}
