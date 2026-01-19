import React from "react";
import { cn } from "@/lib/utils";
import MagnetizeButton from "@/components/ui/magnetize-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useState } from "react";

interface SkinCareGuideProps {
  className?: string;
}

const SkinCareGuide: React.FC<SkinCareGuideProps> = ({ className }) => {
  const features = [
    {
      id: 1,
      title: "Personalize your solution",
      image: "https://picsum.photos/400/600?random=1",
      description:
        "Create a skincare routine tailored to your unique skin type and concerns. Our app analyzes your needs and recommends the perfect products and regimen.",
    },
    {
      id: 2,
      title: "Track your progress",
      image: "https://picsum.photos/400/600?random=2",
      description:
        "Monitor your skin's improvement with regular check-ins and progress photos. See real results and adjust your routine as needed.",
    },
    {
      id: 3,
      title: "Join our inspiring community",
      image: "https://picsum.photos/400/600?random=3",
      description:
        "Connect with others on their skincare journey, share tips, and find motivation in our supportive community forums.",
    },
  ];

  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);

  return (
    <section
      className={cn(
        "relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-background", // Added flex and centering classes
        className
      )}
    >
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"> {/* Changed items-end to items-center */}
          {/* Left Column: Text and Accordion */}
          <div className="flex flex-col space-y-6 items-center md:items-start"> {/* Added items-center */}
            {/* Heading and Subheading */}
            <div className="text-center md:text-left"> {/* Added text-center */}
              <h3 className="text-base font-semibold text-text uppercase">
                Your Skincare Guide
              </h3>
              <h2 className="text-2xl md:text-3xl font-bold text-text">
                The Fusion App
              </h2>
            </div>

            {/* Accordion Feature Section */}
            <div className="w-full max-w-2xl"> {/* Added max width */}
              <Accordion type="single" className="w-full" defaultValue="item-1">
                {features.map((feature) => (
                  <AccordionItem key={feature.id} value={`item-${feature.id}`}>
                    <AccordionTrigger
                      onClick={() => {
                        setActiveImage(feature.image);
                        setActiveTabId(feature.id);
                      }}
                      className="cursor-pointer py-5 !no-underline transition"
                    >
                      <h6
                        className={`text-lg font-semibold ${feature.id === activeTabId
                            ? "text-foreground"
                            : "text-muted-foreground"
                          }`}
                      >
                        {feature.title}
                      </h6>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mt-3 text-muted-foreground text-center md:text-left"> {/* Added text-center */}
                        {feature.description}
                      </p>
                      <div className="mt-4 md:hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="h-full max-h-80 w-full rounded-md object-cover mx-auto" // Added mx-auto
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Download Button */}
            <div className="flex justify-center md:justify-start"> {/* Centered button */}
              <MagnetizeButton
                className="min-w-40"
                bgColor="bg-primary"
                textColor="text-white"
                hoverBgColor="hover:bg-primary-hover"
                particleColor="bg-primary-light"
                size="lg"
                rounded="md"
                particleCount={12}
                attractRadius={50}
                onClick={() => console.log("Download The App clicked!")}
              >
                Download The App
              </MagnetizeButton>
            </div>
          </div>

          {/* Right Column: Larger Image */}
          <div className="flex justify-center"> {/* Simplified to just center */}
            <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-muted">
              <img
                src={activeImage}
                alt="Feature preview"
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinCareGuide;