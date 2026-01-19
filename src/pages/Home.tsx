// src/pages/Home.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import WhyFusion from "@/components/blocks/WhyFusion";
// import SkincareGuide from "@/components/blocks/SkincareGuide";
import GettingStarted from "@/components/blocks/GettingStarted";
import HowItBegan from "@/components/blocks/HowItBegan";
import CartModificationModal from "@/components/blocks/CartModificationModal";
import { addToCart, clearCart, fetchCart } from "@/slices/cartSlice";
import ServiceSquaresBlock from "@/components/home-blocks/ServiceSquaresBlock";
import ServiceSquaresSkeleton from "@/components/home-blocks/ServiceSquaresSkeleton";
import HomeActionButtons from "@/components/home-blocks/HomeActionButtons";
import { fetchServices } from "@/slices/servicesSlice";
// import InfiniteLogosBanner from "@/components/home-blocks/InfiniteLogosBanner";
import { fetchQuestions } from "@/slices/questionsSlice";
import { fetchProfile } from "@/slices/profileSlice";
import { fetchAnswers } from "@/slices/answersSlice";
import { fetchOrders } from "@/slices/ordersSlice";

// --- Voiceflow types (safe for TS) ---
declare global {
  interface Window {
    voiceflow?: any;
    __VF_LOADED__?: boolean;
  }
}

