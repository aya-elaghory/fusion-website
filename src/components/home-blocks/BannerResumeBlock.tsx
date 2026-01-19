import React from "react";
import CartModificationModal from "@/components/blocks/CartModificationModal";

const BannerResumeBlock = ({
  showBanner,
  isModalOpen,
  setIsModalOpen,
  savedCartItems,
  handleConfirm,
}: any) => (
  <>
    {showBanner && (
      <div
        className="w-full max-w-2xl mx-auto mt-20 md:mt-5 bg-white p-2 shadow-md cursor-pointer text-center border border-r-8 border-green-800"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="text-green-800 font-medium text-lg">
          Continue Your Doctor Visit
        </p>
      </div>
    )}
    {isModalOpen && (
      <CartModificationModal
        cartItems={savedCartItems}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    )}
  </>
);

export default BannerResumeBlock;
