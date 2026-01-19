import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Type Definitions ---
export interface ServiceObj {
  _id: string;
  name: string;
  category: string;
  imageUrl?: string;
}

interface Category {
  name: string;
  services?: ServiceObj[];
  subcategories?: { name: string; services: ServiceObj[] }[];
}

interface ServiceSquaresBlockProps {
  categories: Category[];
  handleServiceSquareClick: (category: Category) => void;
  selectedService: Category | null;
  concernImages: { [key: string]: string };
  handleServiceClick: (categoryName: string, serviceName: string) => void;
  showBanner?: boolean;
  loading?: boolean;
}

// --- Skeleton Loader ---
const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

const ShimmeringSkeleton: React.FC = () => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <div className="h-8 bg-slate-300 rounded-md w-1/3 mx-auto mb-10" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-slate-100 p-6 rounded-2xl relative overflow-hidden h-[400px] border-2 border-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="bg-slate-300 rounded-xl h-24 w-full border-2 border-slate-400" />
              <div className="bg-slate-300 rounded-md h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 rounded-2xl h-24 relative overflow-hidden border-2 border-slate-900"
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, ease: [0.6, 0.01, 0.05, 0.95] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] },
  },
};

// --- Sub-components ---
const ServiceCard: React.FC<{
  service: ServiceObj;
  imageUrl: string;
  onClick: () => void;
}> = ({ service, imageUrl, onClick }) => (
  <motion.div
    variants={itemVariants}
    className="group cursor-pointer text-center"
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    {/* BOLDER border lines + stronger hover border */}
    <div className="overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-sm group-hover:shadow-md transition-all group-hover:border-emerald-700">
      <img
        src={imageUrl}
        alt={service.name}
        className="w-full h-28 object-cover transition-transform group-hover:scale-110 duration-300"
        loading="lazy"
      />
      {/* Bold text line */}
      <h3 className="text-sm font-bold text-slate-900 p-3 bg-white break-words">
        {service.name}
      </h3>
    </div>
  </motion.div>
);

const CategoryItem: React.FC<{
  category: Category;
  onClick: () => void;
  isActive: boolean;
}> = ({ category, onClick, isActive }) => (
  <motion.div
    variants={itemVariants}
    className={`relative w-full text-center p-4 cursor-pointer transition-all duration-300 border-2
      ${
        isActive
          ? "bg-green-800 text-white shadow-lg scale-105 border-green-800"
          : "bg-white text-slate-900 hover:bg-emerald-50 hover:text-emerald-800 border-slate-900 hover:border-emerald-700"
      }
      font-bold
    `}
    onClick={onClick}
    whileHover={{ scale: isActive ? 1.05 : 1.02, y: -4 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
  >
    {/* Bold text line */}
    <span className="font-bold">{category.name}</span>
  </motion.div>
);

// --- Main Component ---
const ServiceSquaresBlock: React.FC<ServiceSquaresBlockProps> = ({
  categories,
  handleServiceSquareClick,
  selectedService,
  concernImages,
  handleServiceClick,
  loading,
}) => {
  useEffect(() => {
    if (!selectedService && categories.length > 0) {
      handleServiceSquareClick(categories[0]);
    }
  }, [selectedService, categories, handleServiceSquareClick]);

  if (loading) return <ShimmeringSkeleton />;

  const allServices =
    selectedService?.subcategories?.flatMap((sub) => sub.services) ||
    selectedService?.services ||
    [];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
      {/* Bold headline */}
      <motion.h2
        className="font-serif text-3xl sm:text-4xl font-extrabold text-center mb-10 lg:mt-10 mt-20 text-slate-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Discover Our Services
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left/Top: Service Grid with bold border */}
        <div className="md:col-span-2 bg-slate-50/70 p-4 sm:p-6 border-2 border-slate-900 min-h-[400px]">
          <AnimatePresence mode="wait">
            {selectedService && (
              <motion.div
                key={selectedService.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Bold sub-heading */}
                {/* <h3 className="text-xl font-extrabold text-green-800 mb-6 text-center">
                  {selectedService.name}
                </h3> */}

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allServices.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      imageUrl={concernImages[service.name]}
                      onClick={() =>
                        handleServiceClick(selectedService.name, service.name)
                      }
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right/Bottom: Category Selection with bold borders */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-1 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              category={category}
              onClick={() => handleServiceSquareClick(category)}
              isActive={selectedService?.name === category.name}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSquaresBlock;
