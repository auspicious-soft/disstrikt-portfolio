import React, { useState, useEffect } from "react";
import ImagesTab from "./ImageTab";
import VideoTab from "./VideoTab";
import OtherDetailsTab from "./OtherDetails";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import NotFound from "./404";

const TABS = ["Images", "Videos", "Other Details"];

const dummyImg = "/assets/dummyUserImg.png";

const Portfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Images");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.disstrikt.uk/api/portfolio/${id}`);
        if (response.status === 200) {
          setPortfolioData(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const renderTabContent = () => {
    if (!portfolioData) return null;

    switch (activeTab) {
      case "Images":
        return <ImagesTab images={portfolioData.portfolioImages || []} />;
      case "Videos":
        return <VideoTab videos={portfolioData.videos || []} />;
      case "Other Details":
        return (
          <OtherDetailsTab
            instagramLink={portfolioData.links?.find((l: any) => l.platform === "Instagram")?.url || ""}
            youtubeLink={portfolioData.links?.find((l: any) => l.platform === "Youtube")?.url || ""}
            profileImage={portfolioData.setCards ? `https://disstrikt.s3.eu-north-1.amazonaws.com/${portfolioData.setCards[0]}` : ""}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (  
      <div className="text-white h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || !portfolioData) {
    return <NotFound />;
  }

  const {
    fullName,
    email,
    phone,
    gender,
    measurements,
    dob,
    country,
    image,
    aboutMe,
  } = portfolioData;

  const getDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB");

  return (
    <div className="relative min-h-screen bg-neutral-900 overflow-hidden text-stone-200 font-kodchasan">
      <div className="absolute w-[clamp(300px,70vw,916px)] h-[clamp(300px,70vw,916px)] left-[clamp(50px,20vw,262px)] top-[54px] bg-rose-200/20 blur-[150px] sm:blur-[250px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col gap-6 sm:gap-10 p-4 sm:p-6 md:p-10">
        <div className="font-bold text-2xl sm:text-3xl md:text-4xl">{fullName}</div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          {image && (
            <img
              src={`https://disstrikt.s3.eu-north-1.amazonaws.com/${image}`}
              alt="User"
              className="w-full sm:w-[307px] h-[434px] object-cover rounded-[20px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = dummyImg;
              }}
            />
          )}

          <div className={`flex-1 flex flex-col gap-4 sm:gap-5 ${!image ? "w-full" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <UserInfo label="Full Name" value={fullName || "-"} />
              <UserInfo label="Email Address" value={email || "-"} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <UserInfo label="Country" value={country || "-"} />
              <UserInfo label="Gender" value={gender || "-"} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <UserInfo
                label="Height"
                value={measurements?.heightCm ? `${measurements.heightCm} cm` : "-"}
              />
              <UserInfo
                label="Bust, Waist, Hips"
                value={
                  measurements
                    ? `${measurements.bustCm}-${measurements.waistCm}-${measurements.hipsCm}`
                    : "-"
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <UserInfo label="Date Of Birth" value={dob ? getDate(dob) : "-"} />
              <UserInfo
                label="Shoe Size"
                value={measurements?.shoeSizeUK ? `${measurements.shoeSizeUK} UK` : "-"}
              />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-light leading-tight mt-1">
                {aboutMe || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 p-[3px] rounded-[50px] outline-offset-[-1px] inline-flex justify-center items-center max-w-full mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:w-40 p-2.5 rounded-[50px] flex justify-center items-center text-xs sm:text-sm font-kodchasan transition-all duration-200 cursor-pointer ${
                activeTab === tab ? "bg-rose-500 text-white" : "text-stone-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-xl">{renderTabContent()}</div>
      </div>
    </div>
  );
};

const UserInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 flex flex-col gap-1">
    <div className="text-xs sm:text-sm font-extrabold">{label}</div>
    <div className="text-xs sm:text-sm font-light">{value}</div>
  </div>
);

export default Portfolio;