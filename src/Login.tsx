import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion"; 
import logo from "./assets/Logo (Name) 1.svg";
import LoginImg from "./assets/pexels-nerdcinema-19306017.png";
import { allCountries } from "country-telephone-data";
import { languages, countries } from "./utils/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./utils/Loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, language:"en",country:"UK" ,userType: "web", fcmToken: "some_fcm_token" };
      const response = await axios.post("https://api.disstrikt.uk/api/login", payload);
      if (response.status === 200) {
        const token = response.data.data.token;
        const lang = response.data.data.language;
        const country = response.data.data.country;
        const subscriptionStatus = response.data.data.subscription;
        const planId = response.data.data.planId;
        const userType = response.data.data.userType;
        if(userType !== "web") {
          toast.error("Only web users can log in here.");
          setLoading(false);
          return;
        }
        console.log('token:', token);
        localStorage.setItem("authToken", token);
        toast.success("Logged In successfully!");
        navigate(`/subscription`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  const slideIn = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <>
    {loading ? <Loader/> : 
    <div className="w-full h-[100dvh] bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center px-4">
      {/* Blurred glow background */}
      <div className="absolute w-[700px] sm:w-[916px] h-[700px] sm:h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />

      <motion.div
        className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-auto md:h-[630px] md:p-6 gap-y-10 md:gap-x-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left side: Image */}
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

        {/* Right side: Register form */}
        <div className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-8 py-10 w-full">
          {/* Logo */}
          <motion.div
            className="w-full flex justify-start"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
          >
            <img src={logo} alt="logo" className="w-28 h-16 transition-all" />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="flex flex-col gap-2"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-stone-200 text-3xl font-extrabold capitalize">
              Login to Your Account
            </h1>
            <p className="text-zinc-400 text-base font-normal">
              Fill in your details to login to your account.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
          >
            {[
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />,
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-400 pr-12"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            ].map((field, i) => (
              <motion.div key={i} custom={i} variants={fadeUp}>
                {field}
              </motion.div>
            ))}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={fadeUp}
              custom={7}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.form>
          <p className="text-zinc-400 text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-rose-500 hover:underline">
              Register here
            </a>
          </p>  
        </div>
      </motion.div>
    </div>
}
    </>
  );
};

export default Login;
