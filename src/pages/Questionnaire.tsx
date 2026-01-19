// src/pages/Questionnaire.tsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchQuestions } from "@/slices/questionsSlice";
import {
  fetchAnswers,
  setAnswer,
  syncDirtyAnswersToDB,
} from "@/slices/answersSlice";
import { updateCartPhotoRequirements } from "@/slices/cartPhotosRequirementSlice";

// Always get cart from redux
const useCartItems = () => useSelector((state: RootState) => state.cart.items);

// Helper: get answer value from Redux answers
const getAnswer = (answers: any[], questionId: string) => {
  const found = answers.find((a) => a.question === questionId);
  return found ? found.answer : "";
};

interface LocalQA {
  [questionId: string]: string;
}

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useCartItems();
  const { sections, loading: qLoading } = useSelector(
    (s: RootState) => s.questions
  );
  const { answers, loading: aLoading } = useSelector(
    (s: RootState) => s.answers
  );
  // Get required photo keys from cartPhotosRequirement slice
  const cartPhotosRequirement = useSelector(
    (state: RootState) => state.cartPhotosRequirement
  );

  // Signature of cart product mix (names) so we refetch when product list changes
  const productMixSig = useMemo(
    () =>
      cartItems
        .map((i) => i.name)
        .sort()
        .join("|"),
    [cartItems]
  );

  // State
  const [stepList, setStepList] = useState<
    { sectionIdx: number; questionIdx: number }[]
  >([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<LocalQA>({});
  const [detailsValue, setDetailsValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isReview, setIsReview] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const reviewTriggered = useRef(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Fetch questions/answers on mount if needed
  useEffect(() => {
    if (!sections.length && cartItems.length) {
      dispatch(fetchQuestions({ cartItems })); // cartItems from Redux
    }
    if (!answers.length) dispatch(fetchAnswers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch questions whenever product mix changes (add/remove)
  useEffect(() => {
    dispatch(fetchQuestions({ cartItems }));
  }, [dispatch, productMixSig]); // cartItems intentionally omitted

  // Build step list from sections
  useEffect(() => {
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      setStepList([]);
      return;
    }
    const list: { sectionIdx: number; questionIdx: number }[] = [];
    sections.forEach((section, sectionIdx) => {
      const qs = section?.questions || [];
      for (let qIdx = 0; qIdx < qs.length; qIdx++) {
        list.push({ sectionIdx, questionIdx: qIdx });
      }
    });
    setStepList(list);
  }, [sections]);

  // Clamp stepIdx if stepList shrinks (e.g., after removing a product)
  useEffect(() => {
    if (stepList.length === 0) return;
    if (stepIdx >= stepList.length) {
      setStepIdx(stepList.length - 1);
    }
  }, [stepList.length, stepIdx]);

  // Reset wizard state when sections change so we recompute the first-unanswered step
  useEffect(() => {
    setInitialCheckDone(false);
    setIsReview(false);
    setStepIdx(0);
    setLocalAnswers({});
    setDetailsValue("");
    setError(null);
    reviewTriggered.current = false;
  }, [sections]);

  // Check if all answered, and jump to first unanswered
  useEffect(() => {
    if (!sections.length || !stepList.length || initialCheckDone) return;
    const _local: LocalQA = {};
    let firstUnanswered = -1;
    for (let i = 0; i < stepList.length; i++) {
      const pos = stepList[i];
      const sec = sections[pos.sectionIdx];
      const q = sec?.questions?.[pos.questionIdx];
      const qid = q?.questionId;
      if (qid) {
        const val = getAnswer(answers, qid);
        _local[qid] = val;
        if (!val && firstUnanswered === -1) firstUnanswered = i;
      }
    }
    setLocalAnswers(_local);
    setInitialCheckDone(true);
    if (firstUnanswered === -1) {
      setIsReview(true);
    } else {
      setStepIdx(firstUnanswered);
    }
  }, [sections, answers, stepList, initialCheckDone]);

  // Only pull from Redux on first mount for each step
  useEffect(() => {
    if (!stepList.length || !initialCheckDone) return;

    const current = stepList[stepIdx];
    const sec = current ? sections[current.sectionIdx] : undefined;
    const q = sec?.questions?.[current?.questionIdx ?? 0];

    if (!q) return; // mid-update guard

    setLocalAnswers((prev) => {
      if (prev[q.questionId] !== undefined) return prev;
      return {
        ...prev,
        [q.questionId]: getAnswer(answers, q.questionId) || "",
      };
    });

    // If details, parse on mount
    if (q.detailsQuestion && localAnswers[q.questionId] === undefined) {
      const composite = getAnswer(answers, q.questionId) || "";
      const val = composite.split(", ").slice(1).join(", ");
      setDetailsValue(val || "");
    }

    setError(null);
    // eslint-disable-next-line
  }, [stepIdx, stepList, sections, initialCheckDone]);

  // Save all answers to DB on review/unmount only
  useEffect(() => {
    const syncToDB = async () => {
      await dispatch(syncDirtyAnswersToDB());
    };
    if (isReview && !reviewTriggered.current) {
      syncToDB();
      reviewTriggered.current = true;
    }
    return () => {
      if (!reviewTriggered.current) syncToDB();
    };
    // eslint-disable-next-line
  }, [isReview, dispatch]);

  useEffect(() => {
    if (isReview) {
      dispatch(updateCartPhotoRequirements());
    }
  }, [isReview, dispatch]);

  // Helper to flatten all required keys
  const getAllPhotoKeys = (): string[] => {
    if (!cartPhotosRequirement) return [];
    return [
      ...new Set(
        Object.values(cartPhotosRequirement || {})
          .flat()
          .filter(Boolean)
      ),
    ];
  };

  // ---------- UI gates ----------
  if (qLoading || aLoading || !initialCheckDone)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-800 border-t-transparent" />
      </div>
    );

  if (!sections.length || !stepList.length)
    return <div className="text-center py-16">No questions available.</div>;

  // If all answered, show review
  if (isReview) {
    reviewTriggered.current = true;

    const allPhotoKeys = getAllPhotoKeys();

    const handleConfirmAndContinue = () => {
      if (allPhotoKeys.length === 0) {
        navigate("/checkout");
      } else {
        navigate("/uploadphotos");
      }
    };

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 mt-28">
        <h2 className="text-3xl font-semibold text-center text-green-800 border-b border-gray-200 pb-2">
          Review Your Answers
        </h2>
        <div className="grid gap-6 mt-6">
          {sections.map((sec, si) => (
            <div
              key={si}
              className="relative bg-white p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2 pb-1 border-b border-gray-200">
                {sec.name}
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {sec.questions.map((qq, qi) => {
                  const ans = localAnswers[qq.questionId] || "-";
                  return (
                    <div key={qi} className="flex items-start space-x-4">
                      <div className="flex-1">
                        <dt className="font-extrabold text-lg mb-1">
                          {qq.questionText}
                        </dt>
                        <dd className="text-gray-700 mb-2">{ans}</dd>
                        <button
                          onClick={() => {
                            let flatIdx = 0;
                            outer: for (
                              let si2 = 0;
                              si2 < sections.length;
                              si2++
                            ) {
                              for (
                                let qi2 = 0;
                                qi2 < sections[si2].questions.length;
                                qi2++
                              ) {
                                const qqq = sections[si2].questions[qi2];
                                if (qqq.questionId === qq.questionId) {
                                  setStepIdx(flatIdx);
                                  setIsReview(false);
                                  break outer;
                                }
                                flatIdx++;
                              }
                            }
                          }}
                          className="text-sm text-green-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        {/* Consent with external links */}
        <label className="flex items-start gap-2 mt-8">
          <input
            type="checkbox"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
            className="mt-1.5 h-4 w-4"
          />
          <span className="text-sm leading-6">
            I agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline hover:text-green-800"
            >
              Privacy Policy
            </a>
            ,{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline hover:text-green-800"
            >
              Terms &amp; Conditions
            </a>
            , and Telehealth Consent.
          </span>
        </label>

        <button
          className={`w-full py-2 mt-4 text-white rounded ${
            hasConsented
              ? "bg-green-800 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasConsented}
          onClick={handleConfirmAndContinue}
        >
          Confirm & Continue
        </button>
      </div>
    );
  }

  // ---------- SAFE current step extraction ----------
  const current = stepList[stepIdx];
  const section = current ? sections[current.sectionIdx] : undefined;
  const q = section?.questions?.[current?.questionIdx ?? 0];

  // If anything is missing because we're mid-update, show a tiny loader instead of crashing
  if (!current || !section || !q) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-800 border-t-transparent" />
      </div>
    );
  }

  // Show details field logic
  const showDetails =
    !!q.detailsQuestion &&
    q.options &&
    q.options.some((opt) => opt === (localAnswers[q.questionId] || "")) &&
    q.detailsQuestion.showIf.includes(localAnswers[q.questionId] || "");

  const canGoNext =
    !!localAnswers[q.questionId] && (!showDetails ? true : !!detailsValue);

  // Next
  const handleNext = () => {
    setError(null);
    // Save answer in Redux only!
    let answerToSave = localAnswers[q.questionId];
    if (showDetails && detailsValue) {
      answerToSave = `${localAnswers[q.questionId]}, ${detailsValue}`;
    }
    dispatch(setAnswer({ questionId: q.questionId, answer: answerToSave }));
    setLocalAnswers((prev) => ({
      ...prev,
      [q.questionId]: answerToSave,
    }));
    setDetailsValue("");
    if (stepIdx + 1 < stepList.length) setStepIdx((idx) => idx + 1);
    else setIsReview(true);
  };

  // Prev
  const handlePrev = () => {
    setError(null);
    setStepIdx((idx) => Math.max(0, idx - 1));
    setDetailsValue("");
  };

  return (
    <form
      className="max-w-xl mx-auto space-y-10 py-6 mt-28"
      onSubmit={(e) => {
        e.preventDefault();
        if (canGoNext) handleNext();
      }}
    >
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{section.name}</h2>
          <span className="text-sm text-gray-500">
            Question {stepIdx + 1} of {stepList.length}
          </span>
        </div>
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <label className="block font-medium mb-2">{q.questionText}</label>
        {q.type === "radio" ? (
          <div className="flex flex-wrap gap-4">
            {(q.options || []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={q.questionId}
                  value={opt}
                  checked={localAnswers[q.questionId] === opt}
                  onChange={() => {
                    setLocalAnswers((prev) => ({
                      ...prev,
                      [q.questionId]: opt,
                    }));
                    setDetailsValue("");
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="border rounded px-3 py-2 w-full mt-1"
            value={localAnswers[q.questionId] || ""}
            onChange={(e) =>
              setLocalAnswers((prev) => ({
                ...prev,
                [q.questionId]: e.target.value,
              }))
            }
            autoFocus
          />
        )}
        {showDetails && (
          <div className="mt-4 pl-6 border-l-4 border-green-200">
            <label className="block font-medium mb-2">
              {q.detailsQuestion?.questionText}
            </label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full mt-1"
              value={detailsValue}
              onChange={(e) => setDetailsValue(e.target.value)}
              autoFocus
            />
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIdx === 0}
            className={`px-6 py-2 rounded bg-gray-200 text-gray-700 font-medium ${
              stepIdx === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={!canGoNext}
            className={`px-6 py-2 rounded bg-green-700 text-white font-medium ${
              !canGoNext
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Questionnaire;
