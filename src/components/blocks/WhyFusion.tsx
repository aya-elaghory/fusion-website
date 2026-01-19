import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface WhyFusionProps {
  className?: string;
}

const WhyFusion: React.FC<WhyFusionProps> = ({ className }) => {
  const features = [
    {
      title: "10X More Potent",
      description: [
        "Freshly compounded ingredients",
        "Personalized solutions",
        "900K+ life-changing transformations",
      ],
      icon: (
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "10X More Affordable",
      description: [
        "Significantly cheaper solutions compared to industry alternatives",
      ],
      icon: (
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "10X More Accessible",
      description: [
        "Online board-certified dermatologists",
        "60-Day Consultation",
        "Delivered to your door",
      ],
      icon: (
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 bg-background",
        className
      )}
    >
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text text-center mb-8 md:mb-12">
        Why Fusion Over Alternatives?
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-3 md:space-y-4"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/20">
              {feature.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-text">
              {feature.title}
            </h3>
            <ul className="text-text text-xs sm:text-sm space-y-1 md:space-y-2">
              {feature.description.map((desc, descIndex) => (
                <li key={descIndex}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="flex w-full items-center justify-center py-8 md:py-12 mb-8 md:mb-12">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[300px] max-w-3xl md:max-w-5xl mx-auto text-left border-collapse">
            <thead>
              <tr>
                <th className="text-text font-medium text-xs sm:text-sm md:text-base pb-3 md:pb-4"></th>
                <th className="text-text font-semibold text-xs sm:text-sm md:text-base pb-3 md:pb-4 text-center">
                  Fusion
                </th>
                <th className="text-text font-semibold text-xs sm:text-sm md:text-base pb-3 md:pb-4 text-center">
                  Traditional
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-text/20">
                <td className="text-text font-medium text-xs sm:text-sm md:text-base py-3 md:py-4 pr-2">
                  Online Visit
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  $20
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  $200+
                </td>
              </tr>
              <tr className="border-t border-text/20">
                <td className="text-text font-medium text-xs sm:text-sm md:text-base py-3 md:py-4 pr-2">
                  Solution
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  $50-$110
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  $400-$1000+
                </td>
              </tr>
              <tr className="border-t border-text/20">
                <td className="text-text font-medium text-xs sm:text-sm md:text-base py-3 md:py-4 pr-2">
                  60-Day Consultation
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  Free
                </td>
                <td className="text-text text-xs sm:text-sm md:text-base py-3 md:py-4 text-center">
                  None
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="text-center space-y-3 md:space-y-4 mb-6 md:mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-text">
          60-Day Result Guarantee
        </h3>
        <p className="text-text text-sm sm:text-base max-w-xl mx-auto px-4">
          At Fusion, we believe in the effectiveness of our solutions. That’s
          why we offer a 60-Day Result Guarantee on select solutions!
        </p>
      </div>

      {/* Learn More Button (normal styled link) */}
      <div className="flex justify-center">
        <Link
          to="/treatments"
          className={cn(
            "inline-flex items-center justify-center min-w-40 px-6 py-3",
            "text-base font-semibold",
            "bg-primary text-white hover:bg-green-600",
            "shadow-md hover:shadow-lg",
            "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            "active:scale-[0.98]"
          )}
          aria-label="Learn more about treatments"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default WhyFusion;
