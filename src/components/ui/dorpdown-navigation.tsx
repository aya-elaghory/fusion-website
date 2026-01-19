import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function renderIcon(icon: any, label: string) {
  if (typeof icon === "string") {
    return (
      <img
        src={icon}
        alt={label}
        className="h-6 w-6 object-cover"
        onError={(e) => (e.currentTarget.src = "/assets/default.jpg")}
      />
    );
  }
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon && "$$typeof" in icon)
  ) {
    const IconComp = icon;
    return <IconComp className="h-5 w-5 flex-none" />;
  }
  return null;
}

export interface DropdownNavigationProps {
  navItems: Array<{
    id: number | string;
    label: string;
    link?: string;
    subMenus?: Array<{
      title: string;
      items?: Array<{
        label: string;
        description?: string;
        icon?: any;
        imageUrl?: string;
        link?: string;
        isDisabled?: boolean;
      }>;
      subSections?: Array<{
        title: string;
        items: Array<{
          label: string;
          description?: string;
          icon?: any;
          imageUrl?: string;
          link?: string;
          isDisabled?: boolean;
        }>;
      }>;
    }>;
  }>;
  openMenu: string | null;
  setOpenMenu: (label: string | null) => void;
  resetMenus?: () => void;
}

const DropdownNavigation: React.FC<DropdownNavigationProps> = ({
  navItems,
  openMenu,
  setOpenMenu,
  resetMenus,
}) => {
  const [isHover, setIsHover] = useState<string | null>(null);

  function handleMenuClose() {
    setOpenMenu(null);
    setIsHover(null);
    if (typeof resetMenus === "function") resetMenus();
  }

  function RenderMenuItem({ item }: { item: any }) {
    const isLink = !item.isDisabled && !!item.link;
    const Row: any = isLink ? Link : "div";
    const rowProps = isLink
      ? {
          to: item.link,
          onClick: handleMenuClose,
          className:
            "flex items-start space-x-2 group px-0 py-0 transition-colors duration-300 hover:bg-green-50",
        }
      : {
          className:
            "flex items-start space-x-2 group cursor-default select-none px-0 py-0 transition-colors duration-300 hover:bg-green-50",
        };

    return (
      <Row {...rowProps}>
        <div className="border border-gray-200 text-gray-600 flex items-center justify-center size-6 shrink-0 transition-colors duration-300">
          {renderIcon(item.icon || item.imageUrl, item.label)}
        </div>
        <div className="leading-5 w-max">
          <p className="text-sm font-medium text-gray-600 group-hover:text-green-800 shrink-0 transition-colors duration-300">
            {item.label}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500">{item.description}</p>
          )}
        </div>
      </Row>
    );
  }

  return (
    <ul className="relative flex items-center space-x-2">
      {navItems.map((navItem) => {
        const hasMenu =
          Array.isArray(navItem.subMenus) && navItem.subMenus.length > 0;
        const isTopLink = !!navItem.link && !hasMenu;

        return (
          <li
            key={navItem.label}
            className="relative"
            onMouseEnter={() => {
              if (hasMenu) {
                setOpenMenu(navItem.label);
                setIsHover(navItem.label);
              }
            }}
            onMouseLeave={() => {
              if (hasMenu) {
                setOpenMenu(null);
                setIsHover(null);
              }
            }}
          >
            {isTopLink ? (
              <Link
                to={navItem.link!}
                onClick={handleMenuClose}
                className="text-sm py-4 px-2 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-0 text-gray-600 hover:text-gray-900 relative z-10 whitespace-nowrap"
              >
                <span className="relative z-20">{navItem.label}</span>
                {(isHover === String(navItem.id) ||
                  openMenu === navItem.label) && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-green-50 z-0"
                    style={{ borderRadius: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            ) : (
              <button
                type="button"
                className="text-sm py-4 px-2 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-0 text-gray-600 hover:text-gray-900 relative z-10 whitespace-nowrap"
                onMouseEnter={() => setIsHover(String(navItem.id))}
                onMouseLeave={() => setIsHover(null)}
                onClick={() => {
                  // Optional: toggle menu on click for keyboard/touch users
                  setOpenMenu(
                    openMenu === navItem.label ? null : navItem.label
                  );
                }}
                aria-haspopup={hasMenu ? "menu" : undefined}
                aria-expanded={openMenu === navItem.label}
              >
                <span className="relative z-20">{navItem.label}</span>
                {hasMenu && (
                  <ChevronDown
                    className={`h-4 w-4 ml-1 group-hover:rotate-180 duration-300 transition-transform relative z-20 ${
                      openMenu === navItem.label ? "rotate-180" : ""
                    }`}
                  />
                )}
                {(isHover === String(navItem.id) ||
                  openMenu === navItem.label) && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-green-50 z-0"
                    style={{ borderRadius: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </button>
            )}

            <AnimatePresence>
              {openMenu === navItem.label && hasMenu && (
                <div className="w-auto absolute left-0 top-full z-[1000001]">
                  <motion.div
                    className="bg-white border border-gray-200 p-4 mt-1.5 w-max shadow-lg max-h-[min(75vh,calc(100vh-120px))] overflow-y-auto overscroll-contain pb-6"
                    style={{ borderRadius: 0 }}
                    layoutId="menu"
                  >
                    <div className="w-fit shrink-0 flex space-x-9">
                      {navItem.subMenus!.map((sub) => (
                        <motion.div layout className="w-full" key={sub.title}>
                          <h3 className="mb-4 text-sm font-medium capitalize text-gray-500">
                            {sub.title}
                          </h3>

                          {sub.title !== "Symptoms" &&
                            Array.isArray(sub.items) &&
                            sub.items.length > 0 && (
                              <ul className="space-y-6">
                                {sub.items.map((item) => (
                                  <li key={item.label}>
                                    <RenderMenuItem item={item} />
                                  </li>
                                ))}
                              </ul>
                            )}

                          {/* Optional grouped sections */}
                          {sub.title !== "Symptoms" &&
                            Array.isArray(sub.subSections) &&
                            sub.subSections.length > 0 && (
                              <div>
                                {sub.subSections.map((section) => (
                                  <div key={section.title} className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2">
                                      {section.title}
                                    </h4>
                                    <ul className="space-y-2">
                                      {section.items.map((item: any) => (
                                        <li key={item.label}>
                                          <RenderMenuItem item={item} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

export default DropdownNavigation;
