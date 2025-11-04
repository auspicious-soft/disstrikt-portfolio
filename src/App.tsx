import React from "react";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio";
import Landing from "./Landing";
import Register from "./Register";
import Otp from "./Otp";
import Subscription from "./Subscription";
import Login from "./Login";
import withAuthProtection from "./withAuthProtection"; // ✅ Import HOC

// Wrap protected page
const ProtectedSubscription = withAuthProtection(Subscription);

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/portfolio/:id" element={<Portfolio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/subscription" element={<ProtectedSubscription />} /> {/* ✅ Protected */}
      </Routes>
    </div>
  );
}

export default App;
