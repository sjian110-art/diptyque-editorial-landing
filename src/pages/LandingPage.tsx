import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveAppPreview from "../components/LiveAppPreview";
import EnvelopeExperience from "../components/EnvelopeExperience";

const BOTTLE_IMAGES = [
  "/assets/Diptyque_bottle.png",
  "/assets/Diptyque_bottle2.png",
  "/assets/Diptyque_bottle3.png",
  "/assets/Diptyque_bottle4.png",
  "/assets/Diptyque_bottle5.png",
];

const LandingPage: React.FC = () => {
  const [isBottleVisible, setIsBottleVisible] = useState(false);
  const [bottleIndex, setBottleIndex] = useState(0);

  const handleLogoClick = () => {
    setIsBottleVisible((prevVisible) => {
      const nextVisible = !prevVisible;
      
      console.log(`Logo clicked. isBottleVisible will be: ${nextVisible}`);
      
      if (!nextVisible) {
        // 닫히는 애니메이션(800ms)이 끝난 뒤 다음 인덱스로 변경 (깜빡임 방지)
        setTimeout(() => {
          setBottleIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % BOTTLE_IMAGES.length;
            console.log(`Perfume bottle index changed: ${prevIndex} -> ${nextIndex} (${BOTTLE_IMAGES[nextIndex]})`);
            return nextIndex;
          });
        }, 800);
      }
      return nextVisible;
    });
  };

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
      
      <Header onLogoClick={handleLogoClick} />
      
      {/* Sliding Perfume Bottle (Fixed overlay on the left) */}
      <img
        src={BOTTLE_IMAGES[bottleIndex]}
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
