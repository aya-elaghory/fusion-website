import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ButtonProps {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  bgColor?: string;
  textColor?: string;
  linkTo?: string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  text,
  size = "md",
  bgColor = "bg-primary",
  textColor = "text-white",
  linkTo,
  position = "static",
  top,
  left,
  right,
  bottom,
  className,
  onClick,
  disabled = false,
  rounded = "md",
  shadow = "none",
  ...rest // Add rest props to capture additional event handlers
}) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const positionStyles = (
    pos: string,
    t?: string,
    l?: string,
    r?: string,
    b?: string
  ) => cn(pos, t, l, r, b);

  const baseStyles = cn(
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
    sizeStyles[size],
    bgColor,
    textColor,
    roundedStyles[rounded],
    shadowStyles[shadow],
    disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90",
    positionStyles(position, top, left, right, bottom),
    className
  );

  if (linkTo && !disabled) {
    return (
      <Link to={linkTo} className={baseStyles} onClick={onClick} {...rest}>
        {text}
      </Link>
    );
  }

  return (
    <button
      className={baseStyles}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...rest} // Pass all additional props (e.g., onMouseEnter, onMouseLeave)
    >
      {text}
    </button>
  );
};

export default Button;