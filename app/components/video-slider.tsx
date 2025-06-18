// components/VideoSlider.jsx
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import { image_base_url } from '@/contant';

import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';


export default function VideoSlider({data}:any) {
    const videos=data.videos;
  
  return (
    <div className="w-full mx-auto  my-10 ">
      <Swiper
       
    className="custom-swiper1 pb-[40px]"
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
          <SwiperSlide key={video.id}>
           <CustomVideoPlayer src={`${image_base_url}/storage/videos/${video.video}`} />
          </SwiperSlide>
        ))}
          <div className="swiper-button-prev w-1 h-6 bg-gray-100 text-black  flex items-center justify-center hover:bg-gray-300"></div>
  <div className="swiper-button-next w-[20px] h-[26px] bg-gray-100 text-black  flex items-center justify-center hover:bg-gray-300"></div>

      </Swiper>
    </div>
  );
}
