import React from 'react';
import { Instagram, Youtube } from 'lucide-react';

interface OtherDetailsTabProps {
  instagramLink: string;
  youtubeLink: string;
  profileImage: string;
}

const OtherDetailsTab: React.FC<OtherDetailsTabProps> = ({ instagramLink, youtubeLink, profileImage }) => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-5">
      <div className={`flex-1 inline-flex flex-col justify-start items-start gap-1.5 w-full ${profileImage ? "w-full" : "sm:w-1/2"}`}>
        <div className="self-stretch justify-start text-stone-200 text-xm font-extrabold font-['Minork_Sans_']">
          View Profile On
        </div>
        <div className="w-full h-60 flex flex-col justify-start items-start gap-3.5">
          <button
            onClick={() => handleLinkClick(instagramLink)}
            className="self-stretch flex-1 px-2.5 py-2 bg-zinc-800 rounded-[10px] border-r-2 border-b-2 border-stone-700 inline-flex justify-center items-center gap-2.5"
          >
            <Instagram className="w-7 h-7 text-white" />
            <div className="justify-start text-white text-base font-medium font-['Kodchasan'] leading-none">
              Instagram
            </div>
          </button>
          <button
            onClick={() => handleLinkClick(youtubeLink)}
            className="self-stretch flex-1 px-2.5 py-2 bg-zinc-800 rounded-[10px] border-r-2 border-b-2 border-stone-700 inline-flex justify-center items-center gap-2.5"
          >
            <Youtube className="w-7 h-7 text-white" />
            <div className="justify-start text-white text-base font-medium font-['Kodchasan'] leading-none">
              Youtube
            </div>
          </button>
        </div>
      </div>
      {profileImage && (
        <div className="flex-1 sm:w-1/2 inline-flex flex-col justify-start items-start gap-1.5">
          <div className="self-stretch justify-start text-stone-200 text-xm font-extrabold font-['Minork_Sans_']">
            Set Card
          </div>
          <img
            className="w-full h-96 object-contain rounded-[10px]"
            src={profileImage}
            alt="Profile Card"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/fallback-image.jpg";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default OtherDetailsTab;