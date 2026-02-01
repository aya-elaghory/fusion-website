import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { addToCart } from "@/slices/cartSlice";
import { RootState } from "@/store";
import ConcernsBanner from "@/components/blocks/ConcernsBanner";

interface ProductPageProps {
  toggleCart: () => void;
}

function getConcernImage(subConcern: string, mainConcerns: any[]) {
  for (const main of mainConcerns) {
    const match = main.subConcerns?.find(
      (sub: any) => sub.name?.toLowerCase() === subConcern.toLowerCase(),
    );
    if (match && match.imageUrl) return match.imageUrl;
  }
  return "/assets/default.jpg";
}

const ProductPage: React.FC<ProductPageProps> = ({ toggleCart }) => {
  const { name: urlName } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns.concerns || [],
  );
  const products = useSelector(
    (state: RootState) => state.products.products || [],
  );

  const product = products.find(
    (p) => p.name.toLowerCase().replace(/ /g, "-") === urlName,
  );

  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  const {
    id,
    imageUrl,
    name,
    description,
    price,
    formulations = [],
    ingredients = [],
    concerns = [],
    howWhy,
    howToUse,
    faqs = [],
    // pairsWith can be array of {name, description} (new) or string[] (legacy)
    pairsWith = [],
  } = product as any;

  const isInCart = cartItems.some((item) => item.id === id);
  const rating = 4.8;

  const matchedMainConcern = mainConcerns.find((main: any) =>
    main.subConcerns?.some((sub: any) => concerns.includes(sub.name)),
  );

  const [activeConcern, setActiveConcern] = useState<string>(
    matchedMainConcern?.main_concern_name || "Select Your Concern",
  );
  const handleBannerClick = (concernName: string, path: string) => {
    setActiveConcern(concernName);
    navigate(path);
  };

  const [expandedSections, setExpandedSections] = useState({
    formula: false,
    howWhy: false,
    howToUse: false,
    faqs: false,
    pairsWell: false,
  });
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  const [expandedFormulas, setExpandedFormulas] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  const toggleFormula = (formulaName: string) => {
    setExpandedFormulas((prev) => ({
      ...prev,
      [formulaName]: !prev[formulaName],
    }));
  };
  const toggleFaq = (idx: number) => {
    setExpandedFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddToCart = () => {
    if (!isInCart && id && name && typeof price === "number") {
      dispatch(
        addToCart({
          id,
          imageSrc: imageUrl,
          name,
          price: `$${price}`,
          quantity: 1,
        }),
      );
      toggleCart();
    }
  };
  const handleAskQuestion = () => alert("Ask a Question feature coming soon!");

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 text-green-600 fill-current" />,
      );
    }
    if (hasHalfStar)
      stars.push(
        <Star key="half" className="h-5 w-5 text-green-600 fill-current" />,
      );
    while (stars.length < 5)
      stars.push(<Star key={stars.length} className="h-5 w-5 text-gray-300" />);
    return stars;
  };

  // 🔗 Build "Pairs Well With" showing ONLY products that exist in the store
  const pairsWellData = (pairsWith as any[])
    .map((pair) => {
      const pairName = typeof pair === "string" ? pair : pair?.name;
      if (!pairName) return null;

      const found = products.find((p) => p.name === pairName);
      if (!found) return null; // hide if not found in products

      const pairDesc = typeof pair === "string" ? undefined : pair?.description;

      return {
        id: found.id,
        name: found.name,
        description: pairDesc || found.description || "",
        image: found.imageUrl || "/assets/default.jpg",
        price: found.price ?? null,
      };
    })
    .filter(Boolean) as {
    id: any;
    name: string;
    description?: string;
    image: string;
    price: number | null;
  }[];

  const formulaNote =
    "Prescription is not guaranteed. Our doctors will evaluate your medical history and skin condition to determine the best treatment plan.";

  return (
    <div className="min-h-screen lg:mt-16 mt-28">
      {/* --- Shared Banner --- */}
      <ConcernsBanner
        mainConcerns={mainConcerns}
        activeConcern={activeConcern}
        onBannerClick={handleBannerClick}
      />
      {/* --- /Shared Banner --- */}

      {/* Main content with padding to account for fixed header and nav banner */}
      <div className="lg:pt-20 xmd:pt-16 sm:pt-28 xs:pt-28 pt-44 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* IMAGE SECTION */}
            <div className="flex justify-center w-full lg:w-1/2">
              <img
                src={imageUrl || "/assets/default.jpg"}
                alt={name}
                className="w-full max-w-lg h-auto object-cover"
              />
            </div>
            {/* DETAILS SECTION */}
            <div className="flex flex-col space-y-6 w-full max-w-xl lg:w-1/2 items-center lg:items-start">
              <div className="flex items-center justify-between flex-wrap gap-4 w-full">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {name}
                </h1>
                <div className="flex items-center">
                  {renderStars()}
                  <span className="ml-2 text-md text-gray-600">{rating}/5</span>
                </div>
              </div>

              <p className="text-2xl text-gray-700 font-semibold w-full">
                {typeof price === "number" ? `$${price.toFixed(2)}/month` : ""}
              </p>

              <p className="text-gray-600 w-full">{description}</p>

              {/* Concerns this product treats */}
              <div className="pc-prod-concerns w-full">
                <div className="title text-xl font-semibold text-gray-900 mb-4">
                  Treats the following concerns:
                </div>

                <div className="flex flex-wrap gap-3">
                  {concerns.map((concern: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col border border-gray-400 w-[115px] divide-y divide-gray-400"
                    >
                      <img
                        src={getConcernImage(concern, mainConcerns)}
                        alt={concern}
                        className="w-[115px] h-[75px] object-cover"
                      />

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

              {/* Add to cart / Ask */}
              <button
                type="button"
                className={`w-full max-w-xl text-base py-3 px-6 border border-transparent rounded-none
                  transition-colors duration-150
                  ${
                    isInCart || typeof price !== "number"
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  }`}
                onClick={
                  isInCart || typeof price !== "number"
                    ? undefined
                    : handleAddToCart
                }
                disabled={isInCart || typeof price !== "number"}
                aria-label={`Add ${name} to cart`}
              >
                {isInCart
                  ? "Added to Cart"
                  : typeof price === "number"
                    ? "Add to Cart"
                    : "Price shown after consult"}
              </button>

              <button
                type="button"
                className="w-full max-w-xl text-base py-3 px-6 bg-gray-300 text-black-800 hover:bg-gray-400 border border-transparent rounded-none"
                onClick={handleAskQuestion}
                aria-label="Ask a question about this product"
              >
                Ask a Question
              </button>
            </div>
          </div>

          {/* Details Accordion */}
          <div className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div></div>
              <div className="lg:col-start-2 lg:col-span-1">
                {/* --- FORMULATIONS --- */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full flex justify-between items-center py-4 text-left"
                    onClick={() => toggleSection("formula")}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Formulations
                    </h2>
                    {expandedSections.formula ? (
                      <ChevronUp className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    )}
                  </button>

                  {expandedSections.formula && (
                    <div className="pb-4 text-gray-700">
                      {/* If per-formula exists, show them; else fall back to top-level ingredients */}
                      {Array.isArray(formulations) &&
                      formulations.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {formulations.map(
                            (
                              f: {
                                formulaName: string;
                                ingredients: {
                                  ingredientName: string;
                                  percentage?: string;
                                }[];
                              },
                              index: number,
                            ) => (
                              <div
                                key={`${f.formulaName}-${index}`}
                                className="py-2"
                              >
                                <button
                                  className="w-full flex justify-between items-center py-2 text-left"
                                  onClick={() => toggleFormula(f.formulaName)}
                                >
                                  <h3 className="text-lg font-medium text-gray-800">
                                    {f.formulaName}
                                  </h3>
                                  {expandedFormulas[f.formulaName] ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                  )}
                                </button>

                                {expandedFormulas[f.formulaName] && (
                                  <div className="pl-4 pb-3">
                                    <p className="font-semibold mb-1">
                                      Ingredients
                                    </p>
                                    <ul className="list-disc pl-6">
                                      {f.ingredients.map((ing, idx) => (
                                        <li key={idx} className="leading-6">
                                          {ing.ingredientName}
                                          {ing.percentage
                                            ? ` – ${ing.percentage}`
                                            : ""}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">Key ingredients</p>
                          <ul className="list-disc pl-6">
                            {ingredients.map(
                              (
                                ing: { name: string; percentage?: string },
                                idx: number,
                              ) => (
                                <li key={idx} className="leading-6">
                                  {ing.name}
                                  {ing.percentage ? ` – ${ing.percentage}` : ""}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                      <p className="mt-4 text-sm text-gray-600">
                        {formulaNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* --- HOW & WHY --- */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full flex justify-between items-center py-4 text-left"
                    onClick={() => toggleSection("howWhy")}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      How & Why It Works
                    </h2>
                    {expandedSections.howWhy ? (
                      <ChevronUp className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                  {expandedSections.howWhy && (
                    <div className="pb-4 text-gray-700">
                      <p>{howWhy}</p>
                    </div>
                  )}
                </div>

                {/* --- HOW TO USE --- */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full flex justify-between items-center py-4 text-left"
                    onClick={() => toggleSection("howToUse")}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      How to Use
                    </h2>
                    {expandedSections.howToUse ? (
                      <ChevronUp className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                  {expandedSections.howToUse && (
                    <div className="pb-4 text-gray-700">
                      <p>{howToUse}</p>
                    </div>
                  )}
                </div>

                {/* --- FAQs --- */}
                {Array.isArray(faqs) && faqs.length > 0 && (
                  <div className="border-b border-gray-200">
                    <button
                      className="w-full flex justify-between items-center py-4 text-left"
                      onClick={() => toggleSection("faqs")}
                    >
                      <h2 className="text-xl font-semibold text-gray-900">
                        FAQs
                      </h2>
                      {expandedSections.faqs ? (
                        <ChevronUp className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      )}
                    </button>
                    {expandedSections.faqs && (
                      <div className="pb-4 text-gray-700 space-y-4">
                        {faqs.map(
                          (
                            faq: { question: string; answer: string },
                            idx: number,
                          ) => {
                            const open = !!expandedFaqs[idx];
                            return (
                              <div key={idx} className="border border-gray-200">
                                <button
                                  className="w-full flex justify-between items-center px-3 py-3 text-left"
                                  onClick={() => toggleFaq(idx)}
                                >
                                  <span className="font-semibold text-gray-900 mr-3">
                                    {faq.question}
                                  </span>
                                  {open ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                  )}
                                </button>
                                {open && (
                                  <div className="px-4 pb-4 text-gray-700 whitespace-pre-line">
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* --- PAIRS WELL WITH --- */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full flex justify-between items-center py-4 text-left"
                    onClick={() => toggleSection("pairsWell")}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Pairs Well With
                    </h2>
                    {expandedSections.pairsWell ? (
                      <ChevronUp className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    )}
                  </button>

                  {expandedSections.pairsWell && (
                    <div className="pb-4">
                      {pairsWellData.length === 0 ? (
                        <p className="text-gray-600">
                          No recommended pairs for this product yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {pairsWellData.map((item, index) => {
                            const isPairedInCart = cartItems.some(
                              (cartItem) => cartItem.id === item.id,
                            );
                            const canAdd = typeof item.price === "number";

                            return (
                              <div
                                key={`${item.name}-${index}`}
                                className="flex items-center space-x-4 border p-4 rounded-lg"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p className="text-gray-600">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="mt-2 flex space-x-2">
                                    <button
                                      className="flex-1 border border-gray-300 px-4 py-3 rounded text-gray-700 hover:bg-gray-100 text-sm font-medium"
                                      onClick={() =>
                                        navigate(
                                          `/product/${item.name
                                            .replace(/ /g, "-")
                                            .toLowerCase()}`,
                                        )
                                      }
                                    >
                                      Learn More
                                    </button>
                                    <button
                                      className={`flex-1 border px-4 py-3 rounded text-sm font-medium ${
                                        isPairedInCart || !canAdd
                                          ? "border-gray-300 text-gray-500 cursor-not-allowed"
                                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                      }`}
                                      onClick={() => {
                                        if (!isPairedInCart && canAdd) {
                                          dispatch(
                                            addToCart({
                                              id: item.id,
                                              imageSrc: item.image,
                                              name: item.name,
                                              price: `$${item.price}`,
                                              quantity: 1,
                                            }),
                                          );
                                          toggleCart();
                                        }
                                      }}
                                      disabled={isPairedInCart || !canAdd}
                                    >
                                      {isPairedInCart
                                        ? "Added to Cart"
                                        : canAdd
                                          ? `Add for $${item.price}`
                                          : "Add Unavailable"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* --- /PAIRS WELL WITH --- */}
              </div>
            </div>
          </div>
          {/* /Details Accordion */}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
