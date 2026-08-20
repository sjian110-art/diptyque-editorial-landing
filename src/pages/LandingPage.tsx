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
    if (!isBottleVisible) {
      // 1. 닫혀있을 때 클릭 -> 현재 이미지로 자연스럽게 슬라이드 인
      setIsBottleVisible(true);
    } else {
      // 2. 열려있을 때 클릭 -> 슬라이드 아웃 시작
      setIsBottleVisible(false);
      // 3. 화면 밖으로 완전히 사라진(트랜지션 0.8초 완료) 시점에 다음 이미지로 백그라운드 교체
      // (슬라이드 아웃 도중 이미지가 깜빡거리며 바뀌는 현상 차단)
      setTimeout(() => {
        setBottleIndex((prev) => (prev + 1) % BOTTLE_IMAGES.length);
      }, 800);
    }
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
