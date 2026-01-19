// src/components/blocks/Header.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import DropdownNavigation from "@/components/header-blocks/DropdownNavigation";
import SearchBar from "@/components/header-blocks/SearchBar";
import MobileMenu from "@/components/header-blocks/MobileMenu";
import type { RootState } from "@/store";
import type { Product } from "@/slices/productsSlice";

interface HeaderProps {
  toggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redux selectors
  const products = useSelector(
    (state: RootState) => state.products?.products ?? []
  ) as Product[];
  const mainConcerns = useSelector(
    (state: RootState) => state.mainConcerns?.concerns ?? []
  );
  const newPipelines = useSelector(
    (state: RootState) => state.newPipelines?.pipelines ?? []
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { profile, loading: profileLoading } = useSelector(
    (state: RootState) => state.profile
  );
  const cartItemCount = useSelector(
    (state: RootState) =>
      state.cart?.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ) || 0
  );

  const locations = [
    {
      label: "Dubai",
      description: "Visit our Dubai location",
      icon: "/assets/Dubai.png",
    },
    {
      label: "New York",
      description: "Visit our New York location",
      icon: "/assets/NY.png",
    },
    {
      label: "Athens",
      description: "Visit our Athens location",
      icon: "/assets/Athens.png",
    },
    {
      label: "Cairo",
      description: "Visit our Cairo location",
      icon: "/assets/Cairo.png",
    },
  ];

  // Search/nav state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { text: string; name: string }[]
  >([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  }, [location]);

  const productsSubMenus = [
    {
      title: "Treatments",
      items: [
        {
          label: "All Products",
          description: "Explore our full range of products",
          icon: Menu,
          link: "/treatments",
        },
        {
          label: "Select your concern",
          description: "Recommended products based on concerns",
          icon: Menu,
          link: "/concerns",
        },
      ],
    },
    {
      title: "Symptoms",
      items: mainConcerns.map((main: any) => ({
        label: main.main_concern_name,
        subItems: Array.isArray(main.subConcerns)
          ? main.subConcerns.map((sub: any) => ({
              label: sub.name,
              link: `/${main.main_concern_name
                .toLowerCase()
                .replace(/ /g, "-")}`,
              icon: sub.imageUrl,
              imageUrl: sub.imageUrl,
            }))
          : [],
      })),
    },
    newPipelines.length > 0
      ? {
          title: "New Pipelines",
          items: newPipelines.map((pipeline: any) => ({
            label: pipeline.label,
            description: pipeline.description,
            icon: pipeline.icon,
          })),
        }
      : null,
  ].filter(Boolean);

  const navItems = [
    { id: 1, label: "Products", subMenus: productsSubMenus },
    // { id: 2, label: "Patient Forum", link: "/community/patient-forum" },
    {
      id: 3,
      label: "Information",
      subMenus: [
        {
          title: "Locations",
          items: locations.map((loc) => ({
            label: loc.label,
            description: loc.description,
            icon: loc.icon,
            isDisabled: true,
          })),
        },
        // {
        //   title: "Gifting",
        //   items: [
        //     {
        //       label: "eGift Card",
        //       description: "Send a gift card",
        //       icon: Menu,
        //       link: "/community/egift-card",
        //     },
        //   ],
        // },
      ],
    },
    {
      id: 4,
      label: "About Us",
      link: "/about",
      // subMenus: [
      //   {
      //     title: "Our Story",
      //     items: [
      //       {
      //         label: "Vision",
      //         description: "Our vision for the future",
      //         icon: Menu,
      //         link: "/about-us/vision",
      //       },
      //       {
      //         label: "Mission",
      //         description: "Our mission statement",
      //         icon: Menu,
      //         link: "/about-us/mission",
      //       },
      //       {
      //         label: "Value",
      //         description: "Our core values",
      //         icon: Menu,
      //         link: "/about-us/value",
      //       },
      //     ],
      //   },
      // ],
    },
  ];

