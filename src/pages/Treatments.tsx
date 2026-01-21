import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/components/blocks/ProductCard";
import { RootState } from "@/store";

interface TreatmentsProps {
  toggleCart: () => void;
}

const centsToDollars = (cents?: number) =>
  Number(((cents ?? 0) / 100).toFixed(2));

const slugify = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const Treatments: React.FC<TreatmentsProps> = ({ toggleCart }) => {
  const cartItems = useSelector((state: RootState) => state.cart?.items ?? []);
  const loading = useSelector(
    (state: RootState) => state.products?.loading ?? false
  );
  const error = useSelector((state: RootState) => state.products?.error ?? null);
  const allProducts = useSelector(
    (state: RootState) => state.products?.products ?? []
  ) as any[];

  const treatments = useMemo(() => {
    return (allProducts ?? []).map((product) => {
      const id = String(product.id ?? ""); // ✅ Prisma id

      const monthly = centsToDollars(product.priceOneTimeCents);

      const ingredientsStr =
        Array.isArray(product.ingredients)
          ? (() => {
              const names = product.ingredients
                .map((i: any) => i?.name)
                .filter(Boolean);
              const topThree = names.slice(0, 3);
              return topThree.join(", ") + (names.length > 3 ? " & more" : "");
            })()
          : String(product.ingredients ?? "");

      return {
        id,
        imageSrc: product.imageUrl || product.imageSrc || "",
        topIcon: product.topIcon,
        sideIcon: product.sideIcon,
        name: product.name,
        rating: 4.8,
        price: monthly,
        description: product.description,
        ingredients: ingredientsStr,
        learnLink: `/product/${slugify(product.name)}`,
        concerns: product.concerns ?? [],
      };
    });
  }, [allProducts]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-gray-100 lg:mt-14 mt-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Treatments</h1>
        </div>

        {loading ? (
          <p className="text-center">Loading products…</p>
        ) : error ? (
          <p className="text-center text-red-500">{String(error)}</p>
        ) : treatments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {treatments.map((t) => {
              const isInCart = cartItems.some((i) => i.id === t.id);

              return (
                <ProductCard
                  key={t.id}
                  id={t.id} // ✅ Prisma id
                  imageSrc={t.imageSrc}
                  topIcon={t.topIcon}
                  sideIcon={t.sideIcon}
                  name={t.name}
                  rating={t.rating}
                  price={t.price}
                  description={t.description}
                  ingredients={t.ingredients}
                  concerns={t.concerns}
                  learnLink={t.learnLink}
                  toggleCart={toggleCart}
                  addedToCart={isInCart}
                  layout="treatments"
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Treatments;
