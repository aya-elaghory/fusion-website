import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCanceled: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled ❌</h1>
      <p className="text-gray-600 mt-2">You can try again anytime.</p>

      <button
        className="mt-6 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
        onClick={() => navigate("/checkout?step=payment")}
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentCanceled;
