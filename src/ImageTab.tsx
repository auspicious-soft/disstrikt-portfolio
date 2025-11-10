import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";

interface ImagesTabProps {
  images: string[];
}

const ImagesTab: React.FC<ImagesTabProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (img: string) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const breakpointColumnsObj = {
    default: 5, // large screens
    1000: 4,    // ≥1280px
    704: 3,    // ≥1024px
    400: 2,
    300:1,     // ≥640px
  }

  return (
    <>
     <Masonry
        breakpointCols={breakpointColumnsObj}
        className="-ml-4 flex w-auto" // fix horizontal gaps
        columnClassName="pl-4 space-y-4" // fix vertical gaps
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="rounded-[10px] overflow-hidden cursor-pointer"
            onClick={() => openModal(img)}
          >
            <img
              src={`https://disstrikt.s3.eu-north-1.amazonaws.com/${img}`}
              alt="Disstrikt"
              className="w-full rounded-[10px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/fallback-image.jpg";
              }}
            />
          </div>
        ))}
      </Masonry>


      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-white hover:text-stone-200"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={`https://disstrikt.s3.eu-north-1.amazonaws.com/${selectedImage}`}
                alt="Registration background"
                className="w-full h-auto max-h-[80vh] object-contain rounded-[10px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/fallback-image.jpg";
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImagesTab;