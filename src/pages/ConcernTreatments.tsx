import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ProductCard from "@/components/blocks/ProductCard";

interface ConcernTreatmentsProps {
  toggleCart: () => void;
}

const ConcernTreatments: React.FC<ConcernTreatmentsProps> = ({
  toggleCart,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns.concerns || []
  );
  const products = useSelector(
    (state: RootState) => state.products.products || []
  );

  // Read main concern from URL (e.g. /dark-spots)
  const pathConcern = location.pathname.split("/")[1];

  const initialConcern =
    mainConcerns.find(
      (main) =>
        main.main_concern_name.toLowerCase().replace(/ /g, "-") === pathConcern
    )?.main_concern_name ||
    mainConcerns[0]?.main_concern_name ||
    "";

  const [selectedMainConcern, setSelectedMainConcern] =
    useState<string>(initialConcern);

  // Update selected concern if URL changes or data arrives
  useEffect(() => {
    const urlConcern =
      mainConcerns.find(
        (main) =>
          main.main_concern_name.toLowerCase().replace(/ /g, "-") ===
          pathConcern
      )?.main_concern_name ||
      mainConcerns[0]?.main_concern_name ||
      "";
    setSelectedMainConcern(urlConcern);
  }, [location.pathname, mainConcerns, pathConcern]);

  // The selected main concern object
  const selectedMain = useMemo(
    () => mainConcerns.find((m) => m.main_concern_name === selectedMainConcern),
    [mainConcerns, selectedMainConcern]
  );

  // Build the flat list of products for ALL subconcerns under the selected main concern
  const allProductsForMain = useMemo(() => {
    if (!selectedMain) return [];
    const subNames = new Set(
      (selectedMain.subConcerns || []).map((s: any) => s.name)
    );

    // Filter products that match ANY subconcern name
    const filtered = products.filter(
      (p: any) =>
        Array.isArray(p.concerns) &&
        p.concerns.some((c: string) => subNames.has(c))
    );

    // Deduplicate by product id (in case a product matches multiple subconcerns)
    const map = new Map<string, any>();
    for (const p of filtered) {
      map.set(p.id, p);
    }
    return Array.from(map.values());
  }, [selectedMain, products]);

  const handleMainConcernClick = (mainConcern: string) => {
    setSelectedMainConcern(mainConcern);
    navigate(`/${mainConcern.toLowerCase().replace(/ /g, "-")}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedMainConcern && (
          <>
            {/* Main concern selector (responsive) */}
            <div className="flex flex-wrap justify-center mt-20 xs:mt-20 sm:mt-20 lg:mt-8 mb-8 gap-2 sm:gap-4 pb-2 border-b border-gray-200">
              {mainConcerns.map((main) => (
                <button
                  key={main.main_concern_name}
                  onClick={() => handleMainConcernClick(main.main_concern_name)}
                  className={`flex flex-col items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                    selectedMainConcern === main.main_concern_name
                      ? "text-black bg-green-100"
                      : "text-gray-600 hover:bg-green-100"
                  } whitespace-nowrap`}
                  style={{ minWidth: "115px", maxWidth: "130px" }}
                >
                  <img
                    src={
                      main.subConcerns?.[0]?.imageUrl ||
                      "https://via.placeholder.com/50"
                    }
                    alt={main.main_concern_name}
                    className="w-14 h-9 sm:w-16 sm:h-14 object-cover mb-1 sm:mb-2"
                  />
                  <span className="text-xs sm:text-sm text-center">
                    {main.main_concern_name}
                  </span>
                </button>
              ))}
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
              Prescription {selectedMainConcern} Treatments
            </h1>

            {/* All products back-to-back */}
            {allProductsForMain.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr">
                {allProductsForMain.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imageSrc={product.imageUrl}
                    name={product.name}
                    rating={product.rating || 4.5}
                    price={product.price}
                    description={product.description}
                    ingredients={product.ingredients}
                    concerns={product.concerns}
                    learnLink={`/product/${product.name
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    toggleCart={toggleCart}
                    addedToCart={cartItems.some(
                      (item) => item.id === product.id
                    )}
                    layout="concerns"
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mb-6">
                No products available for this concern.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConcernTreatments;
