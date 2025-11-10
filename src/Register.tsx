import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import logo from "./assets/Logo (Name) 1.svg";
import LoginImg from "./assets/pexels-nerdcinema-19306017.png";
import { allCountries } from "country-telephone-data";
import { languages, countries } from "./utils/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    countryCode: "",
    phone: "",
    country: "",
    language: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const closeDropdown = () => {
    setShowDropdown(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (showDropdown) closeDropdown();
    else setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const validatePassword = (password) => {
    const lengthValid = password.length >= 8;
    const upperValid = /[A-Z]/.test(password);
    const specialValid = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return lengthValid && upperValid && specialValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setIsPasswordValid(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters long, contain one uppercase letter, and one special character."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        userType: "web",
        fcmToken: "some_fcm_token",
      };
      const response = await axios.post(
        "https://api.disstrikt.uk/api/register",
        payload
      );
      if (response.status === 201) {
        toast.success("Registered Successfully!");
        const encodedEmail = encodeURIComponent(formData.email);
        navigate(
          `/verify-otp?email=${encodedEmail}&lang=${formData.language}&country=${formData.country}`
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if all fields are filled
  const isFormFilled = Object.values(formData).every(
    (val : any) => val && val.trim() !== ""
  );

  // ✅ Button should be disabled if any field empty or invalid password
  const isButtonDisabled = !isFormFilled || loading;

  const countryCodeOptions = allCountries.map((c) => ({
    name: c.name,
    iso2: c.iso2,
    dialCode: `+${c.dialCode}`,
  }));

  const filteredOptions = countryCodeOptions.filter(
    (opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.dialCode.includes(searchTerm)
  );

  const countryOptions = countries.map((code) => ({
    name:
      code === "NL"
        ? "Netherlands"
        : code === "BE"
        ? "Belgium"
        : code === "FR"
        ? "France"
        : code === "UK"
        ? "United Kingdom"
        : code === "ES"
        ? "Spain"
        : code,
    code,
  }));

  const languageOptions = languages.map((lang) => ({
    label:
      lang === "en"
        ? "English"
        : lang === "nl"
        ? "Dutch"
        : lang === "fr"
        ? "French"
        : lang === "es"
        ? "Spanish"
        : lang,
    value: lang,
  }));

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
    <div className="w-full min-h-screen bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center px-4">
      {/* Background glow */}
      <div className="absolute w-[700px] sm:w-[916px] h-[700px] sm:h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px] pointer-events-none" />

      <motion.div
        className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-auto md:h-[630px] md:p-6 gap-y-10 md:gap-x-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Image */}
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

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-8 py-10 w-full">
          {/* Logo */}
          <motion.div
            className="w-full flex justify-start"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
          >
            <img src={logo} alt="logo" className="w-28 h-16" />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="flex flex-col gap-2"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-stone-200 text-3xl font-extrabold capitalize">
              Create Your Account
            </h1>
            <p className="text-zinc-400 text-base font-normal">
              Fill in your details to register your account.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
          >
            {/* Full Name */}
            <motion.div custom={1} variants={fadeUp}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
              />
            </motion.div>

            {/* Email */}
            <motion.div custom={2} variants={fadeUp}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
              />
            </motion.div>

            {/* Password */}
            <motion.div custom={3} variants={fadeUp}>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-12 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </motion.div>

            {/* Phone & Country Code */}
            <motion.div custom={4} variants={fadeUp}>
              <div className="flex gap-1">
                <div
                  className="relative w-1/3"
                  ref={dropdownRef}
                  onBlur={closeDropdown}
                >
                  <div
                    onClick={toggleDropdown}
                    className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white cursor-pointer flex justify-between items-center"
                  >
                    {formData.countryCode ? (
                      <span>{formData.countryCode}</span>
                    ) : (
                      <span className="text-zinc-400">Select Code</span>
                    )}
                    <svg
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {showDropdown && (
                    <div className="absolute z-50 w-full bottom-full mb-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-neutral-700">
                        <input
                          type="text"
                          placeholder="Search code"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 text-white border border-neutral-700 focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <ul className="overflow-y-auto max-h-48">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((opt) => (
                            <li
                              key={opt.iso2}
                              onMouseDown={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  countryCode: opt.dialCode,
                                }));
                                closeDropdown();
                              }}
                              className="px-4 py-2 hover:bg-rose-500 hover:text-white cursor-pointer text-sm text-gray-200"
                            >
                              ({opt.dialCode})
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-400 text-sm">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-2/3 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </motion.div>

            {/* Country */}
            <motion.div custom={5} variants={fadeUp}>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="appearance-none w-full px-4 py-2 pr-10 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Select Country</option>
                {countryOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Language */}
            <motion.div custom={6} variants={fadeUp}>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="appearance-none w-full px-4 py-2 pr-10 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Select Language</option>
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isButtonDisabled}
              variants={fadeUp}
              custom={7}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </motion.form>

          {/* Already have account */}
          <motion.p
            className="text-zinc-400 text-center text-sm mt-4 pointer-events-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Already have an account?{" "}
            <a href="/" className="text-rose-500 hover:underline">
              Login here
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
