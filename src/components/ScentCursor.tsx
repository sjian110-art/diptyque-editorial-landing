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
  rotationSpeed: number;
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

    // 3. 입자 퍼짐(Burst) 연출 - 부드러운 미스트 구름 확장
    const triggerBurst = (px: number, py: number) => {
      const burstCount = 35;
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 0.6; // 더 넓게 퍼지는 팽창 속도
        const size = Math.random() * 35 + 25; // 크기 증가 (25px ~ 60px)
        const lifeDuration = Math.random() * 0.8 + 1.2; // 더 길게 유지 (1.2s ~ 2.0s)

        particlesRef.current.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15, // 은은한 상승
          size,
          radiusX: size,
          radiusY: size * (0.6 + Math.random() * 0.4), // 타원형 비틀기 비율
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03, // 서서히 회전
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.15 + 0.08, // 20~30% 더 진하게
          life: 1.0,
          decay: 1 / (60 * lifeDuration)
        });
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      triggerBurst(e.clientX, e.clientY);
    };

    // 4. Iframe 메시지 수신 핸들러 (Iframe 내 마우스 포인터 정보 전달 수신)
    const handleIframeMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data) return;

      if (data.type === "IFRAME_MOUSEMOVE" || data.type === "IFRAME_CLICK") {
        const iframe = document.getElementById("live-app-iframe");
        if (!iframe) return;

        const rect = iframe.getBoundingClientRect();
        const absoluteX = rect.left + data.clientX;
        const absoluteY = rect.top + data.clientY;

        if (data.type === "IFRAME_MOUSEMOVE") {
          mouseRef.current.x = absoluteX;
          mouseRef.current.y = absoluteY;
          mouseRef.current.isMoving = true;
        } else if (data.type === "IFRAME_CLICK") {
          triggerBurst(absoluteX, absoluteY);
        }
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleMouseClick, { passive: true });
    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("message", handleIframeMessage);
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
      
      // 2. 마우스 움직임에 따른 풍성한 입자 생성 - 부드러운 미스트 흔적 생성
      if (mouse.isMoving) {
        // 호버 중일 때는 입자를 좀 더 많이 생성
        const spawnCount = isHovered ? 4 : 2; 
        
        for (let i = 0; i < spawnCount; i++) {
          // 마우스 주변에 더 넓게 퍼지는 오프셋 설정 (1.5~2배 공간 확장)
          const offsetX = (Math.random() - 0.5) * 35;
          const offsetY = (Math.random() - 0.5) * 35;
          const size = Math.random() * 40 + 25; // 크기 확장 (25px ~ 65px)
          const lifeDuration = Math.random() * 1.0 + 1.5; // 더 천천히 사라지도록 수명 증가 (1.5s ~ 2.5s)

          particlesRef.current.push({
            x: mouse.x + offsetX,
            y: mouse.y + offsetY,
            // 흩날림 물리: 마우스 방향에 더 넓게 퍼지는 속도 부여
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7 - 0.15, // 미세한 공기 상승 부력
            size,
            radiusX: size,
            radiusY: size * (0.6 + Math.random() * 0.4), // 미세한 타원형 비틀기
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02, // 서서히 회전하는 값
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.10 + 0.05, // 20~30% 더 진하게 (5% ~ 15% 투명도)
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
        
        // 공기 저항 및 부드러운 속도 감쇠
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy -= 0.008; // 아주 가벼운 기체 상승 작용

        // 미세하게 유영하는(Wobble) 움직임 추가
        p.rotation += p.rotationSpeed;
        p.vx += Math.sin(p.life * 8 + p.rotation) * 0.05;
        p.vy += Math.cos(p.life * 8 + p.rotation) * 0.05;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        // 생명 주기가 끝나면 소멸
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // 그리기 (Gaussian Blur 느낌의 Radial Gradient 적용)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.radiusX / p.size, p.radiusY / p.size);

        // 중심은 밝고 외곽으로 갈수록 자연스럽게 퍼지는 무경계 그라데이션
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, `${p.color}${p.alpha * p.life})`);
        grad.addColorStop(0.25, `${p.color}${p.alpha * p.life * 0.75})`);
        grad.addColorStop(0.5, `${p.color}${p.alpha * p.life * 0.35})`);
        grad.addColorStop(0.75, `${p.color}${p.alpha * p.life * 0.1})`);
        grad.addColorStop(1, `${p.color}0)`);

        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
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
