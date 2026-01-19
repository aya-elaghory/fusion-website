import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/slices/cartSlice";
import { updateProfile } from "@/slices/profileSlice";

const PaymentSuccess: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
    dispatch(updateProfile({ incompleteVisit: false } as any));
  }, [dispatch]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-green-700">
        Payment Successful ✅
      </h1>
      <p className="text-gray-600 mt-2">
        Thank you! Your order has been placed.
      </p>
    </div>
  );
};

export default PaymentSuccess;
