import React, { useRef, useEffect, useState } from "react";

const logos = [
  "/assets/logo1.png",
  "/assets/logo2.png",
  "/assets/logo4.png",
  "/assets/logo4.png",
  "/assets/logo2.png",
  "/assets/logo1.png",
  "/assets/logo1.png",
  "/assets/logo2.png",
  "/assets/logo4.png",
];

const BASE_LOGO_HEIGHT = 64;
const BASE_LOGO_GAP = 48;
const MIN_LOGO_HEIGHT = 40;
const MIN_LOGO_GAP = 12;

function getResponsiveSizes(containerWidth: number, count: number) {
  const maxLogoWidth = containerWidth / count - MIN_LOGO_GAP;
  const logoHeight = Math.max(
    MIN_LOGO_HEIGHT,
    Math.min(BASE_LOGO_HEIGHT, maxLogoWidth)
  );
  const logoGap = Math.max(
    MIN_LOGO_GAP,
    Math.min(BASE_LOGO_GAP, (containerWidth - logoHeight * count) / (count + 1))
  );
  return { logoHeight, logoGap };
}

const InfiniteLogosBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const pos1 = useRef(0);
  const pos2 = useRef(0);
  const rowWidth = useRef(0);

  const [paused, setPaused] = useState(false);
  const [sizes, setSizes] = useState({
    logoHeight: BASE_LOGO_HEIGHT,
    logoGap: BASE_LOGO_GAP,
    bannerHeight: BASE_LOGO_HEIGHT + 32,
  });

  // Responsive size calculation
  useEffect(() => {
    function updateSizes() {
      const width =
        containerRef.current?.offsetWidth || window.innerWidth || 360;
      const { logoHeight, logoGap } = getResponsiveSizes(width, logos.length);
      setSizes({
        logoHeight,
        logoGap,
        bannerHeight: logoHeight + 32,
      });
      // Mark that row width must be recalculated
      rowWidth.current = 0;
    }
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Only initialize positions on mount or when size changes
  useEffect(() => {
    if (row1Ref.current && row2Ref.current) {
      pos1.current = 0;
      rowWidth.current = row1Ref.current.offsetWidth;
      pos2.current = rowWidth.current;
      row1Ref.current.style.transform = `translateX(${pos1.current}px) translateY(-50%)`;
      row2Ref.current.style.transform = `translateX(${pos2.current}px) translateY(-50%)`;
    }
  }, [sizes.logoHeight, sizes.logoGap]);

  // Animation loop, ONLY cares about paused
  useEffect(() => {
    let frame: number;
    let speed = 1.2;
    let animating = true;

    function animate() {
      if (!row1Ref.current || !row2Ref.current) return;
      if (!paused) {
        if (!rowWidth.current) rowWidth.current = row1Ref.current.offsetWidth;
        pos1.current -= speed;
        pos2.current -= speed;

        if (pos1.current <= -rowWidth.current)
          pos1.current = pos2.current + rowWidth.current;
        if (pos2.current <= -rowWidth.current)
          pos2.current = pos1.current + rowWidth.current;

        row1Ref.current.style.transform = `translateX(${pos1.current}px) translateY(-50%)`;
        row2Ref.current.style.transform = `translateX(${pos2.current}px) translateY(-50%)`;
      }
      if (animating) frame = requestAnimationFrame(animate);
    }

    animating = true;
    frame = requestAnimationFrame(animate);

    return () => {
      animating = false;
      cancelAnimationFrame(frame);
    };
  }, [paused]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        width: "100%",
        background: "#fff",
        borderTop: "2px solid #111",
        borderBottom: "2px solid #111",
        position: "relative",
        padding: "16px 0",
        height: sizes.bannerHeight,
        cursor: "pointer",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={row1Ref}
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          top: "50%",
          gap: `${sizes.logoGap}px`,
          transform: "translateY(-50%)",
          width: "max-content",
        }}
      >
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`Logo ${i + 1}`}
            style={{
              height: sizes.logoHeight,
              maxWidth: sizes.logoHeight * 2,
              width: "auto",
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
              background: "none",
              objectFit: "contain",
            }}
            draggable={false}
          />
        ))}
      </div>
      <div
        ref={row2Ref}
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          top: "50%",
          gap: `${sizes.logoGap}px`,
          transform: "translateY(-50%)",
          width: "max-content",
        }}
      >
        {logos.map((logo, i) => (
          <img
            key={logos.length + i}
            src={logo}
            alt={`Logo ${i + 1}`}
            style={{
              height: sizes.logoHeight,
              maxWidth: sizes.logoHeight * 2,
              width: "auto",
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
              background: "none",
              objectFit: "contain",
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteLogosBanner;
