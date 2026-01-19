import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import LoginSlice from "@/pages/Login";

const Cart = React.lazy(() => import("@/pages/Cart"));
const PaymentSuccess = React.lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCancel = React.lazy(() => import("@/pages/PaymentCancel"));

const Home = React.lazy(() => import("@/pages/Home"));
const Product = React.lazy(() => import("@/pages/ProductPage"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const Account = React.lazy(() => import("@/pages/Account"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Treatments = React.lazy(() => import("@/pages/Treatments"));
const Concerns = React.lazy(() => import("@/pages/ConcernsPage"));
const ConcernTreatments = React.lazy(() => import("@/pages/ConcernTreatments"));
const RecommendTreatments = React.lazy(() => import("@/pages/RecommendTreatments"));
const Signup = React.lazy(() => import("@/pages/Signup"));
const Questionnaire = React.lazy(() => import("@/pages/Questionnaire"));
const UploadPhotos = React.lazy(() => import("@/pages/UploadPhotos"));
const TermsAndPrivacyPage = React.lazy(() => import("@/pages/TermsAndPrivacyPage"));
const OrderHistory = React.lazy(() => import("@/pages/OrdersHistory"));
const AdminOrders = React.lazy(() => import("@/pages/AdminOrders"));
const AboutUsPage = React.lazy(() => import("@/pages/AboutUs"));

interface AppRoutesProps {
  toggleCart: () => void;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


const AppRoutes: React.FC<AppRoutesProps> = ({ toggleCart }) => {
  const mainConcerns = useSelector((state: RootState) => state.mainConcerns.concerns || []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/treatments" element={<Treatments toggleCart={toggleCart} />} />
        <Route path="/product/:name" element={<Product toggleCart={toggleCart} />} />

        {/* ✅ Cart should be PUBLIC (do not protect it) */}
  <Route path="/cart" element={<Cart />} />


        {/* ✅ Checkout stays protected */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute>
              <Questionnaire onSubmit={() => {}} onBack={() => {}} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploadphotos"
          element={
            <ProtectedRoute>
              <UploadPhotos onSubmit={() => console.log("Photos submitted")} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/concerns" element={<Concerns toggleCart={toggleCart} />} />
        <Route path="/recommend" element={<RecommendTreatments toggleCart={toggleCart} />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        <Route path="/login" element={<LoginSlice />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/terms" element={<TermsAndPrivacyPage />} />
        <Route path="/privacy" element={<TermsAndPrivacyPage />} />
        <Route path="/about" element={<AboutUsPage />} />

        {mainConcerns.map((mainConcern) => (
          <Route
            key={mainConcern._id || mainConcern.main_concern_name}
            path={`/${String(mainConcern.main_concern_name).toLowerCase().replace(/ /g, "-")}`}
            element={<ConcernTreatments toggleCart={toggleCart} />}
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
