import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductCard from "@/components/blocks/ProductCard";
import ConcernsBanner from "@/components/blocks/ConcernsBanner";

// Helper: Get concern icon (imageUrl) for a subconcern from Redux
function getConcernImage(subConcern: string, mainConcerns: any[]) {
  for (const main of mainConcerns) {
    const match = main.subConcerns.find(
      (sub: any) => sub.name.toLowerCase() === subConcern.toLowerCase()
    );
    if (match && match.imageUrl) return match.imageUrl;
  }
  return "/assets/default.jpg";
}

interface RecommendTreatmentsProps {
  toggleCart: () => void;
}

const RecommendTreatments: React.FC<RecommendTreatmentsProps> = ({
  toggleCart,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const products = useSelector(
    (state: RootState) => state.products?.products || []
  );
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns?.concerns || []
  );

  // Extract all selected subConcerns
  const selectedConcerns: string[] = location.state?.concerns || [];
  const selectedSubConcerns = selectedConcerns
    .map((c) => c.split(":")[1]?.trim())
    .filter(Boolean);

  // Banner state/handler for Consistency
  const [activeConcern, setActiveConcern] = React.useState(
    "Select Your Concern"
  );
  const handleBannerClick = (concernName: string, path: string) => {
    setActiveConcern(concernName);
    navigate(path);
  };

  // Filter products: must have at least one selected subConcern in their 'concerns' array
  const productsToDisplay = products.filter((product) =>
    product.concerns?.some((c) => selectedSubConcerns.includes(c))
  );

  return (
    <div className="min-h-screen lg:mt-16 mt-28">
      {/* Shared Banner */}
      <ConcernsBanner
        mainConcerns={mainConcerns}
        activeConcern={activeConcern}
        onBannerClick={handleBannerClick}
      />

      <div className="lg:pt-20 xmd:pt-16 sm:pt-28 xs:pt-28 pt-44 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Products for your symptoms
          </h1>
          {productsToDisplay.length > 0 ? (
            <div className="space-y-12">
              {productsToDisplay.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageSrc={product.imageUrl}
                  name={product.name}
                  rating={4.5}
                  price={product.price}
                  description={product.description}
                  ingredients={product.ingredients}
                  concerns={product.concerns}
                  learnLink={`/product/${product.name
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                  toggleCart={toggleCart}
                  layout="recommend"
                  addedToCart={cartItems.some((item) => item.id === product.id)}
                  // Custom render for concerns with highlight
                  renderConcerns={() => (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.concerns.map((concern: string, idx: number) => {
                        const isSelected =
                          selectedSubConcerns.includes(concern);
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col items-center transition-all w-[130px]
                                        ${
                                          isSelected
                                            ? "border-2 border-primary bg-primary/10"
                                            : "border border-gray-400 bg-white"
                                        }
                                        divide-y divide-gray-400
                                     `}
                            style={{
                              minWidth: 100,
                              pointerEvents: isSelected ? "auto" : "none",
                            }}
                          >
                            <img
                              src={getConcernImage(concern, mainConcerns)}
                              alt={concern}
                              className="w-full h-[90px] object-cover"
                            />

                            <span
                              className="block w-full px-2 py-2 text-center text-sm font-medium text-gray-700 whitespace-normal break-words leading-tight"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {concern}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mb-6">
              No recommended treatments found for your selected concerns.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendTreatments;
