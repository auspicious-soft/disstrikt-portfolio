import React, { useState, useEffect } from "react";
import ImagesTab from "./ImageTab";
import VideoTab from "./VideoTab";
import OtherDetailsTab from "./OtherDetails";
import { useParams,useNavigate } from "react-router-dom";
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
        return <VideoTab videos={(portfolioData.videos || []).map((url: string, i: number) => ({ src: url, title: `Video ${i + 1}` }))} />;
      case "Other Details":
        return (
          <OtherDetailsTab
            instagramLink={portfolioData.links?.find((l: any) => l.platform === "Instagram")?.url || ""}
            youtubeLink={portfolioData.links?.find((l: any) => l.platform === "Youtube")?.url || ""}
            profileImage={portfolioData.image ? `https://disstrikt.s3.eu-north-1.amazonaws.com/${portfolioData.image}` : dummyImg}
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
  return (
   <NotFound/>
  );
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
      <div className="absolute w-[916px] h-[916px] left-[262px] top-[54px] bg-rose-200/20 blur-[250px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col gap-10 p-10">
        <div className="font-bold text-4xl">{fullName}</div>

        <div className="flex gap-10">
          <img
            src={image ? `https://disstrikt.s3.eu-north-1.amazonaws.com/${image}` : dummyImg}
            alt="User"
            width={307}
            height={434}
            className="object-cover rounded-[20px]"
          />

          <div className="flex-1 flex flex-col gap-5">
            <div className="flex gap-10">
              <UserInfo label="Full Name" value={fullName || "-"} />
              <UserInfo label="Email Address" value={email || "-"} />
            </div>
            <div className="flex gap-10">
            <UserInfo label="Country" value={country || "-"} />
              <UserInfo label="Gender" value={gender || "-"} />
            </div>
            <div className="flex gap-10">
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
            <div className="flex gap-10">
             <UserInfo
                label="Date Of Birth"
                value={dob ? getDate(dob) : "-"}
              />
             
              <UserInfo
                label="Shoe Size"
                value={
                  measurements?.shoeSizeUK
                    ? `${measurements.shoeSizeUK} UK`
                    : "-"
                }
              />
            </div>

            <div>
              <p className="text-sm font-light leading-tight mt-1">
                {aboutMe || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 p-[3px] rounded-[50px] outline-offset-[-1px] inline-flex justify-center items-center max-w-fit mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-40 p-2.5 rounded-[50px] flex justify-center items-center text-sm font-kodchasan transition-all duration-200 cursor-pointer ${
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
    <div className="text-xm font-extrabold ">{label}</div>
    <div className="text-sm font-light">{value}</div>
  </div>
);

export default Portfolio;
