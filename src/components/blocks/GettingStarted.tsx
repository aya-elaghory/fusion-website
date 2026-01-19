import React from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface GettingStartedProps {
  className?: string;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ className }) => {
  const steps = [
    {
      number: 1,
      title: "Complete a 3-Min Online Visit",
      description:
        "A designated solution expert will review the photos of your concern to create your custom solution.",
      imageUrl: "assets/about_3.jpg",
    },
    {
      number: 2,
      title: "Your Solution Is Freshly Compounded",
      description:
        "Highly concentrated ingredients are freshly compounded together shortly before the product is shipped to you, ensuring maximum potency and efficacy.",
      imageUrl: "assets/about_4.jpg",
    },
    {
      number: 3,
      title: "Your Custom Solution is Shipped to You",
      description:
        "Your solution is delivered directly to your door, so you can see results without stepping foot in a dermatology office or dealing with long pharmacy lines.",
      imageUrl: "assets/about_1.jpg",
    },
  ];

  return (
    <section
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 py-12 bg-background",
        className
      )}
    >
      {/* Heading and Subheading */}
      <div className="text-center mb-12">
        <h3 className="text-lg font-semibold text-text uppercase">
          3 Simple Steps
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold text-text">
          Getting Started Is Easy
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center text-center p-6"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-48 object-cover mb-4"
            />
            <div className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full mb-4">
              <span className="text-xl font-bold">{step.number}</span>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              {step.title}
            </h3>
            <p className="text-text text-sm">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Shop All Products Button (regular button styled like your reference) */}
      <div className="flex justify-center">
        <Link
          to="/treatments"
          className={cn(
            // Base layout & sizing
            "inline-flex items-center justify-center min-w-40 px-6 py-3",
            // Typography
            "text-base font-semibold",
            // Colors (match your former MagnetizeButton props)
            "bg-primary text-white hover:bg-green-600",
            // Rounding & shadows
            "shadow-md hover:shadow-lg",
            // Transitions & focus
            "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            // Optional subtle transform on hover for a premium feel
            "active:scale-[0.98]"
          )}
          aria-label="Shop all products"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default GettingStarted;
