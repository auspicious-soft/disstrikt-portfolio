
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-black h-screen w-screen flex flex-col items-center justify-center overflow-hidden text-white px-4">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-9xl font-extrabold text-rose-600 drop-shadow-lg"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="text-2xl mt-4 text-center font-medium"
      >
        Oops! Invalid Portfolio Link
      </motion.p>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="text-md mt-2 text-center text-gray-400 max-w-md"
      >
          It looks like the portfolio you're trying to view doesn’t exist or the link is broken. 
        Please make sure you have the correct link.
      </motion.p>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-rose-500 hover:bg-rose-600 rounded-full font-semibold transition-colors"
      >
        Go to Home
      </motion.button>
    </div>
  );
}