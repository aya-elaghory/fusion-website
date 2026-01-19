// src/pages/Questionnaire.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import {
  setAnswers as setAnswersRedux,
  setSections as setSectionsRedux,
  setPrescription,
} from "@/slices/questionsSlice";
import { updateProfile, setIncompleteVisit } from "@/slices/profileSlice";
import type { Question, Section } from "@/slices/questionsSlice";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

interface QuestionnaireProps {
  onSubmit: () => void;
  onBack: () => void;
}

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white mb-20 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-800 border-t-transparent" />
  </div>
);

const Questionnaire: React.FC<QuestionnaireProps> = ({ onSubmit, onBack }) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);

  const authEmail = useSelector((s: RootState) => s.auth.user?.email);
  const profileEmail = useSelector((s: RootState) => s.profile.profile?.email);
  const incompleteVisitRedux = useSelector(
    (s: RootState) => s.profile.profile?.incompleteVisit
  );
  const email = profileEmail || authEmail;

  const cartItems = useSelector((s: RootState) => s.cart.items) as CartItem[];
  const reduxSections = useSelector((s: RootState) => s.questionnaire.sections);
  const reduxAnswers = useSelector((s: RootState) => s.questionnaire.answers);

  const [sections, setSections] = useState<Section[]>([]);
  const [localAnswers, setLocalAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [curSection, setCurSection] = useState(0);
  const [curQuestion, setCurQuestion] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Ensure body scroll is not locked from previous modals
  useEffect(() => {
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // --- Ensure incompleteVisit = true ASAP on entering page ---
  useEffect(() => {
    if (!token || !email) return;
    if (!incompleteVisitRedux) {
      dispatch(updateProfile({ incompleteVisit: true }));
      dispatch(setIncompleteVisit(true));
    }
    // eslint-disable-next-line
  }, [token, email, incompleteVisitRedux, dispatch]);

  // Helper: set initial section/question/reviewing based on answers
  const setInitialProgress = (
    sectionsArg: Section[],
    answersArg: typeof localAnswers
  ) => {
    for (let si = 0; si < sectionsArg.length; si++) {
      const visible = sectionsArg[si].questions.filter(
        (q) =>
          !q.questionId.endsWith("Details") ||
          ["Yes", "Other"].includes(
            answersArg[sectionsArg[si].name]?.[
              q.questionId.replace("Details", "")
            ] || ""
          )
      );
      for (let qi = 0; qi < visible.length; qi++) {
        if (!answersArg[sectionsArg[si].name]?.[visible[qi].questionId]) {
          setCurSection(si);
          setCurQuestion(qi);
          setIsReviewing(false);
          setLoading(false);
          return;
        }
      }
    }
    setIsReviewing(true);
    setLoading(false);
  };

  // --- On mount, load from Redux or fetch if not present
  useEffect(() => {
    if (!token || !email) {
      navigate("/login", { replace: true });
      return;
    }

    // If both sections and answers are in Redux, use them (zero loading)
    if (
      reduxSections.length > 0 &&
      reduxAnswers &&
      Object.keys(reduxAnswers).length > 0
    ) {
      setSections(reduxSections);
      setLocalAnswers(reduxAnswers);
      setInitialProgress(reduxSections, reduxAnswers);
      return;
    }

    // If only sections are in Redux, fetch just answers
    if (reduxSections.length > 0) {
      setSections(reduxSections);
      setLoading(true);
      (async () => {
        try {
          const ansRes = await fetch(
            "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/answers",
            { headers: authHeader }
          );
          const existing = (await ansRes.json()) as Array<{
            question: string;
            answer: string;
          }>;
          const grouped: Record<string, Record<string, string>> = {};
          reduxSections.forEach((sec) => {
            sec.questions.forEach((q) => {
              const found = existing.find((e) => e.question === q._id);
              if (found) {
                grouped[sec.name] = grouped[sec.name] || {};
                grouped[sec.name][q.questionId] = found.answer;
              }
            });
          });
          setLocalAnswers(grouped);
          dispatch(setAnswersRedux(grouped));
          setInitialProgress(reduxSections, grouped);
        } catch {
          setError("Failed to load questionnaire answers.");
          setLoading(false);
        }
      })();
      return;
    }

    // --- Otherwise, fetch sections and answers ---
    setLoading(true);
    (async () => {
      try {
        await fetch(
          "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/profile",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeader },
            body: JSON.stringify({ incompleteVisit: true }),
          }
        );
        const [piRes, mhRes] = await Promise.all([
          fetch(
            "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/questions?category=personal",
            { headers: authHeader }
          ),
          fetch(
            "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/questions?category=medical",
            { headers: authHeader }
          ),
        ]);
        const personalQs = (await piRes.json()) as Question[];
        const medicalQs = (await mhRes.json()) as Question[];
        const perProdQs = await Promise.all(
          cartItems.map((item) =>
            fetch(
              `https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/questions?productKey=${encodeURIComponent(
                item.name
              )}`,
              { headers: authHeader }
            ).then((r) => r.json() as Promise<Question[]>)
          )
        );
        const secs: Section[] = [
          { name: "Personal Information", questions: personalQs },
          { name: "Medical History", questions: medicalQs },
          ...cartItems.map((it, idx) => ({
            name: it.name,
            questions: perProdQs[idx],
          })),
        ];
        setSections(secs);
        dispatch(setSectionsRedux(secs));

        // Fetch existing answers
        const ansRes = await fetch(
          "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/answers",
          { headers: authHeader }
        );
        const existing = (await ansRes.json()) as Array<{
          question: string;
          answer: string;
        }>;
        const grouped: Record<string, Record<string, string>> = {};
        secs.forEach((sec) => {
          sec.questions.forEach((q) => {
            const found = existing.find((e) => e.question === q._id);
            if (found) {
              grouped[sec.name] = grouped[sec.name] || {};
              grouped[sec.name][q.questionId] = found.answer;
            }
          });
        });
        setLocalAnswers(grouped);
        dispatch(setAnswersRedux(grouped));
        setInitialProgress(secs, grouped);
      } catch {
        setError("Failed to load questionnaire.");
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [
    token,
    email,
    cartItems,
    navigate,
    reduxAnswers,
    reduxSections,
    dispatch,
  ]);

  const shouldShow = (q: Question, secName: string) => {
    if (q.questionId.endsWith("Details")) {
      const base = q.questionId.replace("Details", "");
      const ans = localAnswers[secName]?.[base];
      return ans === "Yes" || ans === "Other";
    }
    return true;
  };

  const visibleQs = useMemo(() => {
    const sec = sections[curSection];
    return sec ? sec.questions.filter((q) => shouldShow(q, sec.name)) : [];
  }, [sections, curSection, localAnswers]);

  const q = visibleQs[curQuestion];
  const totalVisible = sections.reduce(
    (sum, sec) =>
      sum + sec.questions.filter((q) => shouldShow(q, sec.name)).length,
    0
  );
  const currentNumber =
    sections
      .slice(0, curSection)
      .reduce(
        (s, sec) =>
          s +
          sec.questions.filter((q) => shouldShow(q, sections[curSection]?.name))
            .length,
        0
      ) +
    curQuestion +
    1;

  const saveAnswer = async (question: Question, value: string) => {
    const isOver18Question =
      question.questionId === "over18" ||
      question.questionText === "Are you at least 18 years old?";
    if (isOver18Question && value === "No") {
      setError("You must be at least 18 years old to proceed.");
      return false;
    }
    try {
      const res = await fetch(
        "https://aa07b5fe-b7d5-4e5c-b535-201a63d8412b-00-2bmq3x82ztooe.picard.replit.dev/api/answers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify([{ questionId: question._id, answer: value }]),
        }
      );
      if (!res.ok) throw new Error();
      setLocalAnswers((prev) => ({
        ...prev,
        [sections[curSection].name]: {
          ...prev[sections[curSection].name],
          [question.questionId]: value,
        },
      }));
      dispatch(
        setAnswersRedux({
          ...localAnswers,
          [sections[curSection].name]: {
            ...localAnswers[sections[curSection].name],
            [question.questionId]: value,
          },
        })
      );
      return true;
    } catch {
      setError("Failed to save answer.");
      return false;
    }
  };

  const handleNext = async () => {
    setError(null);
    if (!q) return;
    const secName = sections[curSection].name;
    const val = localAnswers[secName]?.[q.questionId];
    if (!val) return setError("Please answer before proceeding.");
    if (!(await saveAnswer(q, val))) return;
    if (curQuestion + 1 < visibleQs.length) setCurQuestion((c) => c + 1);
    else if (curSection + 1 < sections.length) {
      setCurSection((s) => s + 1);
      setCurQuestion(0);
    } else setIsReviewing(true);
  };

  const handlePrev = () => {
    setError(null);
    if (isReviewing) {
      setIsReviewing(false);
      setCurSection(sections.length - 1);
      setCurQuestion(visibleQs.length - 1);
    } else if (curQuestion > 0) setCurQuestion((c) => c - 1);
    else if (curSection > 0) {
      setCurSection((s) => s - 1);
      setCurQuestion(
        sections[curSection - 1].questions.filter((q) =>
          shouldShow(q, sections[curSection - 1].name)
        ).length - 1
      );
    } else onBack();
  };

  const handleConfirm = async () => {
    if (!hasConsented) return setError("You must consent to proceed.");
    onSubmit();
    navigate("/uploadphotos");
  };

  if (loading) return <LoadingScreen />;

  // --- Scrollable only on body, not inside any container ---
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-16">
      <div className="max-w-2xl mx-auto p-4 sm:p-8 pt-28">
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {isReviewing ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-green-800 border-b border-gray-200 pb-2">
              Review Your Answers
            </h2>
            <div className="grid gap-6">
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
                      if (
                        qq.questionId.endsWith("Details") &&
                        !["Yes", "Other"].includes(
                          localAnswers[sec.name]?.[
                            qq.questionId.replace("Details", "")
                          ] || ""
                        )
                      )
                        return null;
                      const ans =
                        localAnswers[sec.name]?.[qq.questionId] || "-";
                      const isOver18 =
                        qq.questionId === "over18" ||
                        qq.questionText === "Are you at least 18 years old?";
                      return (
                        <div key={qi} className="flex items-start space-x-4">
                          <div className="flex-1">
                            <dt className="font-extrabold text-lg mb-1">
                              {qq.questionText}
                            </dt>
                            <dd className="text-gray-700 mb-2">{ans}</dd>
                            {!isOver18 && (
                              <button
                                onClick={() => {
                                  setIsReviewing(false);
                                  setCurSection(si);
                                  setCurQuestion(qi);
                                }}
                                className="text-sm text-green-700 hover:underline"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              ))}
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-sm">
                I agree to the Privacy Policy, Terms & Telehealth Consent.
              </span>
            </label>
            <button
              className={`w-full py-2 text-white rounded ${
                hasConsented
                  ? "bg-green-800 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasConsented}
              onClick={handleConfirm}
            >
              Confirm & Continue
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center">
              {sections[curSection]?.name}
            </h2>
            <p className="text-center text-gray-600 mb-3">
              Question {currentNumber} of {totalVisible}
            </p>
            {q ? (
              <div className="bg-white p-4 rounded shadow-sm space-y-4">
                <p className="font-extrabold text-lg">{q.questionText}</p>
                {q.type === "radio" &&
                  q.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={opt}
                        checked={
                          localAnswers[sections[curSection].name]?.[
                            q.questionId
                          ] === opt
                        }
                        onChange={() => {
                          setLocalAnswers((prev) => ({
                            ...prev,
                            [sections[curSection].name]: {
                              ...prev[sections[curSection].name],
                              [q.questionId]: opt,
                            },
                          }));
                          setError(null);
                        }}
                        className="form-radio"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                {q.type === "text" && (
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 p-2 rounded"
                    value={
                      localAnswers[sections[curSection].name]?.[q.questionId] ||
                      ""
                    }
                    onChange={(e) => {
                      setLocalAnswers((prev) => ({
                        ...prev,
                        [sections[curSection].name]: {
                          ...prev[sections[curSection].name],
                          [q.questionId]: e.target.value,
                        },
                      }));
                      setError(null);
                    }}
                  />
                )}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No question available.
              </p>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-white border border-green-700 text-green-700 rounded hover:bg-green-50"
                onClick={handlePrev}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
