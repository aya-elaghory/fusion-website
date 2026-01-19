import * as React from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface BannerProps {
  text: string;
  linkTo?: string;
  position?: "top" | "middle" | "bottom";
  className?: string;
}

const Banner: React.FC<BannerProps> = ({
  text,
  linkTo,
  position = "middle",
  className,
}) => {
  const content = (
    <p className="text-sm font-medium max-w-3xl mx-auto pointer-events-none">
      {text}
    </p>
  );

  return (
    <div
      className={cn(
        "relative w-full py-4 bg-secondary text-text text-center transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        {
          "border-b border-primary": position === "top",
          "border-t border-b border-primary": position === "middle",
          "border-t border-primary": position === "bottom",
        },
        className
      )}
    >
      {linkTo ? (
        <Link to={linkTo} className="block">
          {content}
        </Link>
      ) : (
        <div className="block">{content}</div>
      )}
    </div>
  );
};

export default Banner;