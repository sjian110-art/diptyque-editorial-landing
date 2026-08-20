import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveAppPreview from "../components/LiveAppPreview";
import EnvelopeExperience from "../components/EnvelopeExperience";

const LandingPage: React.FC = () => {
  const [isBottleVisible, setIsBottleVisible] = useState(false);

  const handleSearchScent = (selections: string[]) => {
    console.log("Search Scent triggered with selections:", selections);
  };

  const handleSearchMemory = (text: string) => {
    console.log("Search Memory triggered with text:", text);
  };

  return (
    <div className="landing-page-container">
      {/* Background image overlay to match premium aesthetic */}
      <div className="landing-background-overlay" />
      
      <Header onLogoClick={() => setIsBottleVisible((prev) => !prev)} />
      
      {/* Sliding Perfume Bottle (Fixed overlay on the left) */}
      <img
        src="/assets/Diptyque_bottle.png"
        alt="Diptyque Perfume Bottle"
        className={`slide-perfume-bottle ${isBottleVisible ? "show" : ""}`}
      />
      
      <main className="landing-main-content">
        <div className="left-preview-section">
          <LiveAppPreview />
        </div>
        
        <div className="right-envelope-section">
          <EnvelopeExperience
            onSearchScent={handleSearchScent}
            onSearchMemory={handleSearchMemory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
