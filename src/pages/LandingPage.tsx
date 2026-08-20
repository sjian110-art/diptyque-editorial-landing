import React, { useState, useEffect, useRef } from "react";
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
  const hasOpenedOnceRef = useRef(false);

  // 철장 오프닝 인터랙션 상태
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isGateActive, setIsGateActive] = useState(true);

  // 1. 향수병 이미지들 초기에 전부 Preload (메모리 캐싱 완료)
  useEffect(() => {
    BOTTLE_IMAGES.forEach((src) => {
      const preloadedImage = new Image();
      preloadedImage.src = src;
    });
  }, []);

  // 철장 문 열림 상태 스케줄러
  useEffect(() => {
    // 0.4초간 정지 후 양옆으로 슬라이드 열림 시작
    const openTimer = setTimeout(() => {
      setIsGateOpen(true);
    }, 400);

    // 1.5초 후 애니메이션이 완전히 끝나면 철장 DOM을 영구 제거
    const destroyTimer = setTimeout(() => {
      setIsGateActive(false);
    }, 1500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(destroyTimer);
    };
  }, []);

  // 2. 로고 클릭 시 호출되는 토글 및 이미지 스왑 핵심 로직
  const handleLogoClick = () => {
    setIsBottleVisible((prevVisible) => {
      const nextVisible = !prevVisible;
      
      if (nextVisible) {
        // [열리는 시점]: 이미지가 슬라이드 시작 전 완전히 준비되도록 먼저 변경
        if (hasOpenedOnceRef.current) {
          setBottleIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % BOTTLE_IMAGES.length;
            console.log(`Perfume bottle index swapped immediately on open click: ${prevIndex} -> ${nextIndex}`);
            return nextIndex;
          });
        } else {
          hasOpenedOnceRef.current = true; // 최초 오픈 플래그 세팅
          console.log(`First perfume bottle opened: index 0`);
        }
      }
      // [닫히는 시점]: 이미지는 그대로 둔 채 슬라이드 아웃만 진행 (깜빡임 없음)
      
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
      
      {/* Steel Gate Opening Overlay (Intro animation) */}
      {isGateActive && (
        <div className={`gate-opening-overlay ${isGateOpen ? "open" : ""}`}>
          <div className="gate-panel gate-panel-left" />
          <div className="gate-panel gate-panel-right" />
        </div>
      )}
      
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
