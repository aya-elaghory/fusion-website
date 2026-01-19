// src/pages/UploadPhotos.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store";
import { updateOrderDraft } from "@/slices/ordersSlice";
import "./UploadPhotos.css";

interface UploadPhotosProps {
  onSubmit?: () => void;
}

/* ------------------------ CONFIG / CONSTANTS ------------------------ */
// TOTAL budget for ALL images (stay below Express default 100KB)
const TOTAL_BUDGET_BYTES = 60 * 1024; // ~60KB total (safety margin)
// If an image must be tiny, don't go below this per-image target
const MIN_PER_IMAGE_BYTES = 8 * 1024; // 8KB
// initial resize box; if still too big we'll downscale again
const DEFAULT_MAX_W = 1000;
const DEFAULT_MAX_H = 1000;

const PHOTO_ORDER = [
  "frontFace",
  "rightSideFace",
  "leftSideFace",
  "frontHair",
  "backHair",
  "rightSideHair",
  "leftSideHair",
  "body",
];

const fallbackSections = [
  { label: "Front Face", key: "frontFace" },
  { label: "Body Area (Body Cream)", key: "bodyArea" },
];

const sampleImages: Record<string, string> = {
  frontFace: "/assets/front-face.webp",
  rightSideFace: "/assets/right-side-face.webp",
  leftSideFace: "/assets/left-side-face.jpeg",
  frontHair: "/assets/front-hair.webp",
  backHair: "/assets/back-side-hair.jpg",
  rightSideHair: "/assets/right-side-hair.webp",
  leftSideHair: "/assets/left-side-hair.jpeg",
};

