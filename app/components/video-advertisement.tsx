"use client"

import CustomVideoPlayer from "@/components/CustomVideoPlayer";


export default function VideoAdvertisement(data:any) {
 data=data.data;
  return (
    <section className="mt-2">
      {data.video1 && data.video2?
      <div className="grid grid-cols-2 gap-2">
        <CustomVideoPlayer src={data.video1} />
        <CustomVideoPlayer src={data.video2} />
      </div>
      :<div className="grid grid-cols-1">
      <CustomVideoPlayer src={data.video1} />
    </div>
}
    </section>
  )
}
