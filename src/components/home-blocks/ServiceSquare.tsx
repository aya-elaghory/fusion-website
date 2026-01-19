import React, { memo } from "react";

interface ServiceSquareProps {
  category: {
    name: string;
    services?: string[];
    subcategories?: { name: string; services: string[] }[];
    // bgImage?: string; // No need for this!
  };
  onClick: () => void;
}

const ServiceSquare: React.FC<ServiceSquareProps> = memo(
  ({ category, onClick }) => (
    <div
      className="
        w-full max-w-xs h-40
        bg-white
        p-4
        flex items-center justify-center text-center
        border border-gray-200
        hover:bg-green-50 hover:border-green-500
        transition-colors
        cursor-pointer
        relative
        overflow-hidden
        mx-auto
        sm:max-w-sm md:max-w-xs
      "
      onClick={onClick}
    >
      <span className="relative text-sm sm:text-base font-medium text-gray-900 text-center z-10 truncate">
        {category.name}
      </span>
    </div>
  )
);

export default ServiceSquare;
