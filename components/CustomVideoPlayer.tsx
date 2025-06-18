import { useEffect, useRef, useState } from "react";

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      const video = videoRef.current;
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden ">
      <video autoPlay muted playsInline loop
        ref={videoRef}
        src={src} 
        className="w-full md:w-auto object-cover md:object-cover rounded-xl h-full"
      />
      {/* <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <span className="text-[10px] sm:text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div className="w-full bg-white/20 h-2 rounded">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default CustomVideoPlayer;
