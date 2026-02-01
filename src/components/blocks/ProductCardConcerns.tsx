import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  addToCart as addToCartLocal,
  addToCartThunk,
  fetchCart,
  type PurchaseOption,
} from "@/slices/cartSlice";
import { concernMapUrl } from "@/data/products";
import ingredientsLogo from "/assets/ingredients_logo.png";

interface ProductCardConcernsProps {
  id: string; // expected: Prisma Product.id (UUID)
  imageSrc: string;
  topIcon?: string;
  sideIcon?: string;
  name: string;
  rating: number;
  price?: number;
  description: string;
  ingredients: { name: string; percentage: string }[];
  learnLink?: string;
  className?: string;
  toggleCart: () => void;
  concerns?: string[];
}

const ProductCardConcerns: React.FC<ProductCardConcernsProps> = ({
  id,
  imageSrc,
  topIcon = "60-DAY SUPPLY",
  sideIcon,
  name,
  rating,
  price,
  description,
  ingredients = [],
  learnLink,
  className = "",
  toggleCart,
  concerns = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const isInCart = cartItems.some(
    (item) =>
      item.id === id && (item.purchaseOption ?? "ONE_TIME") === "ONE_TIME",
  );

  const formattedIngredients =
    ingredients.length > 3
      ? `${ingredients
          .slice(0, 3)
          .map((ing) => ing.name)
          .join(", ")} & more`
      : ingredients.map((ing) => ing.name).join(", ");

  const handleAddToCart = async () => {
    if (isInCart) return;

    setError(null);

    const purchaseOption: PurchaseOption = "ONE_TIME";

    // ✅ Add locally so UI updates immediately
    dispatch(
      addToCartLocal({
        id,
        imageSrc,
        name,
        price: price != null ? `$${Number(price).toFixed(2)}` : "$0.00",
        quantity: 1,
        purchaseOption,
      }),
    );

    toggleCart();

    // ✅ If logged in, also add to backend
    if (isAuthenticated) {
      try {
        await dispatch(
          addToCartThunk({
            productId: id,
            quantity: 1,
            purchaseOption,
          }),
        ).unwrap();

        // ✅ Pull server cart back (keeps UI in sync with backend)
        await dispatch(fetchCart()).unwrap();
      } catch (e: any) {
        setError(e?.message || "Failed to add item to server cart.");
      }
    }
  };

  return (
    <div
      className={`bg-green-50 border shadow-sm w-full max-w-[500px] flex flex-col ${className}`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-[474px] object-cover rounded-t-lg"
        />

        {topIcon && (
          <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded shadow-sm">
            {topIcon}
          </div>
        )}

        {sideIcon && (
          <div className="absolute bottom-2 right-2">
            <img
              src={sideIcon}
              alt="Side Icon"
              className="w-10 h-10 object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center">
            <span className="text-green-600">★</span>
            <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
          </div>
        </div>

        <p className="text-gray-600 mt-3 text-base">{description}</p>

        <div className="mt-3 ingredient-badge">
          <img src={ingredientsLogo} alt="Ingredients Icon" />
          <p>{formattedIngredients || "No ingredients listed"}</p>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 flex items-center space-x-3">
          {learnLink && (
            <button
              onClick={() => navigate(learnLink)}
              className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-base font-medium"
            >
              Learn More
            </button>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`p-2 rounded-full border ${
              isInCart
                ? "bg-white text-green-600 border-gray-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-200"
            } transition-colors`}
            aria-label={isInCart ? "Added to cart" : "Add to cart"}
            title={isInCart ? "Already in cart" : "Add to cart"}
          >
            {isInCart ? "✓" : "+"}
          </button>
        </div>

        {concerns.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-900">
              Treats the following concerns:
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              {concerns.map((concern) => (
                <div key={concern} className="flex flex-col items-center">
                  <div className="w-16 h-14 border rounded-md overflow-hidden">
                    <img
                      src={
                        concernMapUrl.get(concern) ||
                        "https://via.placeholder.com/50"
                      }
                      alt={concern}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-700 text-center mt-1">
                    {concern}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardConcerns;
