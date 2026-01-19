import React from "react";

const fakeCategories = Array.from({ length: 4 });
const fakeServices = Array.from({ length: 6 });

const ServiceSquaresSkeleton: React.FC<{ showBanner?: boolean }> = ({ showBanner }) => {
  const sectionMargin = showBanner ? "mt-0" : "mt-24 lg:mt-12";

  return (
    <section
      className={`relative z-10 max-w-full mx-auto px-4 py-6 sm:py-8 md:py-10 ${sectionMargin}`}
      aria-label="Loading service categories"
    >
      <h2
        className="font-times text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-black tracking-tight"
        style={{ letterSpacing: "0.02em" }}
      >
        Discover Our Services
      </h2>

      {/* --- MOBILE skeleton layout --- */}
      <div className="flex flex-col gap-0.5 md:hidden">
        <div className="w-full h-64 bg-green-50 border border-gray-200 shadow-sm flex items-center justify-center">
          <div className="w-full grid gap-1 place-items-center grid-cols-3">
            {fakeServices.map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-full mb-2" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0.5 mt-2">
          {fakeCategories.map((_, i) => (
            <div
              key={i}
              className="w-full max-w-xs h-40 p-4 flex items-center justify-center border border-gray-200 bg-gray-100 animate-pulse mx-auto"
            >
              <div className="w-20 h-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* --- DESKTOP skeleton layout --- */}
      <div className="hidden md:grid grid-cols-3 gap-0.5">
        <div className="col-span-2 bg-green-50 border border-gray-200 shadow-sm flex items-center justify-center w-full h-[322px]">
          <div className="w-full grid gap-6 place-items-center grid-cols-3">
            {fakeServices.map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid grid-cols-2 gap-0.5">
            {fakeCategories.map((_, i) => (
              <div
                key={i}
                className="w-full max-w-xs h-40 p-4 flex items-center justify-center border border-gray-200 bg-gray-100 animate-pulse mx-auto"
              >
                <div className="w-24 h-6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSquaresSkeleton;
