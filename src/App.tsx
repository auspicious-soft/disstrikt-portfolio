import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import Portfolio from "./Portfolio";
import Landing from "./Landing";
import Register from "./Register";
import Otp from "./Otp";
import Subscription from "./Subscription";
import Login from "./Login";
import withAuthProtection from "./withAuthProtection";

// Wrap protected page
const ProtectedSubscription = withAuthProtection(Subscription);

function App() {
  return (
    <div className="max-h-[100vh]">
      {/* ✅ Global Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#f87171",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/portfolio/:id" element={<Portfolio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/subscription/:authToken" element={<ProtectedSubscription />} /> {/* ✅ Protected */}
         <Route path="/subscription" element={<ProtectedSubscription />} /> {/* ✅ Protected */}

      </Routes>
    </div>
  );
}

export default App;