// --- Group services by category helper ---
function groupServicesByCategory(
  services: any[],
  allCategories: string[],
  mainConcerns: any[]
) {
  const concernImageMap: { [service: string]: string } = {};
  mainConcerns.forEach((main: any) => {
    if (
      main &&
      main.main_concern_name &&
      Array.isArray(main.subConcerns) &&
      main.subConcerns.length > 0
    ) {
      const url = main.subConcerns[0].imageUrl;
      concernImageMap[main.main_concern_name] = url;
    }
  });

  const grouped: Record<
    string,
    { name: string; services: { name: string; imageUrl?: string }[] }
  > = {};
  allCategories.forEach((cat) => {
    grouped[cat] = { name: cat, services: [] };
  });
  services.forEach((service) => {
    const img =
      concernImageMap[service.name] ||
      concernImageMap[service.category] ||
      "/assets/placeholder.png";
    if (!grouped[service.category]) {
      grouped[service.category] = { name: service.category, services: [] };
    }
    grouped[service.category].services.push({
      name: service.name,
      imageUrl: img,
    });
  });
  return Object.values(grouped);
}

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 🔊 Voiceflow Chat Widget (load once)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent duplicate loads if component remounts
    if (window.__VF_LOADED__) return;
    window.__VF_LOADED__ = true;

    const s = document.createElement("script");
    s.id = "voiceflow-widget";
    s.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    s.type = "text/javascript";
    s.async = true;
    s.onload = () => {
      window.voiceflow?.chat?.load({
        verify: { projectID: "68a27e0f9263c038f646070c" },
        url: "https://general-runtime.voiceflow.com",
        versionID: "production",
        voice: { url: "https://runtime-api.voiceflow.com" },
      });
    };
    document.body.appendChild(s);

    // optional cleanup: keep the chat persistent across nav.
    // If you prefer removing on unmount, uncomment below:
    // return () => {
    //   const existing = document.getElementById("voiceflow-widget");
    //   if (existing) existing.remove();
    //   window.__VF_LOADED__ = false;
    // };
  }, []);

  // Redux selectors
  const loadingProducts = useSelector(
    (state: RootState) => state.products.loading
  );
  const services = useSelector((state: RootState) => state.services.services);
  const loadingServices = useSelector(
    (state: RootState) => state.services.loading
  );
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns.concerns
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const loadingProfile = useSelector(
    (state: RootState) => state.profile.loading
  );
  const questionsSections = useSelector(
    (state: RootState) => state.questions.sections
  );
  const answers = useSelector((state: RootState) => state.answers.answers);
  const answersLoading = useSelector(
    (state: RootState) => state.answers.loading
  );
  const answersHasFetched = useSelector(
    (state: RootState) => state.answers.hasFetched
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartLoading = useSelector((state: RootState) => state.cart.loading);
  const cartHasFetched = useSelector(
    (state: RootState) => state.cart.hasFetched
  );
  const ordersLoaded = useSelector(
    (state: RootState) => !!state.orders.orders.length
  );

  const allCategories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))),
    [services]
  );

  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // --- Prefetch orders in background if authenticated ---
  useEffect(() => {
    if (isAuthenticated && !ordersLoaded) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, ordersLoaded]);

  // 1. Always make sure profile is fetched if needed
  useEffect(() => {
    if (isAuthenticated && !profile && !loadingProfile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, profile, loadingProfile]);

  // 2. Fetch answers only when profile says incompleteVisit and not already loaded
  useEffect(() => {
    if (
      isAuthenticated &&
      profile?.incompleteVisit &&
      !answersLoading &&
      !answersHasFetched
    ) {
      dispatch(fetchAnswers());
    }
  }, [
    dispatch,
    isAuthenticated,
    profile?.incompleteVisit,
    answersLoading,
    answersHasFetched,
  ]);

  // 3. Fetch services on mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // 4. Fetch cart if user has incompleteVisit, not already fetched
  useEffect(() => {
    if (
      isAuthenticated &&
      profile?.incompleteVisit &&
      !cartHasFetched &&
      !cartLoading
    ) {
      dispatch(fetchCart());
    }
  }, [
    dispatch,
    isAuthenticated,
    profile?.incompleteVisit,
    cartHasFetched,
    cartLoading,
  ]);

  // 5. Show/hide resume banner
  useEffect(() => {
    if (profile?.incompleteVisit && cartItems.length > 0) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [profile?.incompleteVisit, cartItems]);

  // 6. Fetch questions if not loaded (NON-BLOCKING), after profile/carts/answers
  useEffect(() => {
    if (
      isAuthenticated &&
      token &&
      !loadingProfile &&
      !cartLoading &&
      cartHasFetched &&
      cartItems.length > 0
    ) {
      dispatch(fetchQuestions({ cartItems }));
    }
    // eslint-disable-next-line
  }, [
    isAuthenticated,
    token,
    loadingProfile,
    cartLoading,
    cartHasFetched,
    cartItems,
    dispatch,
  ]);

  const handleConfirm = (selectedItems: typeof cartItems) => {
    dispatch(clearCart());
    selectedItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    setIsModalOpen(false);
    navigate("/questionnaire");
  };

  const categories = useMemo(
    () => groupServicesByCategory(services, allCategories, mainConcerns),
    [services, allCategories, mainConcerns]
  );

  // Build concernImages: { [service]: url }
  const concernImages: { [key: string]: string } = {};
  mainConcerns.forEach((main: any) => {
    if (
      main &&
      main.main_concern_name &&
      Array.isArray(main.subConcerns) &&
      main.subConcerns.length > 0
    ) {
      concernImages[main.main_concern_name] = main.subConcerns[0].imageUrl;
    }
  });
  services.forEach((service) => {
    if (!concernImages[service.name]) {
      concernImages[service.name] = "/assets/placeholder.png";
    }
  });

  // --- Best UX: Show skeleton until ALL required data is available ---
  if (
    (isAuthenticated && (!profile || loadingProfile)) ||
    loadingProducts ||
    loadingServices
  ) {
    return <ServiceSquaresSkeleton showBanner={false} />;
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Cart Resume Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              max-w-2xl
              mx-4
              md:mx-auto
              mt-36 lg:mt-24
              bg-white
              p-4
              shadow-md
              cursor-pointer
              text-center
              border
              border-r-8
              border-green-800
              rounded
            "
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-green-800 font-medium text-lg">
              Continue Your Doctor Visit
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Categories Block */}
      <ServiceSquaresBlock
        categories={categories}
        handleServiceSquareClick={setSelectedService}
        selectedService={selectedService}
        concernImages={concernImages}
        handleServiceClick={(cat, service) =>
          navigate(`/${service.toLowerCase().replace(/ /g, "-")}`)
        }
        showBanner={showBanner}
      />

      {/* Home CTA Buttons */}
      <HomeActionButtons
        handleAllProductsClick={() => navigate(`/treatments`)}
        handleAskQuestionsClick={() => navigate(`/`)}
      />

      {/* --- INFINITE LOGO MARQUEE (NEW) --- */}
      {/* <InfiniteLogosBanner /> */}

      {/* Info Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12">
        <WhyFusion />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12">
        <GettingStarted />
      </div>
      {/* <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12"> */}
      {/* <SkincareGuide /> */}
      {/* </div> */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm-py-10 md:py-12">
        <HowItBegan />
      </div>

      {/* Cart Modal */}
      {isModalOpen && (
        <CartModificationModal
          cartItems={cartItems}
          onConfirm={handleConfirm}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
