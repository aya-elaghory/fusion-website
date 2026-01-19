import React from "react";

interface HomeActionButtonsProps {
  handleAllProductsClick: () => void;
  handleAskQuestionsClick: () => void;
}

const HomeActionButtons: React.FC<HomeActionButtonsProps> = ({
  handleAllProductsClick,
  handleAskQuestionsClick,
}) => (
  <>
    <div className="mt-6">
      <button
        className="w-full max-w-md h-12 bg-green-900 flex items-center justify-center text-center hover:bg-green-600 cursor-pointer relative overflow-hidden mx-auto"
        onClick={handleAllProductsClick}
      >
        <span className="text-white font-medium text-center truncate">
          Shop All Products
        </span>
      </button>
    </div>
    <div className="mt-4 mb-6">
      <button
        className="w-full max-w-md h-12 bg-white border-2 border-green-800 flex items-center justify-center text-center hover:bg-gray-100 cursor-pointer relative overflow-hidden mx-auto"
        onClick={handleAskQuestionsClick}
      >
        <span className="text-black font-medium text-center truncate">
          Ask Questions
        </span>
      </button>
    </div>
  </>
);

export default HomeActionButtons;
