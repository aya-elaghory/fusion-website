import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ConcernsPage: React.FC = () => {
  const navigate = useNavigate();
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns.concerns || []
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedSubConcerns, setSelectedSubConcerns] = useState<{
    [category: string]: string[];
  }>({});

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSubConcernClick = (category: string, subConcernName: string) => {
    setSelectedSubConcerns((prev) => {
      const currentSelections = prev[category] || [];
      if (currentSelections.includes(subConcernName)) {
        return {
          ...prev,
          [category]: currentSelections.filter(
            (name) => name !== subConcernName
          ),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentSelections, subConcernName],
        };
      }
    });
  };

  const getSelectedCount = (category: string) => {
    return (selectedSubConcerns[category] || []).length;
  };

  const totalSelected = Object.values(selectedSubConcerns).reduce(
    (sum, selections) => sum + selections.length,
    0
  );

  const isButtonDisabled = totalSelected === 0;

  const handleNavigateToTreatments = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      const selected = Object.entries(selectedSubConcerns).flatMap(
        ([category, subConcerns]) =>
          subConcerns.map((subConcern) => `${category}:${subConcern}`)
      );
      navigate("/recommend", { state: { concerns: selected } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Select Your Concerns
        </h1>
        <div className="space-y-4">
          {mainConcerns.map((concern) => (
            <div
              key={concern.main_concern_name}
              className="border-b border-gray-200"
            >
              <button
                type="button"
                className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
                onClick={() => toggleExpand(concern.main_concern_name)}
                tabIndex={0}
                aria-expanded={expandedCategories.has(
                  concern.main_concern_name
                )}
              >
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {concern.main_concern_name}
                  </h2>
                  {getSelectedCount(concern.main_concern_name) > 0 && (
                    <span className="text-sm text-green-600">
                      ({getSelectedCount(concern.main_concern_name)} selected)
                    </span>
                  )}
                </div>
                {expandedCategories.has(concern.main_concern_name) ? (
                  <ChevronUp className="h-6 w-6 text-gray-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-600" />
                )}
              </button>
              {expandedCategories.has(concern.main_concern_name) && (
                <div className="pb-4 pl-2">
                  <div className="flex flex-wrap gap-4">
                    {concern.subConcerns.map((subConcern) => {
                      const isSelected = (
                        selectedSubConcerns[concern.main_concern_name] || []
                      ).includes(subConcern.name);
                      return (
                        <button
                          key={subConcern.name}
                          type="button"
                          className={`
                            flex flex-col items-center cursor-pointer focus:outline-none
                            ${
                              isSelected
                                ? "bg-green-100 border-green-600"
                                : "hover:bg-green-100"
                            }
                            mb-2 rounded-none border w-[150px] h-[140px] transition
                          `}
                          onClick={() =>
                            handleSubConcernClick(
                              concern.main_concern_name,
                              subConcern.name
                            )
                          }
                        >
                          <div
                            className={`border rounded-none overflow-hidden w-[150px] h-[95px] flex-shrink-0
                                       ${
                                         isSelected
                                           ? "border-green-600"
                                           : "border-gray-200"
                                       }`}
                          >
                            <img
                              src={subConcern.imageUrl || "/assets/default.jpg"}
                              alt={subConcern.name}
                              className="w-[150px] h-[95px] object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 flex items-center justify-center w-full">
                            <span className="block text-sm text-gray-700 text-center whitespace-normal break-words px-2 max-w-[150px]">
                              {subConcern.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleNavigateToTreatments}
            disabled={isButtonDisabled}
            aria-label="View treatments for selected concerns"
            className={`
              w-full max-w-md text-base py-3 flex items-center justify-center
              border border-transparent transition-colors duration-150
              ${
                isButtonDisabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
              }
              rounded-none
            `}
          >
            {isButtonDisabled ? (
              <>
                <svg
                  className="inline-block w-6 h-6 mr-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Select Concerns
              </>
            ) : (
              "View Treatments"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConcernsPage;
