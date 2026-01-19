import React, { useState, useEffect } from "react";

interface CartItem {
  id: string;
  imageSrc: string;
  name: string;
  price: number | string;
  quantity: number;
}

interface CartModificationModalProps {
  cartItems: CartItem[];
  onConfirm: (selectedItems: CartItem[]) => void;
  onClose: () => void;
}

const CartModificationModal: React.FC<CartModificationModalProps> = ({
  cartItems,
  onConfirm,
  onClose,
}) => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>(cartItems);

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Sync selectedItems with cartItems whenever cartItems changes
  useEffect(() => {
    setSelectedItems(cartItems);
  }, [cartItems]);

  const handleCheckboxChange = (item: CartItem) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, item]
    );
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const handleConfirmClick = () => {
    onConfirm(selectedItems);
  };

  // Helper to parse price string like "$12.34" or number
  const parsePrice = (price: string | number): number => {
    const str = typeof price === "number" ? price.toString() : price;
    const numeric = str.replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(numeric);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate total price of selected items
  const totalPrice = selectedItems
    .reduce((total, item) => {
      const priceNumber = parsePrice(item.price);
      return total + priceNumber * item.quantity;
    }, 0)
    .toFixed(2);

  // Backdrop click closes modal, click inside box does not
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 border border-gray-200 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirm Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            type="button"
          >
            ×
          </button>
        </div>
        <div
          className="space-y-4 max-h-96 overflow-y-auto"
          onWheel={(e) => e.stopPropagation()}
        >
          {cartItems.length === 0 ? (
            <p className="text-gray-600">No items to display.</p>
          ) : (
            cartItems.map((item) => {
              const selected = selectedItems.find(
                (selected) => selected.id === item.id
              );
              if (!selected) return null;
              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-2 border border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => handleCheckboxChange(item)}
                    className="h-5 w-5 text-green-800"
                  />
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="w-12 h-12 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span>{item.name}</span>
                    <span className="block text-sm text-gray-500 truncate">
                      ${parsePrice(item.price).toFixed(2)}
                    </span>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      className="px-2 py-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-lg"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={selected.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 text-center select-none">
                      {selected.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-lg"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-semibold text-gray-900">
              ${totalPrice}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              className={`px-4 py-2 text-white ${
                selectedItems.length > 0
                  ? "bg-green-800 hover:bg-green-900"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleConfirmClick}
              disabled={selectedItems.length === 0}
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModificationModal;
