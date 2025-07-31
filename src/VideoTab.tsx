import React from "react";

interface Video {
  src: string;
  title: string;
}

interface VideoTabProps {
  videos: Video[];
}

const VideoTab: React.FC<VideoTabProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {videos.map((video, idx) => (
        <div key={idx} className="w-full flex flex-col items-start gap-2">
          <video
            src={video.src}
            className="w-full aspect-[312/312] rounded-[10px] object-cover"
            controls
              width={312}
            height={312}
            muted
          />
          <div className="text-stone-200 text-xs font-normal font-['Kodchasan']">
            {video.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoTab;