  // Search logic
  const handleFocus = () => {
    setIsSearchFocused(true);
    if (!searchQuery) {
      setFilteredSuggestions(
        products.map((product) => ({
          text: `Explore ${product.name}`,
          name: product.name.replace(/ /g, "-").toLowerCase(),
        }))
      );
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      setFilteredSuggestions([]);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((product) => ({
          text: `Explore ${product.name}`,
          name: product.name.replace(/ /g, "-").toLowerCase(),
        }));
      setFilteredSuggestions(
        filtered.length > 0
          ? filtered
          : [{ text: "No results found", name: "" }]
      );
    } else if (isSearchFocused) {
      setFilteredSuggestions(
        products.map((product) => ({
          text: `Explore ${product.name}`,
          name: product.name.replace(/ /g, "-").toLowerCase(),
        }))
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    if (name) {
      navigate(`/product/${name}`);
      setSearchQuery("");
      setFilteredSuggestions([]);
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      setOpenMenu(null);
    }
  };

  const handleLoginClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { fromHeader: true } });
      setIsMobileMenuOpen(false);
      setOpenMenu(null);
    }
  };

  const handleAccountClick = () => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
    navigate("/account");
  };

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
    navigate("/admin-orders");
  };

  // --- Render: block header if waiting for profile, but only if auth'd ---
  if (isAuthenticated && profileLoading && !profile) {
    // Full header skeleton while loading
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 lg:px-6">
          <nav className="flex items-center justify-between py-3 w-full min-h-[56px]">
            <div className="h-8 w-32 bg-gray-100 animate-pulse rounded" />
            <div className="h-8 w-80 bg-gray-100 animate-pulse rounded" />
            <div className="flex gap-4">
              <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
              <div className="h-8 w-8 bg-gray-100 animate-pulse rounded" />
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-[39]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 lg:px-6">
        {/* Main navigation bar */}
        <nav className="relative flex items-center py-2 lg:py-1 w-full min-h-[56px]">
          {/* Burger (mobile) */}
          <div className="lg:hidden flex items-center z-20">
            <button
              className="text-gray-600 hover:text-gray-900 mr-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          {/* Dropdown navigation (desktop) */}
          <div className="hidden lg:flex items-center flex-shrink-0 z-20">
            <DropdownNavigation
              navItems={navItems}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              resetMenus={() => setOpenMenu(null)}
            />
          </div>
          {/* LOGO: Always centered */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none z-10">
            <Link
              to="/"
              className="pointer-events-auto"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setOpenMenu(null);
              }}
            >
              <img
                src="/assets/Fusion-Main-LOGO.png"
                alt="Fusion Main Logo"
                className="h-14 w-32 lg:h-16 lg:w-40 object-contain"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />
            </Link>
          </div>
          {/* Right controls */}
          <div className="flex items-center flex-shrink-0 ml-auto z-20">
            {/* Desktop Search */}
            <div
              className="hidden lg:block relative mr-2"
              style={{ width: "15rem" }}
            >
              <SearchBar
                searchQuery={searchQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                suggestions={filteredSuggestions}
                onSuggestionClick={handleSuggestionClick}
                isFocused={isSearchFocused}
                setSearchQuery={setSearchQuery}
                className="w-full"
              />
            </div>
            {/* Login/Account/Admin: desktop only */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                profile && profile.role === "admin" ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                  >
                    <button
                      onClick={handleAdminClick}
                      className="text-green-800 hover:text-white hover:bg-green-700 text-sm px-3 py-4 transition-colors duration-200 whitespace-nowrap relative z-10 font-bold"
                    >
                      Admin
                    </button>
                    {isLoginHovered && (
                      <motion.div
                        layoutId="login-hover-bg"
                        className="absolute inset-0 bg-green-50 z-0"
                        style={{ borderRadius: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </div>
                ) : profile ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                  >
                    <button
                      onClick={handleAccountClick}
                      className="text-gray-600 hover:text-gray-900 hover:bg-green-50 text-sm px-3 py-4 transition-colors duration-200 whitespace-nowrap relative z-10"
                    >
                      My Account
                    </button>
                    {isLoginHovered && (
                      <motion.div
                        layoutId="login-hover-bg"
                        className="absolute inset-0 bg-green-50 z-0"
                        style={{ borderRadius: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </div>
                ) : null
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setIsLoginHovered(true)}
                  onMouseLeave={() => setIsLoginHovered(false)}
                >
                  <button
                    onClick={handleLoginClick}
                    className="text-gray-600 hover:text-gray-900 hover:bg-green-50 text-sm px-3 py-4 transition-colors duration-200 whitespace-nowrap relative z-10"
                  >
                    Login / Signup
                  </button>
                  {isLoginHovered && (
                    <motion.div
                      layoutId="login-hover-bg"
                      className="absolute inset-0 bg-green-50 z-0"
                      style={{ borderRadius: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </div>
              )}
            </div>
            {/* Cart: always shown */}
            <button
              onClick={toggleCart}
              className="text-gray-600 hover:text-gray-900 hover:bg-green-50 rounded px-4 py-4 flex items-center transition-colors duration-200 whitespace-nowrap"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </nav>
        {/* Mobile Search Bar */}
        <div className="lg:hidden w-full">
          <SearchBar
            searchQuery={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            suggestions={filteredSuggestions}
            onSuggestionClick={handleSuggestionClick}
            isFocused={isSearchFocused}
            setSearchQuery={setSearchQuery}
            className="w-full"
          />
        </div>
        {/* Mobile Menu */}
        <MobileMenu
          navItems={navItems}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          resetMenus={() => {
            setIsMobileMenuOpen(false);
            setOpenMenu(null);
          }}
          isAuthenticated={isAuthenticated}
          user={profile || undefined}
          onLoginClick={handleLoginClick}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
