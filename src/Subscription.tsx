import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "./assets/Logo (Name) 1.svg";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./utils/Loader";

const Subscription = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [activePlanData, setActivePlanData] = useState([]);
  const [planId, setPlanId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authToken } = useParams<{ authToken: string }>();

  const token = localStorage.getItem("authToken") || authToken;

    const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.disstrikt.uk/api/user/get-active-plan",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(response.status === 200){
      setActivePlanData(response.data.data);
      setPlanId(response.data.data.planId);
      setSubscriptionStatus(response.data.data.status || "");
      }
      else if(response.status === 401){
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.info();
  useEffect(() => {
    if (planId && subscriptionStatus !== "canceled") {
      setSelectedPlan(planId);
    }
  }, [planId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.disstrikt.uk/api/user/plans",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if(response.status === 200){
        setSubscriptionPlans(response.data.data);
        }
        else if (response.status === 401){
          handleLogout()
        }
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
    setLoading(true);

    try {
      const setupIntentRes = await axios.get(
        "https://api.disstrikt.uk/api/user/setup-intent",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data: setupData } = setupIntentRes.data;
      const currency = setupData.country.toLowerCase() === "uk" ? "gbp" : "eur";

      const planRes = await axios.post(
        "https://api.disstrikt.uk/api/user/plans",
        { planId: selectedPlan, currency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const checkoutUrl = planRes.data.data.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No checkout URL returned from API");
      }
    } catch (error) {
      console.error("Error starting trial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (type: any) => {
    setLoading(true);

    try {
      await axios.post(
        "https://api.disstrikt.uk/api/paid-user/update-subscription",
        { type: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      toast.success("Your subscription has been canceled.");
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (type: string) => {
    setLoading(true);

    try {
      if (selectedPlan === planId) {
        toast.error("You are already on this plan.");
        return;
      }
      await axios.post(
        "https://api.disstrikt.uk/api/paid-user/update-subscription",
        { type: type, planId: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Your subscription has been upgraded.");
      window.location.reload();
      
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="w-full min-h-screen bg-neutral-900 relative overflow-hidden font-body flex justify-center items-start px-4 py-8">
        <div className="absolute w-[916px] h-[916px] left-1/2 top-[54px] -translate-x-1/2 bg-rose-200/20 blur-[250px]" />

        <div className="relative z-10 flex w-full max-w-7xl bg-transparent rounded-xl overflow-hidden flex-col-reverse lg:flex-row-reverse h-auto lg:p-6 lg:gap-6 gap-0">
          {/* Mobile App Section */}
          <div className="w-full lg:w-2/5 relative overflow-hidden rounded-xl lg:bg-gradient-to-br lg:from-rose-200/10 lg:via-neutral-800 lg:to-neutral-900 flex flex-col justify-center items-center lg:p-8 p-0 gap-6">
            <div className="text-center mt-6">
              <h2 className="text-2xl font-semibold text-rose-300 mb-2">
                Get Our Mobile App
              </h2>
              <p className="text-zinc-400 text-sm">
                Enjoy Disstrikt on the go. Available on iOS & Android.
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-rose-300/30 rounded-lg px-4 py-2 transition-all"
              >
                <svg
                  className="w-5 h-5 text-rose-300"
                  fill="currentColor"
                  viewBox="0 0 384 512"
                >
                  <path d="M318.7 268.7c-.3-37.9 16.9-66.5 52.1-87.6-19.5-28.4-49.2-44.4-86.7-47.2-36.3-2.7-76.5 21.3-90.7 21.3-14.4 0-47.5-20.4-73.4-20-37.8.6-72.8 21.9-92.3 55.9-39.3 68.4-10 170.1 28.2 226.1 18.8 27.4 41.1 58.3 70.6 57.2 28.4-1.1 39.1-18.4 73.2-18.4 34.2 0 44 18.4 73.5 17.8 30.3-.6 49.4-27.7 67.9-55.3a210.6 210.6 0 0 0 28.3-57.5c-75.2-28.3-70.9-133.4-9.7-164.3zM258.2 92c17.7-21.4 29.4-51.4 26.2-81.6-25.2 1-55.4 17-73.3 38.4-16 18.4-29.9 48.3-26.2 77.5 27.8 2.2 55.6-14.1 73.3-34.3z" />
                </svg>
                <span className="text-sm text-zinc-200 font-medium">
                  App Store
                </span>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-rose-300/30 rounded-lg px-4 py-2 transition-all"
              >
                <svg
                  className="w-5 h-5 text-rose-300"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M380.9 199.9L115.9 35.6C104.8 28.7 90.4 28.7 79.3 35.6C68.3 42.4 62 54.6 62 67.8V444.2C62 457.4 68.3 469.6 79.3 476.4C90.4 483.3 104.8 483.3 115.9 476.4L380.9 312.1C392 305.3 398.3 293.1 398.3 279.9C398.3 266.7 392 254.5 380.9 247.7V199.9zM445.4 152.4C445.4 139.2 439.1 127 428.1 120.2C417 113.3 402.6 113.3 391.5 120.2L424.4 152.4L391.5 184.6C402.6 191.4 417 191.4 428.1 184.6C439.1 177.8 445.4 165.6 445.4 152.4zM391.5 327.4L424.4 359.6L391.5 391.8C402.6 398.6 417 398.6 428.1 391.8C439.1 385 445.4 372.8 445.4 359.6C445.4 346.4 439.1 334.2 428.1 327.4C417 320.6 402.6 320.6 391.5 327.4z" />
                </svg>
                <span className="text-sm text-zinc-200 font-medium">
                  Google Play
                </span>
              </a>
            </div>
          </div>

          {/* Plans Section - Now takes more width */}
          <div
            className="w-full lg:w-3/5 flex flex-col gap-5 px-6 sm:px-8 py-10 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="w-full flex justify-between items-center">
              <img src={logo} alt="logo" className="w-28 h-16" />

              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-rose-300 border border-rose-300/30 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-stone-200 mb-4">
                Subscription Plans
              </h1>
              <p className="text-zinc-400 mb-6">
                Choose a plan that suits your needs.
              </p>
            </div>

            {/* PLANS LIST */}
            <div className="flex flex-col gap-4 pb-4">
              {subscriptionPlans.length > 0 ? (
                subscriptionPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-rose-200/10 relative backdrop-blur-sm rounded-xl p-5 border border-rose-200/20 hover:border-rose-300/40 transition-all cursor-pointer"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {planId === plan._id && subscriptionStatus === "active" ? (
                      <span className="absolute top-[-10px] right-[-5px] z-10 bg-rose-400 text-white text-xs font-semibold py-1 px-2 rounded">
                        Active
                      </span>
                    ) : subscriptionStatus === "trialing" &&
                      planId === plan._id ? (
                      <span className="absolute top-[-10px] right-[-5px] z-10 bg-rose-400 text-white text-xs font-semibold py-1 px-2 rounded">
                        Trialing
                      </span>
                    ) : subscriptionStatus === "canceling" &&
                      planId === plan._id ? (
                      <span className="absolute top-[-10px] right-[-5px] z-10 bg-yellow-400 text-white text-xs font-semibold py-1 px-2 rounded">
                        Canceling
                      </span>
                    ) : null}

                    {/* Rose ring when selected or subscribed */}
                    <div
                      className={`absolute inset-0 rounded-xl transition-all ${
                        selectedPlan === plan._id ? "ring-2 ring-rose-400" : ""
                      }`}
                    />

                    <div className="flex relative justify-between items-start mb-3">
                      <h3 className="text-rose-400 font-bold text-lg">
                        {plan.name}
                      </h3>
                      <span className="text-stone-200 font-semibold">
                        {activePlanData.country?.toLowerCase() === "uk"
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

            {/* Dynamic Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {subscriptionStatus === "trialing" && (
                <>
                  <button
                    onClick={() => handleCancel("cancelTrial")}
                    className="flex-1 bg-red-500/80 hover:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Start Plan Now
                  </button>
                  {selectedPlan !== planId && (
                    <button
                      onClick={() => handleUpgrade("upgrade")}
                      className="flex-1 bg-rose-400/80 hover:bg-rose-300 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </>
              )}

              {subscriptionStatus === "active" && (
                <>
                  <button
                    onClick={() => handleCancel("cancelSubscription")}
                    className="flex-1 bg-red-500/80 hover:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Cancel Subscription
                  </button>
                  {selectedPlan !== planId && (
                    <button
                      onClick={() => handleUpgrade("upgrade")}
                      className="flex-1 bg-rose-400/80 hover:bg-rose-300 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </>
              )}

              {!subscriptionStatus && (
                <button
                  disabled={!selectedPlan}
                  onClick={handleTrialStart}
                  className={`w-full bg-rose-400/80 hover:bg-rose-300 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all ${
                    !selectedPlan ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Start With 14 Days Free Trial
                </button>
              )}
              {subscriptionStatus === "canceling" && (
                <button
                  disabled={true}
                  className="w-full bg-rose-400/80 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all 
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-400"
                >
                  Cancellation in Process
                </button>
              )}
              {subscriptionStatus === "canceled" && (
                <button
                  disabled={!selectedPlan}
                  onClick={handleTrialStart}
                  className={`w-full bg-rose-400/80 hover:bg-rose-300 text-neutral-900 font-semibold py-3 px-4 rounded-lg transition-all ${
                    !selectedPlan ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Buy Plan Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </>
  );
};

export default Subscription;