/* -------------------- IMAGE COMPRESSION HELPERS -------------------- */
function dataURLByteLength(dataUrl: string): number {
  const head = "base64,";
  const i = dataUrl.indexOf(head);
  const b64 = i !== -1 ? dataUrl.slice(i + head.length) : dataUrl;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

function fitWithin(
  w: number,
  h: number,
  maxW = DEFAULT_MAX_W,
  maxH = DEFAULT_MAX_H
) {
  const ratio = Math.min(maxW / w, maxH / h, 1);
  return { w: Math.round(w * ratio), h: Math.round(h * ratio) };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    (img as any).decoding = "async";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/**
 * Compress to <= targetBytes by resizing and reducing quality.
 * Prefers WebP; falls back to JPEG if needed.
 */
async function compressToBase64UnderLimit(
  file: File,
  {
    maxW = DEFAULT_MAX_W,
    maxH = DEFAULT_MAX_H,
    targetBytes = 40 * 1024,
    mimePreferred = "image/webp",
    jpegFallback = "image/jpeg",
    startQuality = 0.8,
    minQuality = 0.4,
    step = 0.05,
    minSide = 280, // shortest side won't go below this
  } = {}
): Promise<string> {
  const img = await loadImageFromFile(file);
  const naturalW = img.naturalWidth || (img as any).width;
  const naturalH = img.naturalHeight || (img as any).height;
  const { w, h } = fitWithin(naturalW, naturalH, maxW, maxH);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  let curW = w;
  let curH = h;
  canvas.width = curW;
  canvas.height = curH;
  ctx.drawImage(img, 0, 0, curW, curH);

  const tryEncode = (mime: string, q: number) => canvas.toDataURL(mime, q);

  let q = startQuality;
  let dataUrl = tryEncode("image/webp", q);
  const usedMime = dataUrl.startsWith("data:image/webp")
    ? mimePreferred
    : jpegFallback;
  if (usedMime !== mimePreferred) dataUrl = tryEncode(usedMime, q);

  let bytes = dataURLByteLength(dataUrl);

  // reduce quality first
  while (bytes > targetBytes && q > minQuality) {
    q = +(q - step).toFixed(2);
    dataUrl = tryEncode(usedMime, q);
    bytes = dataURLByteLength(dataUrl);
  }

  // if still too big, downscale progressively (not below minSide)
  while (bytes > targetBytes && (curW > minSide || curH > minSide)) {
    const scale = 0.85; // shrink 15% per step
    curW = Math.max(minSide, Math.floor(curW * scale));
    curH = Math.max(minSide, Math.floor(curH * scale));
    canvas.width = curW;
    canvas.height = curH;
    ctx.clearRect(0, 0, curW, curH);
    ctx.drawImage(img, 0, 0, curW, curH);

    // try with current q
    dataUrl = tryEncode(usedMime, q);
    bytes = dataURLByteLength(dataUrl);

    // and step quality a bit more if needed
    while (bytes > targetBytes && q > minQuality) {
      q = +(q - step).toFixed(2);
      dataUrl = tryEncode(usedMime, q);
      bytes = dataURLByteLength(dataUrl);
    }
  }

  return dataUrl;
}

/* ------------------------------ COMPONENT ------------------------------ */

type ImageEntry = {
  base64: string | null;
  bytes: number;
};

const UploadPhotos: React.FC<UploadPhotosProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 0) Current cart items (so we can filter out removed products)
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const activeProductKeys = useMemo(
    () => new Set(cartItems.map((i) => i.name)),
    [cartItems]
  );

  // 1) Required photo keys map (productKey -> string[])
  const cartPhotosRequirement = useSelector(
    (state: RootState) => state.cartPhotosRequirement
  ) as Record<string, string[]> | undefined;

  // Keep ONLY photo keys for products that are currently in the cart
  const requiredPhotoKeys: string[] = useMemo(() => {
    if (!cartPhotosRequirement || activeProductKeys.size === 0) return [];
    const filtered = Object.entries(cartPhotosRequirement)
      .filter(([productKey]) => activeProductKeys.has(productKey))
      .flatMap(([, keys]) => keys || []);
    return Array.from(new Set(filtered.filter(Boolean)));
  }, [cartPhotosRequirement, activeProductKeys]);

  // 2) Build ordered section config from filtered keys (or fallback)
  const orderedPhotoKeys = useMemo(() => {
    const keys = [...requiredPhotoKeys];
    keys.sort((a, b) => {
      const ia = PHOTO_ORDER.indexOf(a);
      const ib = PHOTO_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return keys;
  }, [requiredPhotoKeys]);

  const sectionsConfig =
    orderedPhotoKeys.length > 0
      ? orderedPhotoKeys.map((key) => ({
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace("Hair", " Hair")
            .replace("Face", " Face")
            .replace(/\s+/, " ")
            .trim(),
          key,
        }))
      : fallbackSections;

  // 3) State — fully derived/reset when sections change (also removes stale keys)
  const blankImages = useMemo<Record<string, ImageEntry>>(
    () =>
      Object.fromEntries(
        sectionsConfig.map((s) => [s.key, { base64: null, bytes: 0 }])
      ),
    [sectionsConfig]
  );
  const blankLoading = useMemo<Record<string, boolean>>(
    () => Object.fromEntries(sectionsConfig.map((s) => [s.key, false])),
    [sectionsConfig]
  );
  const blankErrors = useMemo<Record<string, string | null>>(
    () => Object.fromEntries(sectionsConfig.map((s) => [s.key, null])),
    [sectionsConfig]
  );
  const blankOpen = useMemo<Record<string, boolean>>(
    () => Object.fromEntries(sectionsConfig.map((s, i) => [s.key, i === 0])),
    [sectionsConfig]
  );

  const [images, setImages] = useState<Record<string, ImageEntry>>(blankImages);
  const [loadingMap, setLoadingMap] =
    useState<Record<string, boolean>>(blankLoading);
  const [errorMap, setErrorMap] =
    useState<Record<string, string | null>>(blankErrors);
  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(blankOpen);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Whenever sections change (e.g., product removed), reset per-key state to drop stale keys
  useEffect(() => {
    setImages(blankImages);
    setLoadingMap(blankLoading);
    setErrorMap(blankErrors);
    setOpenSections(blankOpen);
    setGlobalError(null);
  }, [blankImages, blankLoading, blankErrors, blankOpen]);

  // Totals
  const totalUsedBytes = useMemo(
    () =>
      Object.values(images).reduce(
        (sum, v) => (v.base64 ? sum + v.bytes : sum),
        0
      ),
    [images]
  );
  const isOverBudget = totalUsedBytes > TOTAL_BUDGET_BYTES;

  useEffect(() => {
    setGlobalError(
      isOverBudget
        ? `Total photos exceed the ${Math.round(
            TOTAL_BUDGET_BYTES / 1024
          )}KB limit. Please remove or replace a photo.`
        : null
    );
  }, [isOverBudget]);

  const evenPerImageTarget = Math.floor(
    TOTAL_BUDGET_BYTES / Math.max(1, sectionsConfig.length)
  );

  const handleFileChange = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingMap((m) => ({ ...m, [type]: true }));
    setErrorMap((m) => ({ ...m, [type]: null }));

    try {
      // free bytes of existing image for this slot when replacing
      const replacingBytes = images[type]?.bytes || 0;
      const usedWithoutCurrent = totalUsedBytes - replacingBytes;
      const absoluteRemaining = TOTAL_BUDGET_BYTES - usedWithoutCurrent;

      // hard check before we do any work
      if (absoluteRemaining < MIN_PER_IMAGE_BYTES) {
        throw new Error(
          `Not enough remaining budget (${Math.max(
            0,
            Math.floor(absoluteRemaining / 1024)
          )}KB left). Remove another photo first.`
        );
      }

      // target for THIS image: don't let it hog everything
      const targetBytes = Math.max(
        MIN_PER_IMAGE_BYTES,
        Math.min(evenPerImageTarget, absoluteRemaining)
      );

      const base64Small = await compressToBase64UnderLimit(file, {
        targetBytes,
        maxW: DEFAULT_MAX_W,
        maxH: DEFAULT_MAX_H,
      });

      const bytes = dataURLByteLength(base64Small);

      // final guard — if still overflow, block and surface error
      if (usedWithoutCurrent + bytes > TOTAL_BUDGET_BYTES) {
        throw new Error(
          `This photo can't fit in the remaining budget. Available: ${Math.max(
            0,
            TOTAL_BUDGET_BYTES - usedWithoutCurrent
          )} bytes.`
        );
      }

      setImages((prev) => ({
        ...prev,
        [type]: { base64: base64Small, bytes },
      }));
    } catch (err: any) {
      setErrorMap((m) => ({
        ...m,
        [type]: err?.message || "Could not process image",
      }));
    } finally {
      setLoadingMap((m) => ({ ...m, [type]: false }));
    }
  };

  const removeImage = (type: string) => {
    setImages((prev) => ({ ...prev, [type]: { base64: null, bytes: 0 } }));
    setErrorMap((m) => ({ ...m, [type]: null }));
  };

  const allImagesUploaded =
    sectionsConfig.every(({ key }) => !!images[key]?.base64) &&
    Object.values(loadingMap).every((v) => !v);

  const handleSubmit = () => {
    if (isOverBudget) {
      setGlobalError(
        `Total photos exceed the ${Math.round(
          TOTAL_BUDGET_BYTES / 1024
        )}KB limit. Please remove or replace a photo.`
      );
      return;
    }

    const photoArray = sectionsConfig
      .map(({ key }) => images[key]?.base64)
      .filter(Boolean) as string[];

    dispatch(updateOrderDraft({ photos: photoArray }));
    onSubmit?.();
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate("/questionnaire", { state: { from: "/uploadphotos" } });
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="upload-photos-container">
      <h1 className="title">Upload Photos</h1>

      {/* Budget meter + global error */}
      <div className="mb-4 text-sm">
        <div>
          Total size:{" "}
          <strong>
            {(totalUsedBytes / 1024).toFixed(1)} KB /{" "}
            {(TOTAL_BUDGET_BYTES / 1024).toFixed(0)} KB
          </strong>
        </div>
        {globalError && (
          <div
            className="mt-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700"
            role="alert"
          >
            {globalError}
          </div>
        )}
      </div>

      <div className="photo-instructions">
        <h2>Photo Instructions</h2>
        <div className="instructions-box">
          <p>
            <span className="icon">🌞</span> Use a well-lit area
          </p>
          <p>
            <span className="icon">💧</span> Remove all makeup
          </p>
          <p>
            <span className="icon">👤</span> Follow the photo examples
          </p>
        </div>
      </div>

      <h2 className="section-title">Upload Your Photos</h2>

      {sectionsConfig.map(({ label, key }) => (
        <div className="upload-section" key={key}>
          <div className="section-header" onClick={() => toggleSection(key)}>
            <span>{label}</span>
            <span className="toggle-icon">{openSections[key] ? "−" : "+"}</span>
          </div>

          {openSections[key] && (
            <div className="photo-box">
              {/* Preview (sample or uploaded) */}
              {sampleImages[key] || images[key]?.base64 ? (
                <div className="photo-wrapper">
                  <img
                    src={images[key]?.base64 || sampleImages[key]}
                    alt={label}
                    className={`photo-preview ${
                      loadingMap[key] ? "photo-preview--loading" : ""
                    }`}
                  />
                  {loadingMap[key] && (
                    <div className="uploading-overlay">
                      <div className="spinner" />
                      <span className="uploading-text">Processing…</span>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Per-field error */}
              {errorMap[key] && (
                <p className="text-error" role="alert">
                  {errorMap[key]}
                </p>
              )}

              {/* Remove button (only if we have a user image) */}
              {images[key]?.base64 && !loadingMap[key] && (
                <button
                  className="remove-photo"
                  onClick={() => removeImage(key)}
                  title="Remove photo"
                >
                  ✕
                </button>
              )}

              {/* Add/Replace input */}
              <label className="add-photo-button">
                📷 {images[key]?.base64 ? "Replace Photo" : "Add Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(key, e)}
                  style={{ display: "none" }}
                />
              </label>

              {/* Per-photo size hint */}
              {images[key]?.base64 && (
                <div className="mt-2 text-xs text-gray-600">
                  This photo: {(images[key]!.bytes / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="action-buttons">
        <button className="back-button" onClick={handleBack}>
          BACK
        </button>
        <button
          className={`submit-button ${
            allImagesUploaded && !isOverBudget ? "submit-enabled" : ""
          }`}
          onClick={handleSubmit}
          disabled={!allImagesUploaded || isOverBudget}
          title={
            isOverBudget
              ? "Total size over limit — remove/replace a photo"
              : undefined
          }
        >
          SUBMIT PHOTOS
        </button>
      </div>
    </div>
  );
};

export default UploadPhotos;
