"use client"

import CustomVideoPlayer from "@/components/CustomVideoPlayer";


export default function VideoAdvertisement(data:any) {
 data=data.data;
  return (
    <section >
      {data.video1 && data.video2?
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomVideoPlayer src={data.video1} />
        <CustomVideoPlayer src={data.video2} />
      </div>
      :<div className="grid grid-cols-1 md:grid-cols-1">
      <CustomVideoPlayer src={data.video1} />
    </div>
}
    </section>
  )
}
