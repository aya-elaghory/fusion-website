// src/App.tsx
import React, { Suspense, useState, useRef, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/slices/productsSlice";
import { fetchMainConcerns } from "@/slices/mainConcernsSlice";
import { fetchNewPipelines } from "@/slices/newPipelinesSlice";
import { fetchServices } from "@/slices/servicesSlice";
import { fetchProfile } from "@/slices/profileSlice";
import { logout } from "@/slices/authSlice";

import Header from "@/components/blocks/Header";
import Footer from "@/components/blocks/Footer";
import AppRoutes from "@/AppRoutes";
import ScrollToTop from "@/components/features/ScrollToTop";
import ErrorBoundary from "@/components/features/ErrorBoundary";
import SlidingCart from "@/components/ui/SlidingCart";

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const profileFetched = useRef(false);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchMainConcerns());

    if (token && !profileFetched.current) {
      profileFetched.current = true;

      dispatch(fetchProfile())
        .unwrap()
        .catch((err: any) => {
          // ✅ ONLY logout if 401/403
          const status = err?.status || err?.response?.status;
          if (status === 401 || status === 403) dispatch(logout());
        });
    }

    if (!token) profileFetched.current = false;
  }, [dispatch, token]);

  return null;
}

const BackgroundDataLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchNewPipelines());
  }, [dispatch]);
  return null;
};

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header toggleCart={toggleCart} />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <main className="flex-grow">
            <AppRoutes toggleCart={toggleCart} />
          </main>
        </Suspense>
        <Footer />
        <SlidingCart isOpen={isCartOpen} onClose={closeCart} />
        <BackgroundDataLoader />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppInitializer />
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
