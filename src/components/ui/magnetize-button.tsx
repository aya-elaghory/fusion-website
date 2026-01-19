import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState } from "react";

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  attractRadius?: number;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  particleColor?: string; // Added for particle color customization
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

function MagnetizeButton({
  className,
  particleCount = 12,
  attractRadius = 50,
  bgColor = "bg-primary", // Use your primary color
  textColor = "text-white", // Adjust based on your design
  hoverBgColor = "hover:bg-primary-hover", // Use your hover color
  particleColor = "bg-primary-light", // Use a lighter shade for particles
  size = "lg",
  rounded = "md",
  children,
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    console.log("Setting up particles with count:", particleCount);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("Interaction started", e.type);
    setIsAttracting(true);
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("Interaction ended", e.type);
    setIsAttracting(false);
  };

  return (
    <button
      className={cn(
        "min-w-40 relative",
        bgColor,
        textColor,
        hoverBgColor,
        "px-6 py-3 text-lg rounded-md",
        "dark:bg-opacity-70 dark:hover:bg-opacity-80",
        "transition-all duration-300",
        className
      )}
      onClick={props.onClick}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      disabled={props.disabled}
    >
      {particles.length > 0 ? (
        particles.map((_, index) => (
          <motion.div
            key={index}
            initial={{ x: particles[index]?.x ?? 0, y: particles[index]?.y ?? 0 }}
            animate={
              isAttracting
                ? { x: 0, y: 0 }
                : { x: particles[index]?.x ?? 0, y: particles[index]?.y ?? 0 }
            }
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
            className={cn(
              "absolute w-1.5 h-1.5 rounded-full",
              particleColor, // Use custom particle color
              "transition-opacity duration-300",
              isAttracting ? "opacity-100" : "opacity-40"
            )}
            style={{ zIndex: 1 }}
          />
        ))
      ) : (
        <span>No particles loaded</span>
      )}
      <span className="relative w-full flex items-center justify-center gap-2 z-10">
        <Magnet
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            textColor, // Ensure the Magnet icon matches the text color
            isAttracting && "scale-110"
          )}
        />
        {children}
      </span>
    </button>
  );
}

export default MagnetizeButton;