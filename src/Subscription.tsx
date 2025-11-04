import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "./assets/Logo (Name) 1.svg";
import LoginImg from "./assets/pexels-nerdcinema-19306017.png";
import { useLocation } from "react-router-dom";

const Subscription = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  console.log('subscriptionPlans:', subscriptionPlans);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  console.log("selectedPlan:", selectedPlan);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country");
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.disstrikt.uk/api/user/plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubscriptionPlans(response.data.data);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchData();
  }, []);
  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan._id);
  };
const handleTrialStart = async () => {
  if (!selectedPlan) return;

  try {
    const token = localStorage.getItem("authToken");

    // 1️⃣ GET setup-intent
    const setupIntentRes = await axios.get(
      "https://api.disstrikt.uk/api/user/setup-intent",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { data: setupData } = setupIntentRes.data;
    console.log("Setup Intent Response:", setupData);

    const currency =
      (setupData.country.toLowerCase() === "uk" ? "gbp" : "eur");

    // 2️⃣ POST user/plans
    const planRes = await axios.post(
      "https://d37f7ed132be.ngrok-free.app/api/user/plans",
      {
        planId: selectedPlan,
        currency,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const checkoutUrl = planRes.data.data.url;
    console.log("Checkout URL:", checkoutUrl);

    // 3️⃣ Redirect user directly to Stripe Checkout
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      console.error("No checkout URL returned from API");
    }
  } catch (error) {
    console.error("Error starting trial:", error);
  }
};

  return (
    <div className="w-full h-screen bg-neutral-900 relative overflow-hidden font-body flex justify-center items-center">
      {/* Blurred glow background */}
      <div className="absolute w-[916px] h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />

      <div className="relative z-10 flex w-full max-w-6xl bg-transparent rounded-xl overflow-hidden flex-col md:flex-row-reverse h-full md:h-[650px] md:p-6 gap-x-16">
        {/* Right side: Fixed Image */}
        <div className="hidden md:flex flex-1 relative w-full h-full overflow-hidden rounded-xl">
          <img
            src={LoginImg}
            alt="Illustration"
            className="object-contain w-full h-full"
          />
        </div>

        {/* Left side: Scrollable form */}
        <div
          className="flex-1 flex flex-col gap-5 px-6 sm:px-8 py-10 w-full h-full overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Logo */}
          <div className="w-full flex justify-start">
            <img src={logo} alt="logo" className="w-28 h-16 transition-all" />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-stone-200 mb-4">
              Subscription Plans
            </h1>
            <p className="text-zinc-400 mb-6">
              Choose a plan that suits your needs.
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="flex flex-col gap-4 pb-4">
            {subscriptionPlans.length > 0 ? (
              subscriptionPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-rose-200/10 relative backdrop-blur-sm rounded-xl p-5 border border-rose-200/20 hover:border-rose-300/40 transition-all"
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div
                    className={`absolute inset-0 rounded-xl transition-all ${
                      selectedPlan === plan._id ? "ring-2 ring-rose-400" : ""
                    }`}
                  />
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-rose-400 font-bold text-lg">
                      {plan.name}
                    </h3>
                    <span className="text-stone-200 font-semibold">
                      {country.toLowerCase() === "uk"
                        ? `£${plan.gbpAmount}`
                        : `€${plan.eurAmount}`}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm mb-3">
                    {plan.description}
                  </p>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-zinc-300 text-sm"
                      >
                        <svg
                          className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-zinc-400">Loading subscription plans...</p>
            )}
          </div>

          {/* Trial Button */}
          <button
            disabled={!selectedPlan}
            onClick={handleTrialStart}
            className={`w-full bg-rose-400/80 hover:bg-rose-300 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all ${
              !selectedPlan ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Start With 14 Days Free Trial.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
