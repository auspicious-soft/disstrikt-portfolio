import React from "react";

interface ImagesTabProps {
  images: string[]; // Only string URLs, no StaticImageData
}

const ImagesTab: React.FC<ImagesTabProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="w-full h-[312px] bg-black/10 flex items-center justify-center rounded-[10px] overflow-hidden"
        >
          <img
            src={`https://disstrikt.s3.eu-north-1.amazonaws.com/${img}`}
            alt={`Image ${idx}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};


export default ImagesTab;