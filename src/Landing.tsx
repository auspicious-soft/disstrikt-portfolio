import React from "react";
import { motion } from "framer-motion";
import bgimg from "./assets/newng.jpg"
const Landing: React.FC = () => {
  return (
    <div className="w-screen h-screen relative overflow-hidden text-white font-kodchasan">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${bgimg})`,
        }}
      />

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.8 }}
          className="text-5xl font-bold mb-4"
        >
          Welcome to Our Portfolio
        </motion.h1>

        <motion.p
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.2 }}
          className="text-lg max-w-xl"
        >
          Discover creativity, passion, and professionalism all in one place.
        </motion.p>
        <motion.p
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.2 }}
          className="text-lg max-w-xl cursor-pointer text-rose-400 underline mt-4"
          onClick={() => { window.location.href = "/register"; }}
        >
          Click Here to Register now and unlock exclusive benefits!
        </motion.p>

      </div>
    </div>
  );
};

export default Landing;
