import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900 bg-opacity-30 backdrop-blur-2xl">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full" />
      </motion.div>
    </div>
  );
};

export default Loader;