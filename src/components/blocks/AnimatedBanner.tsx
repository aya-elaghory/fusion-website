import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface BannerProps {
  banners: Array<{
    imageUrl: string;
    altText: string;
    linkTo: string;
  }>;
  position?: "top" | "middle" | "bottom";
  className?: string;
  height?: string;
}

const AnimatedBanner: React.FC<BannerProps> = ({
  banners,
  position = "middle",
  className,
  height = "50px",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic right-to-left sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-green-900", // Changed to green background
        {
          "border-b border-primary": position === "top",
          "border-t border-b border-primary": position === "middle",
          "border-t border-primary": position === "bottom",
        },
        className
      )}
      style={{ height }}
    >
      {banners.map((banner, index) => (
        <Link
          key={index}
          to={banner.linkTo}
          className={cn(
            "absolute top-0 left-0 w-full h-full block transition-transform duration-1000 ease-in-out",
            {
              "translate-x-0": index === currentIndex, // Current image in view
              "-translate-x-full": index < currentIndex, // Previous image slides left
              "translate-x-full": index > currentIndex, // Next image starts on right
            }
          )}
        >
          <img
            src={banner.imageUrl}
            alt={banner.altText}
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", minHeight: "100%" }}
          />
        </Link>
      ))}
    </div>
  );
};

export default AnimatedBanner;