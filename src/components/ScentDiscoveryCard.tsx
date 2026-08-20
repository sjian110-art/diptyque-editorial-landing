import React, { useState, useEffect, useRef } from "react";

interface Perfume {
  name: string;
  line: string;
}

interface ScentDiscoveryCardProps {
  onSearchScent: (selections: string[]) => void;
  onSearchMemory: (text: string) => void;
}

const EAU_DE_PARFUMS: Perfume[] = [
  { name: "Orphéon", line: "EAU DE PARFUM" },
  { name: "Philosykos", line: "EAU DE PARFUM" },
  { name: "Fleur de Peau", line: "EAU DE PARFUM" },
  { name: "Do Son", line: "EAU DE PARFUM" },
  { name: "Tam Dao", line: "EAU DE PARFUM" },
  { name: "Eau Rose", line: "EAU DE PARFUM" },
  { name: "L'Ombre dans l'Eau", line: "EAU DE PARFUM" },
  { name: "Eau Duelle", line: "EAU DE PARFUM" },
  { name: "Eau de Minthé", line: "EAU DE PARFUM" },
  { name: "Eau Capitale", line: "EAU DE PARFUM" },
  { name: "Benjoin Bohème", line: "EAU DE PARFUM" },
  { name: "Vetyverio", line: "EAU DE PARFUM" },
  { name: "Eau Nabati", line: "EAU DE PARFUM" },
  { name: "34 Boulevard Saint Germain", line: "EAU DE PARFUM" },
  { name: "Eau Rihla", line: "EAU DE PARFUM" },
  { name: "Volutes", line: "EAU DE PARFUM" },
  { name: "Tempo", line: "EAU DE PARFUM" }
];

const EAUX_DE_TOILETTE: Perfume[] = [
  { name: "Eau des Sens", line: "EAU DE TOILETTE" },
  { name: "Orphéon", line: "EAU DE TOILETTE" },
  { name: "Ilio", line: "EAU DE TOILETTE" },
  { name: "L'Eau Papier", line: "EAU DE TOILETTE" },
  { name: "Fleur de Peau", line: "EAU DE TOILETTE" },
  { name: "Philosykos", line: "EAU DE TOILETTE" },
  { name: "L'Ombre dans l'Eau", line: "EAU DE TOILETTE" },
  { name: "Do Son", line: "EAU DE TOILETTE" },
  { name: "Eau Rose", line: "EAU DE TOILETTE" },
  { name: "L'Eau des Hespérides", line: "EAU DE TOILETTE" },
  { name: "Eau Duelle", line: "EAU DE TOILETTE" },
  { name: "Vetyverio", line: "EAU DE TOILETTE" },
  { name: "L'Eau de Néroli", line: "EAU DE TOILETTE" },
  { name: "Oyédo", line: "EAU DE TOILETTE" },
  { name: "Geranium Odorata", line: "EAU DE TOILETTE" },
  { name: "Eau de Lierre", line: "EAU DE TOILETTE" },
  { name: "Tam Dao", line: "EAU DE TOILETTE" },
  { name: "Eau Mohéli", line: "EAU DE TOILETTE" },
  { name: "Olène", line: "EAU DE TOILETTE" },
  { name: "Eau Lente", line: "EAU DE TOILETTE" },
  { name: "Ofrésia", line: "EAU DE TOILETTE" },
  { name: "34 Boulevard Saint Germain", line: "EAU DE TOILETTE" },
  { name: "L'Eau Trois", line: "EAU DE TOILETTE" },
  { name: "L'Eau", line: "EAU DE TOILETTE" },
  { name: "L'Autre", line: "EAU DE TOILETTE" }
];

const MASTER_PERFUMES: Perfume[] = [...EAU_DE_PARFUMS, ...EAUX_DE_TOILETTE];

const DEFAULT_SCENT_PILLS = ["플로럴", "우디", "시트러스", "앰버", "무화과", "로즈", "머스크", "그린"];
const ADDITIONAL_SCENT_PILLS = [
  "스파이시", "오리엔탈", "아쿠아틱", "프루티", "바닐라",
  "레더", "시프레", "푸제르", "튜베로즈", "자스민",
  "오렌지 블라썸", "샌달우드", "아이리스", "패출리", "베티버"
];

const DEFAULT_MEMORY_PILLS = ["첫사랑", "벚꽃길", "새벽", "겨울 바다", "오래된 서재", "비 오는 날", "노을", "햇살"];
const ADDITIONAL_MEMORY_PILLS = [
  "숲속 산책", "따뜻한 홍차", "나른한 오후", "별 헤는 밤", "시원한 바람",
  "어린 시절", "비밀 정원", "여름 밤", "포근한 이불", "모닥불",
  "이국적인 거리", "축제의 밤", "오래된 영화관", "첫 여행", "겨울 아침"
];

