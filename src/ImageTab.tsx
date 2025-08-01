import React from "react";

interface ImagesTabProps {
  images: string[];
}

const ImagesTab: React.FC<ImagesTabProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="w-full aspect-[1/1] rounded-[10px] overflow-hidden"
        >
          <img
            src={`https://disstrikt.s3.eu-north-1.amazonaws.com/${img}`}
            alt={`Image ${idx}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/fallback-image.jpg";
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesTab;