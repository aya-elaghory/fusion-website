import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { addToCartThunk, fetchCart } from "@/slices/cartSlice";
import ingredientsLogo from "/assets/ingredients_logo.png";

interface ProductCardProps {
  id: string; // ✅ Prisma product.id
  imageSrc: string;
  name: string;
  rating: number;
  description: string;
  ingredients: string | { name: string; percentage?: string }[];
  concerns?: string[];
  price?: number; // dollars/month (UI)
  topIcon?: string;
  sideIcon?: string;
  learnLink?: string;
  orderLink?: string;
  cartLogo?: string;
  toggleCart: () => void;
  layout: "treatments" | "concerns" | "recommend";
  addedToCart?: boolean;
  className?: string;
  renderConcerns?: () => React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageSrc,
  name,
  rating,
  description,
  ingredients,
  concerns = [],
  price,
  topIcon,
  sideIcon,
  learnLink,
  orderLink,
  toggleCart,
  layout,
  addedToCart,
  className = "",
  renderConcerns,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);

  const isInCart =
    addedToCart !== undefined ? addedToCart : cartItems.some((item) => item.id === id);

  const allSubConcerns = useSelector(
    (state: RootState) =>
      state.mainConcerns.concerns?.flatMap((main) => main.subConcerns) || []
  );

  const getConcernImage = (concern: string) => {
    const found = allSubConcerns.find(
      (sub: any) => (sub?.name || "").toLowerCase() === concern.toLowerCase()
    );
    return found?.imageUrl || "/assets/default.jpg";
  };

  const formatIngredients = () => {
    if (typeof ingredients === "string") return ingredients;
    const names = ingredients.map((ing) => ing.name).filter(Boolean);
    return names.length > 3 ? `${names.slice(0, 3).join(", ")} & more` : names.join(", ");
  };

  const handleAddToCart = async () => {
    if (isInCart) return;

    try {
      // ✅ Send to backend
      await dispatch(
        addToCartThunk({
          productId: id,
          quantity: 1,
          purchaseOption: "ONE_TIME",
        })
      ).unwrap();

      // ✅ Refresh cart from backend so UI updates
      await dispatch(fetchCart()).unwrap();

      toggleCart();
    } catch (e) {
      console.error("Add to cart failed:", e);
    }
  };

  const layoutStyles = {
    treatments: "bg-green-50 w-full max-w-sm mx-auto flex flex-col border h-auto",
    concerns:
      "bg-green-50 border shadow-sm w-full max-w-[500px] flex flex-col min-h-[600px]",
    recommend: "p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full",
  } as const;

  const imageStyles = {
    treatments: "w-full h-64 object-cover",
    concerns: "w-full h-[300px] object-cover",
    recommend: "w-full h-full object-cover rounded-br-[50px]",
  } as const;

  const renderButtons = () => {
    if (layout === "treatments") {
      return (
        <div className="pt-2 flex items-center space-x-2">
          {learnLink && (
            <button
              onClick={() => navigate(learnLink)}
              className="text-sm font-bold underline text-gray-900 hover:text-gray-600"
            >
              Learn
            </button>
          )}
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className="text-sm font-bold underline text-gray-900 hover:text-gray-600 disabled:opacity-60"
          >
            {isInCart ? "In Cart" : "Order"}
          </button>
        </div>
      );
    }

    return (
      <div className="mt-2 flex items-center space-x-3">
        {learnLink && (
          <button
            onClick={() => navigate(learnLink)}
            className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors text-base font-medium"
          >
            Learn More
          </button>
        )}
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className="text-sm font-bold underline text-gray-900 hover:text-gray-600 disabled:opacity-60"
        >
          {isInCart ? "In Cart" : "Order"}
        </button>
      </div>
    );
  };

  return (
    <div className={`${layoutStyles[layout]} ${className}`}>
      <div className="relative flex-shrink-0">
        <img src={imageSrc} alt={name} className={imageStyles[layout]} />
        {topIcon && (
          <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded shadow-sm">
            {topIcon}
          </div>
        )}
        {sideIcon && (
          <div className="absolute bottom-2 right-2">
            <img src={sideIcon} alt="Side Icon" className="w-10 h-10 object-contain" />
          </div>
        )}
      </div>

      {layout === "recommend" && renderConcerns ? (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-[32px]">{name}</h3>
            <div className="flex items-center">
              <span className="text-green-600">★</span>
              <span className="ml-1 text-lg text-gray-600">
                {rating}/5
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-base">{description}</p>

          <div className="mt-2 flex items-center space-x-2 bg-white p-1">
            <img src={ingredientsLogo} alt="Ingredients" className="w-5 h-5 object-contain" />
            <p className="text-sm text-gray-700 font-bold text-[16px]">{formatIngredients()}</p>
          </div>

          <div className="flex space-x-3 mt-6">
            {learnLink && (
              <button
                onClick={() => navigate(learnLink)}
                className="flex-1 bg-primary text-white px-4 py-2 hover:bg-green-800 transition-colors border border-gray-800 text-base font-medium"
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
            >
              🛒
            </button>
          </div>

          {renderConcerns()}
        </div>
      ) : (
        <div className="flex-grow grid grid-rows-[auto,auto,auto,1fr] gap-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className={`font-semibold text-gray-900 ${
                  layout === "treatments" ? "text-md" : "text-lg"
                }`}
              >
                {name}
              </h3>
              {price != null && layout === "treatments" && (
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  {`$${price.toFixed(2)}/month`}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <span className="text-green-600">★</span>
              <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
            </div>
          </div>

          <div>
            <p className={`text-gray-600 ${layout === "treatments" ? "text-sm" : "text-base"}`}>
              {description}
            </p>
            <div className="mt-2 flex items-center space-x-2 bg-white p-1">
              <img src={ingredientsLogo} alt="Ingredients" className="w-5 h-5 object-contain" />
              <p className="text-sm text-gray-700 font-bold">{formatIngredients()}</p>
            </div>
          </div>

          <div>{renderButtons()}</div>

          <div>
            {concerns.length > 0 && layout === "concerns" && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-900 text-center">
                  Treats the following concerns:
                </p>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  {concerns.map((concern) => (
                    <div key={concern} className="flex flex-col border bg-white divide-y divide-gray-200">
                      <div className="w-full h-[70px] overflow-hidden">
                        <img
                          src={getConcernImage(concern)}
                          alt={concern}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className="block w-full px-2 py-2 text-center text-xs font-medium text-gray-700 whitespace-normal break-words leading-tight"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {concern}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