const ScentDiscoveryCard: React.FC<ScentDiscoveryCardProps> = ({
  onSearchScent,
  onSearchMemory,
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "memory">("personal");
  
  // Tab 1 state (Single select)
  const [selectedScentPill, setSelectedScentPill] = useState<string | null>(null);
  const [isScentExpanded, setIsScentExpanded] = useState(false);
  
  // Tab 2 state (Single select)
  const [selectedMemoryPill, setSelectedMemoryPill] = useState<string | null>(null);
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);

  // Loading & Results state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const [recommendation, setRecommendation] = useState<Perfume | null>(null);
  
  const previousRecRef = useRef<Perfume | null>(null);
  const dotsIntervalRef = useRef<number | null>(null);
  // Refs to the submit buttons – for direct DOM class manipulation on shake
  const scentBtnRef = useRef<HTMLButtonElement | null>(null);
  const memoryBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    return () => {
      if (dotsIntervalRef.current !== null) {
        window.clearInterval(dotsIntervalRef.current);
      }
    };
  }, []);

  const handleScentPillClick = (e: React.MouseEvent, pill: string) => {
    e.stopPropagation();
    if (selectedScentPill !== pill) {
      setSelectedScentPill(pill);
    }
  };

  const handleMemoryPillClick = (e: React.MouseEvent, pill: string) => {
    e.stopPropagation();
    if (selectedMemoryPill !== pill) {
      setSelectedMemoryPill(pill);
    }
  };

  /**
   * CSS @keyframes btnShake + classList 방식으로 흔들림 실행.
   * 1) shake 클래스 제거 → reflow 강제(offsetWidth) → 클래스 재추가
   *    : 연속 클릭에도 매번 애니메이션이 처음부터 재시작됨
   * 2) animationend 이벤트에서 클래스 제거 → 원래 상태 완전 복구
   * 3) CSS 단에서 opacity:1 명시 → fadeIn forwards 충돌 원천 차단
   */
  const triggerShake = () => {
    const btn = activeTab === "personal" ? scentBtnRef.current : memoryBtnRef.current;
    if (!btn) return;

    // 1. 기존 shake 클래스 제거 (이미 흔들리는 중이어도 재시작 가능하게)
    btn.classList.remove("shake");
    // 2. reflow 강제 – 브라우저가 클래스 제거를 렌더에 반영하도록
    void btn.offsetWidth;
    // 3. shake 클래스 추가 → @keyframes btnShake 즉시 시작
    btn.classList.add("shake");

    // 4. 애니메이션 종료 후 클래스 제거 → 원래 상태 완전 복구
    const onEnd = () => {
      btn.classList.remove("shake");
      btn.removeEventListener("animationend", onEnd);
    };
    btn.addEventListener("animationend", onEnd);
  };

  const startRecommendationFlow = (e: React.MouseEvent) => {
    e.stopPropagation();

    // ── 입력 검증: 현재 탭에서 아무것도 선택하지 않은 경우 차단 ──
    const hasSelection =
      activeTab === "personal" ? selectedScentPill !== null : selectedMemoryPill !== null;

    if (!hasSelection) {
      triggerShake();
      return; // 검색 실행 ❌, 결과 표시 ❌
    }
    // ─────────────────────────────────────────────────────────────
    
    setIsLoading(true);
    setRecommendation(null);
    setLoadingDots("");

    // Cycle dots animation
    let count = 0;
    dotsIntervalRef.current = window.setInterval(() => {
      count = (count + 1) % 4;
      setLoadingDots(".".repeat(count));
    }, 500);

    // Wait 2.5 seconds to recommend
    setTimeout(() => {
      if (dotsIntervalRef.current !== null) {
        window.clearInterval(dotsIntervalRef.current);
        dotsIntervalRef.current = null;
      }
      setIsLoading(false);

      // Select random item ensuring no consecutive duplicates
      let selected: Perfume;
      let iterations = 0;
      do {
        selected = MASTER_PERFUMES[Math.floor(Math.random() * MASTER_PERFUMES.length)];
        iterations++;
      } while (
        previousRecRef.current && 
        previousRecRef.current.name === selected.name && 
        previousRecRef.current.line === selected.line && 
        iterations < 50
      );

      previousRecRef.current = selected;
      setRecommendation(selected);

      // Callback triggers
      if (activeTab === "personal") {
        onSearchScent(selectedScentPill ? [selectedScentPill] : []);
      } else {
        onSearchMemory(selectedMemoryPill || "");
      }
    }, 2500);
  };

  const handleResetFlow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScentPill(null);
    setSelectedMemoryPill(null);
    setIsScentExpanded(false);
    setIsMemoryExpanded(false);
    setIsLoading(false);
    setRecommendation(null);
    setLoadingDots("");
  };

  const handleTabChange = (e: React.MouseEvent, tab: "personal" | "memory") => {
    e.stopPropagation();
    setActiveTab(tab);
    // Collapse layouts to fit sizes nicely on tab toggle
    setIsScentExpanded(false);
    setIsMemoryExpanded(false);
  };

  return (
    <div className="scent-card">
      <div className="card-tabs" onClick={(e) => e.stopPropagation()}>
        <button
          className={`card-tab-btn ${activeTab === "personal" ? "active" : ""}`}
          onClick={(e) => handleTabChange(e, "personal")}
        >
          나만의 향 찾기
        </button>
        <button
          className={`card-tab-btn ${activeTab === "memory" ? "active" : ""}`}
          onClick={(e) => handleTabChange(e, "memory")}
        >
          기억 속 향 찾기
        </button>
      </div>

      <div className="card-content-wrapper">
        {activeTab === "personal" ? (
          <div className="tab-pane fade-in-element">
            <div className="card-scroll-pane">
              <span className="card-subtitle uppercase-tracking">FIND YOUR SCENT</span>
              <h2 className="card-title">나만의 향을 발견해보세요</h2>
              
              <div className="pills-grid" onClick={(e) => e.stopPropagation()}>
                {DEFAULT_SCENT_PILLS.map((pill) => {
                  const isSelected = selectedScentPill === pill;
                  return (
                    <button
                      key={pill}
                      className={`pill-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => handleScentPillClick(e, pill)}
                    >
                      {pill}
                    </button>
                  );
                })}

                {isScentExpanded &&
                  ADDITIONAL_SCENT_PILLS.map((pill) => {
                    const isSelected = selectedScentPill === pill;
                    return (
                      <button
                        key={pill}
                        className={`pill-btn ${isSelected ? "selected" : ""}`}
                        onClick={(e) => handleScentPillClick(e, pill)}
                      >
                        {pill}
                      </button>
                    );
                  })}
              </div>
              <div 
                className="more-pills-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsScentExpanded(!isScentExpanded);
                }}
              >
                {isScentExpanded ? "- 접기" : "+ 더보기"}
              </div>
            </div>

            <button 
              ref={scentBtnRef}
              className={`card-submit-btn ${isLoading ? "loading" : ""}`} 
              onClick={recommendation ? handleResetFlow : startRecommendationFlow}
              disabled={isLoading}
            >
              {isLoading 
                ? `당신만의 향을 찾고 있습니다${loadingDots}` 
                : recommendation 
                  ? "다시 추천받기" 
                  : "향 추천받기"}
            </button>
          </div>
        ) : (
          <div className="tab-pane fade-in-element">
            <div className="card-scroll-pane">
              <span className="card-subtitle uppercase-tracking">SCENT OF MEMORIES</span>
              <h2 className="card-title">기억 속 향을 발견해보세요</h2>
              
              <div className="pills-grid" onClick={(e) => e.stopPropagation()}>
                {DEFAULT_MEMORY_PILLS.map((pill) => {
                  const isSelected = selectedMemoryPill === pill;
                  return (
                    <button
                      key={pill}
                      className={`pill-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => handleMemoryPillClick(e, pill)}
                    >
                      {pill}
                    </button>
                  );
                })}

                {isMemoryExpanded &&
                  ADDITIONAL_MEMORY_PILLS.map((pill) => {
                    const isSelected = selectedMemoryPill === pill;
                    return (
                      <button
                        key={pill}
                        className={`pill-btn ${isSelected ? "selected" : ""}`}
                        onClick={(e) => handleMemoryPillClick(e, pill)}
                      >
                        {pill}
                      </button>
                    );
                  })}
              </div>
              <div 
                className="more-pills-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMemoryExpanded(!isMemoryExpanded);
                }}
              >
                {isMemoryExpanded ? "- 접기" : "+ 더보기"}
              </div>
            </div>

            <button 
              ref={memoryBtnRef}
              className={`card-submit-btn ${isLoading ? "loading" : ""}`} 
              onClick={recommendation ? handleResetFlow : startRecommendationFlow}
              disabled={isLoading}
            >
              {isLoading 
                ? `당신만의 향을 찾고 있습니다${loadingDots}` 
                : recommendation 
                  ? "다시 추천받기" 
                  : "향 추천받기"}
            </button>
          </div>
        )}

        {/* Results Block */}
        {recommendation && (
          <div className="results-block">
            <div className="result-essence-label">SELECTED ESSENCE</div>
            <div className="result-perfume-name">{recommendation.name}</div>
            <div className="result-perfume-line">{recommendation.line}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScentDiscoveryCard;
