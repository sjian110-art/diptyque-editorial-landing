import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
}

const COLORS = [
  "rgba(255, 255, 255, ",   // White
  "rgba(240, 240, 240, ",   // Light Gray
  "rgba(245, 242, 235, ",   // Pale Beige
  "rgba(253, 251, 247, "    // Ivory
];

const ScentCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, isMoving: false });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // 1. Hover 감지 글로벌 리스너 (a, button, nav-item 등)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".nav-item") ||
        target.closest(".header-user") ||
        target.closest(".scent-pill") ||
        target.closest(".experience-btn") ||
        target.closest(".header-logo") ||
        target.closest(".footer-logo") ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    // 2. 마우스 움직임 및 위치 로깅
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isMoving = true;
    };

    // 3. 클릭 시 입자 퍼짐(Burst) 연출
    const handleMouseClick = (e: MouseEvent) => {
      const burstCount = 30; // 풍성하게 30개 퍼짐
      const px = e.clientX;
      const py = e.clientY;

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.8; // 부드럽고 가볍게 흩날리는 속도
        const size = Math.random() * 6 + 2; // 2px ~ 8px
        const lifeDuration = Math.random() * 0.4 + 0.8; // 0.8s ~ 1.2s

        particlesRef.current.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2, // 아주 살짝 위로 뜸
          size,
          radiusX: size,
          radiusY: size * (0.5 + Math.random() * 0.5), // 타원형 비틀기 비율
          rotation: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.5 + 0.4, // 투명도 다양화
          life: 1.0,
          decay: 1 / (60 * lifeDuration)
        });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  // Canvas 화면 리사이즈 핸들링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // 60fps 렌더 루프 및 입자 물리 업데이트
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // 1. 화면 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      
      // 2. 마우스 움직임에 따른 풍성한 입자 생성
      if (mouse.isMoving) {
        // 호버 중일 때는 입자를 2.5배 더 많이 뿜음
        const spawnCount = isHovered ? 6 : 3; 
        
        for (let i = 0; i < spawnCount; i++) {
          // 마우스 미세 진동 오프셋을 두어 공기 중에 자연스럽게 흩뿌려짐
          const offsetX = (Math.random() - 0.5) * 8;
          const offsetY = (Math.random() - 0.5) * 8;
          const size = Math.random() * 6 + 2; // 2px ~ 8px
          const lifeDuration = Math.random() * 0.4 + 0.8; // 0.8s ~ 1.2s

          particlesRef.current.push({
            x: mouse.x + offsetX,
            y: mouse.y + offsetY,
            // 흩날림 물리: 기본적으로 뒤따라오는 선과 무작위 흩어짐을 믹스
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.2, // 미세한 공기 상승 부력 효과
            size,
            radiusX: size,
            radiusY: size * (0.5 + Math.random() * 0.5), // 타원형 매칭
            rotation: Math.random() * Math.PI * 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.5 + 0.3,
            life: 1.0,
            decay: 1 / (60 * lifeDuration)
          });
        }
        mouse.isMoving = false;
      }

      // 3. 입자 시뮬레이션 및 그리기
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // 마찰 저항 및 아주 느린 위쪽 부력 연출
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy -= 0.015; // 아주 가벼운 기체 상승 작용

        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        // 생명 주기가 끝나면 소멸
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // 그리기
        ctx.beginPath();
        // 타원형 및 원형 입자 융합 그리기
        ctx.ellipse(p.x, p.y, p.radiusX, p.radiusY, p.rotation, 0, Math.PI * 2);
        
        // 투명도 그라데이션 페이드아웃 결합
        ctx.fillStyle = `${p.color}${p.alpha * p.life})`;
        
        // 가스/향기 같은 은은한 흐림(Gaseous Blur)을 위해 섀도우 블러 가동
        ctx.shadowBlur = p.size * 0.7;
        ctx.shadowColor = `${p.color}${p.alpha * p.life * 0.8})`;
        
        ctx.fill();
      }

      // 섀도우 블러 초기화 (다음 루프 영향 방지)
      ctx.shadowBlur = 0;

      // 4. 중앙 매트 블랙 커서 위치 갱신
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) scale(${isHovered ? 1.15 : 1.0})`;
      }

      // 과도한 입자 생성 시 성능 제약 가드 (최대 200개 유지)
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <>
      {/* 1. 향기 입자가 흩날리는 백그라운드 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 999998, // 중앙 커서 바로 아래 배치
        }}
      />
      {/* 2. 존재감 넘치는 중앙 매트 블랙 커서 원형 */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "13px", // 12~14px 요구사양 중간값
          height: "13px",
          backgroundColor: "#1c1c1c", // 매트 블랙 계열
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999, // 입자를 덮고 항상 최상위에 명확히 노출
          marginTop: "-6.5px", // 정중앙 보정
          marginLeft: "-6.5px",
          willChange: "transform",
          transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      />
    </>
  );
};

export default ScentCursor;
