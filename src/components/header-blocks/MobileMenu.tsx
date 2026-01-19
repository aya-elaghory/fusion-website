import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_WIDTH = 320;

function renderIcon(icon: any, label: string) {
  if (typeof icon === "string") {
    return (
      <img
        src={icon}
        alt={label}
        className="h-5 w-5 object-cover mr-1"
        onError={(e) => (e.currentTarget.src = "/assets/default.jpg")}
      />
    );
  }
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "$$typeof" in icon)
  ) {
    const IconComp = icon;
    return <IconComp className="h-5 w-5 mr-1" />;
  }
  return null;
}

const MobileMenu = ({
  navItems,
  openMenu,
  setOpenMenu,
  resetMenus,
  isAuthenticated,
  user,
  onLoginClick,
  isOpen,
  onClose,
}: any) => {
  // Bulletproof body scroll lock (as in SlidingCart)
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // --- All markup below will be rendered into document.body via portal ---
  const menuMarkup = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[100000] bg-black bg-opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Side panel */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 z-[100001] bg-white shadow-xl flex flex-col h-screen"
            initial={{ x: -MENU_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -MENU_WIDTH }}
            transition={{ type: "tween", duration: 0.3 }}
            style={{ width: MENU_WIDTH, maxWidth: "100vw" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) onClose();
            }}
          >
            {/* X Button */}
            <div className="flex justify-end p-2">
              <button
                className="rounded-full hover:bg-gray-100 p-2"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* LOGIN/ACCOUNT SECTION */}
            <div className="flex flex-col px-4 pb-2 border-b mb-4">
              {isAuthenticated && user?.firstName ? (
                <Link
                  to="/account"
                  className="block w-full text-center bg-gray-100 py-3 px-4 font-semibold text-gray-700"
                  onClick={resetMenus}
                >
                  My Account
                </Link>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    resetMenus();
                  }}
                  className="block w-full text-center bg-green-700 text-white py-3 px-4 font-semibold"
                >
                  Login / Signup
                </button>
              )}
            </div>
            {/* NAVIGATION */}
            <div className="flex flex-col px-4 space-y-4 flex-1 overflow-y-auto">
              {navItems.map((navItem: any) =>
                navItem.subMenus ? (
                  <div key={navItem.label}>
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === navItem.label ? null : navItem.label
                        )
                      }
                      className="text-gray-800 text-lg font-semibold flex items-center w-full py-2 px-2 hover:bg-green-50 whitespace-nowrap"
                    >
                      {navItem.label}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          openMenu === navItem.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMenu === navItem.label && (
                      <ul className="pl-2 space-y-2 mt-2">
                        {/* Special rendering for "Products" */}
                        {navItem.label === "Products"
                          ? navItem.subMenus.map((sub: any) => {
                              // Treatments section
                              if (sub.title === "Treatments") {
                                return (
                                  <div key="Treatments">
                                    <div className="text-gray-700 font-semibold text-base px-2 mb-1">
                                      Treatments
                                    </div>
                                    {sub.items &&
                                      sub.items.map((item: any) => (
                                        <Link
                                          key={item.label}
                                          to={item.link}
                                          className="flex items-center space-x-2 text-base text-gray-700 hover:bg-green-50 py-2 px-4 rounded"
                                          onClick={resetMenus}
                                        >
                                          {renderIcon(item.icon, item.label)}
                                          <span>{item.label}</span>
                                        </Link>
                                      ))}
                                  </div>
                                );
                              }
                              // Symptoms section (main concerns + subconcerns, not expandable)
                              if (sub.title === "Symptoms") {
                                return (
                                  <div key="Symptoms">
                                    <div className="text-gray-700 font-semibold text-base px-2 mb-1">
                                      Symptoms
                                    </div>
                                    <div className="pl-2">
                                      {sub.items.map((main: any) => (
                                        <div key={main.label} className="mb-2">
                                          <div className="text-gray-800 font-medium text-sm px-2 mb-1">
                                            {main.label}
                                          </div>
                                          <div className="pl-3 flex flex-col">
                                            {main.subItems &&
                                              main.subItems.map((sub: any) => (
                                                <Link
                                                  key={sub.label}
                                                  to={sub.link}
                                                  className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-green-50 py-1 px-2 rounded"
                                                  onClick={resetMenus}
                                                >
                                                  {renderIcon(
                                                    sub.icon || sub.imageUrl,
                                                    sub.label
                                                  )}
                                                  <span>{sub.label}</span>
                                                </Link>
                                              ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              // New Pipelines section (not expandable)
                              if (sub.title === "New Pipelines") {
                                return (
                                  <div key="NewPipelines">
                                    <div className="text-gray-700 font-semibold text-base px-2 mb-1">
                                      New Pipelines
                                    </div>
                                    {sub.items &&
                                      sub.items.map((item: any) => (
                                        <Link
                                          key={item.label}
                                          to={item.link}
                                          className="flex items-center space-x-2 text-base text-gray-700 hover:bg-green-50 py-2 px-4 rounded"
                                          onClick={resetMenus}
                                        >
                                          {renderIcon(item.icon, item.label)}
                                          <span>{item.label}</span>
                                        </Link>
                                      ))}
                                  </div>
                                );
                              }
                              return null;
                            })
                          : // Fallback for any other navItem with subMenus
                            navItem.subMenus.map((sub: any) => (
                              <li key={sub.title}>
                                <div className="text-gray-700 font-medium text-base px-2 mb-1">
                                  {sub.title}
                                </div>
                                {sub.items &&
                                  sub.items.map((item: any) => (
                                    <Link
                                      key={item.label}
                                      to={item.link}
                                      className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-green-50 py-1 px-2 rounded"
                                      onClick={resetMenus}
                                    >
                                      {renderIcon(
                                        item.icon || item.imageUrl,
                                        item.label
                                      )}
                                      <span>{item.label}</span>
                                    </Link>
                                  ))}
                              </li>
                            ))}
                      </ul>
                    )}
                  </div>
                ) : navItem.link ? (
                  <Link
                    key={navItem.label}
                    to={navItem.link}
                    className="text-gray-800 text-lg font-semibold py-2 px-2 hover:bg-green-50 w-full block whitespace-nowrap"
                    onClick={resetMenus}
                  >
                    {navItem.label}
                  </Link>
                ) : null
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // --- PORTAL: this will always be rendered above everything else ---
  return createPortal(menuMarkup, document.body);
};

export default MobileMenu;
