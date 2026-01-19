import React from "react";

interface ConcernsBannerProps {
  mainConcerns: { main_concern_name: string }[];
  activeConcern: string;
  onBannerClick: (concernName: string, path: string) => void;
}

const ConcernsBanner: React.FC<ConcernsBannerProps> = ({
  mainConcerns,
  activeConcern,
  onBannerClick,
}) => {
  // Prepare navigation links: Select Your Concern + all main concerns
  const navigation = [
    { name: "Select Your Concern", path: "/concerns" },
    ...mainConcerns.map((main) => ({
      name: main.main_concern_name,
      path: `/${main.main_concern_name.toLowerCase().replace(/ /g, "-")}`,
    })),
  ];

  return (
    <div className="bg-white text-gray-900 py-1 fixed left-0 right-0 z-10 flex items-center">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-center flex-wrap gap-1">
          {navigation.map((concern) => (
            <button
              key={concern.name}
              onClick={() => onBannerClick(concern.name, concern.path)}
              className={`px-2 py-4 text-s font-small transition-colors
                border border-transparent rounded-none
                ${
                  activeConcern === concern.name
                    ? "text-white bg-primary"
                    : concern.name === "Select Your Concern"
                    ? "text-green-700 hover:bg-green-100"
                    : "hover:bg-green-100 text-green-700"
                }`}
              style={{ minWidth: 88, lineHeight: "1.1" }}
            >
              {concern.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConcernsBanner;
