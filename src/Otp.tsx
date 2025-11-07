import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import logo from "./assets/Logo (Name) 1.svg";
import LoginImg from "./assets/pexels-nerdcinema-19306017.png";
import axios from "axios";
import toast from "react-hot-toast";

const Otp = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
  const email = queryParams.get("email");
  const country = queryParams.get("country");
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        setLoading(true);

    try {
      const enteredOtp = otp.join("");
      const response = await axios.post("https://api.disstrikt.uk/api/verify-otp", {
        value: email,
        otp: enteredOtp,
        language: queryParams.get("lang") || "en",
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        const token = response.data.data.token;
        localStorage.setItem("authToken", token);
        setTimeout(()=>{
          navigate(`/subscription`);
        }, 500);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }finally{
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
          setLoading(false);

    }
  };

  const handleResendOtp = async () => {
        setLoading(true);

    try {
      const response = await axios.post("https://api.disstrikt.uk/api/resend-otp", {
        value: email,
        language: queryParams.get("lang") || "en",
        purpose: "SIGNUP",
      });
      if (response.status === 200) {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
    finally{
          setLoading(false);
    }
  };

  // ✨ Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="w-full h-[100dvh] bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center px-4 sm:px-6">
      {/* Glow background */}
      <div className="absolute w-[600px] sm:w-[800px] md:w-[916px] h-[600px] sm:h-[800px] md:h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />

      <motion.div
        className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-auto md:h-[630px] md:p-6 gap-y-10 md:gap-x-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Image */}
        <motion.div
          className="hidden md:flex flex-1 relative w-full h-auto overflow-hidden rounded-xl"
          variants={slideIn}
          initial="hidden"
          animate="visible"
        >
          <img
            src={LoginImg}
            alt="Illustration"
            className="object-contain w-full h-full rounded-xl"
          />
        </motion.div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-center gap-6 px-4 sm:px-8 py-10 w-full max-w-md mx-auto">
          {/* Logo */}
          <motion.div
            className="w-full flex justify-start mb-4 sm:mb-6"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <img src={logo} alt="logo" className="w-24 sm:w-28 h-auto" />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="flex flex-col gap-2 text-center md:text-left"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-200 mb-2">
              Enter OTP
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-semibold text-rose-400">{email}</span>
            </p>
          </motion.div>

          {/* OTP Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6 mt-4"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex gap-2 sm:gap-3 justify-center"
              variants={fadeUp}
              custom={2}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  variants={fadeUp}
                  custom={index + 2}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl rounded-full bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              ))}
            </motion.div>

            <motion.button
              type="submit"
              variants={fadeUp}
              custom={8}
              className="w-full max-w-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all duration-200"
            >
              Verify OTP
            </motion.button>
          </motion.form>

          {/* Resend Link */}
          <motion.p
            onClick={handleResendOtp}
            variants={fadeUp}
            custom={9}
            className="text-rose-400 cursor-pointer underline text-center hover:text-rose-300 transition-colors text-sm sm:text-base"
          >
            Resend OTP
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Otp;