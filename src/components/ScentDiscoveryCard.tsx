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
  // Refs for the submit buttons – used to trigger shake animation directly on DOM
  const scentBtnRef = useRef<HTMLButtonElement | null>(null);
  const memoryBtnRef = useRef<HTMLButtonElement | null>(null);
  // Accumulated setTimeout IDs for the shake sequence
  const shakeTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (dotsIntervalRef.current !== null) {
        window.clearInterval(dotsIntervalRef.current);
      }
      // shake 타이머 전부 정리
      shakeTimersRef.current.forEach((id) => window.clearTimeout(id));
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
   * translateX만 사용하는 순수 좌우 흔들림.
   * - animation 속성을 건드리지 않음 → fadeIn forwards fill 유지 → opacity 불변
   * - transform: translateX만 인라인으로 직접 조작 → 버튼이 절대 사라지지 않음
   * - 연속 클릭 시에도 타이머를 초기화해 항상 처음부터 재시작
   */
  const triggerShake = () => {
    const btn = activeTab === "personal" ? scentBtnRef.current : memoryBtnRef.current;
    if (!btn) return;

    // 이전 shake가 진행 중이면 타이머 전부 취소하고 transform 초기화 후 재시작
    shakeTimersRef.current.forEach((id) => window.clearTimeout(id));
    shakeTimersRef.current = [];
    btn.style.transform = "";

    // translateX 프레임 시퀀스 (총 ~620ms)
    // 첫 프레임에 큰 폭으로 즉시 이동해 "안 돼!" 느낌을 강조
    // opacity / scale / translateY 변경 없음
    const frames: [number, number][] = [
      [0,    -14],  // ← 즉시 크게 왼쪽
      [60,   +14],  // → 오른쪽
      [120,  -12],  // ← 왼쪽 (감쇠 시작)
      [180,  +12],  // → 오른쪽
      [240,  -9],
      [300,  +9],
      [360,  -6],
      [420,  +6],
      [480,  -3],
      [540,   0],   // 원위치
    ];

    frames.forEach(([delay, x]) => {
      const id = window.setTimeout(() => {
        btn.style.transform = `translateX(${x}px)`;
      }, delay);
      shakeTimersRef.current.push(id);
    });

    // 마지막 프레임 후 인라인 style 제거 → 완전히 원래 상태로 복귀
    const cleanupId = window.setTimeout(() => {
      btn.style.transform = "";
      shakeTimersRef.current = [];
    }, 620);
    shakeTimersRef.current.push(cleanupId);
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
