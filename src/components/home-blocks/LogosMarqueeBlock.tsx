import React from "react";

const LogosMarqueeBlock = ({
  logoSet,
  logoRef,
  wrapperRef,
}: {
  logoSet: string[];
  logoRef: React.RefObject<HTMLImageElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className="relative w-full overflow-hidden border-b-2 border-t-2 border-border bg-bw text-text font-base group">
    <div
      ref={wrapperRef}
      className="animate-marquee whitespace-nowrap py-4 group-hover:animation-paused"
      style={{ display: "inline-block" }}
    >
      {logoSet.map((item, index) => (
        <img
          key={index}
          ref={index === 0 ? logoRef : null}
          src={item}
          alt={`Logo ${index + 1}`}
          className="h-10 sm:h-12 w-auto object-contain inline-block mx-2"
          loading="lazy"
        />
      ))}
      {logoSet.map((item, index) => (
        <img
          key={`duplicate-${index}`}
          src={item}
          alt={`Logo ${index + 1}`}
          className="h-10 sm:h-12 w-auto object-contain inline-block mx-2"
          loading="lazy"
        />
      ))}
    </div>
  </div>
);

export default LogosMarqueeBlock;
