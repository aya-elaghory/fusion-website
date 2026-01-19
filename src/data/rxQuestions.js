// src/data/rxQuestions.js
export const personalInfoQuestions = [
  {
    id: "ageConsent",
    question: "Are you at least 18 years old?",
    type: "radio",
    options: ["Yes, I am over 18", "No, I am under 18"],
  },
  {
    id: "biologicalSex",
    question: "What is your biological sex?",
    type: "radio",
    options: ["Male", "Female", "Other"],
  },
  {
    id: "ethnicity",
    question: "What is your ethnicity?",
    type: "radio",
    options: [
      "Asian",
      "Black or African American",
      "Hispanic or Latino",
      "White",
      "Other",
    ],
  },
  {
    id: "ethnicityDetails",
    question: "Please specify your ethnicity if you selected 'Other'.",
    type: "text",
  },
];

export const rxQuestions = {
  "Topical Cream HQ8": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream HQ8 to address?",
      type: "radio",
      options: ["Hyperpigmentation", "Melasma", "Acne", "Wrinkles", "Redness"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream HQ8?",
      type: "radio",
      options: ["Full Face", "Forehead", "Cheeks", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "severity",
      question: "How severe is your primary concern?",
      type: "radio",
      options: ["Mild", "Moderate", "Severe"],
    },
  ],
  "Topical Cream HQ4": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream HQ4 to address?",
      type: "radio",
      options: ["Hyperpigmentation", "Melasma", "Acne", "Irritation", "Wrinkles"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream HQ4?",
      type: "radio",
      options: ["Full Face", "Forehead", "Cheeks", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "sensitivity",
      question: "Do you have sensitive skin?",
      type: "radio",
      options: ["Yes", "No"],
    },
  ],
  "Topical Cream HQ6 Silicone Base": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream HQ6 Silicone Base to address?",
      type: "radio",
      options: ["Hyperpigmentation", "Melasma", "Acne", "Scars"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream HQ6 Silicone Base?",
      type: "radio",
      options: ["Full Face", "Scars Only", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "scarAge",
      question: "How old are the scars you’re treating?",
      type: "radio",
      options: ["Less than 6 months", "6-12 months", "Over 1 year"],
    },
  ],
  "Topical Cream Scar 1": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream Scar 1 to address?",
      type: "radio",
      options: ["Scars", "Wrinkles", "Redness"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream Scar 1?",
      type: "radio",
      options: ["Face", "Body", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "scarAge",
      question: "How old are the scars you’re treating?",
      type: "radio",
      options: ["Less than 6 months", "6-12 months", "Over 1 year"],
    },
    {
      id: "frequency",
      question: "How often do you plan to use this product?",
      type: "radio",
      options: ["Daily", "Twice Daily", "As Needed"],
    },
  ],
  "Topical Cream Scar 2": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream Scar 2 to address?",
      type: "radio",
      options: ["Scars", "Infections", "Redness"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream Scar 2?",
      type: "radio",
      options: ["Face", "Body", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "scarStatus",
      question: "Is the scar fresh or healed?",
      type: "radio",
      options: ["Fresh (less than 1 month)", "Healed (over 1 month)"],
    },
  ],
  "Topical Cream Scar 3 - Keloid Scars": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream Scar 3 to address?",
      type: "radio",
      options: ["Keloid Scars", "Hypertrophic Scars", "Itching", "Pain"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream Scar 3?",
      type: "radio",
      options: ["Face", "Chest", "Back", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "keloidSize",
      question: "How large is the keloid scar?",
      type: "radio",
      options: ["Small (less than 1 cm)", "Medium (1-3 cm)", "Large (over 3 cm)"],
    },
  ],
  "Serum VCS 30mL": [
    {
      id: "issue",
      question: "Which issue do you primarily want Serum VCS 30mL to address?",
      type: "radio",
      options: ["Dull Skin", "Uneven Skin Tone", "Fine Lines", "Dryness", "Hyperpigmentation"],
    },
    {
      id: "area",
      question: "What area are you treating with Serum VCS 30mL?",
      type: "radio",
      options: ["Full Face", "Neck", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "frequency",
      question: "How often do you plan to use this product?",
      type: "radio",
      options: ["Daily", "Every Other Day", "As Needed"],
    },
    {
      id: "sensitivity",
      question: "Do you have sensitive skin?",
      type: "radio",
      options: ["Yes", "No"],
    },
  ],
  "Topical Cream INT 30g/50g": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream INT to address?",
      type: "radio",
      options: ["Hyperpigmentation", "Melasma", "Dryness", "Uneven Texture"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream INT?",
      type: "radio",
      options: ["Full Face", "Body", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "drynessSeverity",
      question: "How severe is your skin dryness?",
      type: "radio",
      options: ["Mild", "Moderate", "Severe"],
    },
  ],
  "Topical Cream 130g": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream 130g to address?",
      type: "radio",
      options: ["Hyperpigmentation", "Acne", "Uneven Texture", "Dryness", "Redness"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream 130g?",
      type: "radio",
      options: ["Full Face", "Body", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "frequency",
      question: "How often do you plan to use this product?",
      type: "radio",
      options: ["Daily", "Every Other Day", "As Needed"],
    },
    {
      id: "sensitivity",
      question: "Do you have sensitive skin?",
      type: "radio",
      options: ["Yes", "No"],
    },
  ],
  "Topical Cream UE 15g": [
    {
      id: "issue",
      question: "Which issue do you primarily want Topical Cream UE 15g to address?",
      type: "radio",
      options: ["Puffiness", "Dark Circles", "Fine Lines", "Bruising"],
    },
    {
      id: "area",
      question: "What area are you treating with Topical Cream UE 15g?",
      type: "radio",
      options: ["Under Eyes", "Around Eyes", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "frequency",
      question: "How often do you plan to use this product?",
      type: "radio",
      options: ["Daily", "Twice Daily", "As Needed"],
    },
    {
      id: "severity",
      question: "How severe are your under-eye concerns?",
      type: "radio",
      options: ["Mild", "Moderate", "Severe"],
    },
  ],
  "Solution HLM1 50mL": [
    {
      id: "issue",
      question: "Which issue do you primarily want Solution HLM1 to address?",
      type: "radio",
      options: ["Hair Loss", "Scalp Inflammation", "Thinning Hair"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What scalp area are you treating with Solution HLM1?",
      type: "radio",
      options: ["Crown", "Hairline", "Entire Scalp", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "hairLossDuration",
      question: "How long have you experienced hair loss?",
      type: "radio",
      options: ["Less than 6 months", "6-12 months", "Over 1 year"],
    },
  ],
  "Solution HLM2 50mL": [
    {
      id: "issue",
      question: "Which issue do you primarily want Solution HLM2 to address?",
      type: "radio",
      options: ["Hair Loss", "Dandruff", "Seborrheic Dermatitis", "Thinning Hair"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What scalp area are you treating with Solution HLM2?",
      type: "radio",
      options: ["Crown", "Hairline", "Entire Scalp", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "dandruffSeverity",
      question: "How severe is your dandruff or scalp condition?",
      type: "radio",
      options: ["Mild", "Moderate", "Severe"],
    },
  ],
  "Solution HLF1 50mL": [
    {
      id: "issue",
      question: "Which issue do you primarily want Solution HLF1 to address?",
      type: "radio",
      options: ["Hair Loss", "Scalp Irritation", "Thinning Hair"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What scalp area are you treating with Solution HLF1?",
      type: "radio",
      options: ["Crown", "Hairline", "Entire Scalp", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "hormonalFactors",
      question: "Do you suspect hormonal factors are contributing to your hair loss?",
      type: "radio",
      options: ["Yes", "No", "Not sure"],
    },
  ],
  "Solution HLF2 50mL": [
    {
      id: "issue",
      question: "Which issue do you primarily want Solution HLF2 to address?",
      type: "radio",
      options: ["Hair Loss", "Dandruff", "Seborrheic Dermatitis", "Thinning Hair"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What scalp area are you treating with Solution HLF2?",
      type: "radio",
      options: ["Crown", "Hairline", "Entire Scalp", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "scalpHealth",
      question: "Do you experience scalp flaking or itching?",
      type: "radio",
      options: ["Yes", "No"],
    },
  ],
  "The Spot Cream": [
    {
      id: "issue",
      question: "Which issue do you primarily want The Spot Cream to address?",
      type: "radio",
      options: ["Brown Spots", "Hyperpigmentation", "Melasma", "Acne Pigmentation"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "Is The Spot Cream for your full face or specific spot?",
      type: "radio",
      options: ["Full Face", "Forehead", "Cheeks", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "formula",
      question: "Do you have any formula preference? *Your dermatologist will make the final call.",
      type: "radio",
      options: ["Let my doctor decide what's best", "Hydroquinone 4%", "Tretinoin 0.025%"],
    },
  ],
  "The Body Cream": [
    {
      id: "issue",
      question: "Which issue do you primarily want The Body Cream to address?",
      type: "radio",
      options: ["Sun Damage", "Dryness", "Eczema", "Hyperpigmentation"],
    },
    {
      id: "dermatologist",
      question: "Has a dermatologist seen you for this issue?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: "area",
      question: "What area do you intend to treat with The Body Cream?",
      type: "radio",
      options: ["Back", "Arms", "Legs", "Other"],
    },
    {
      id: "areaDetails",
      question: "Please specify the area if you selected 'Other'.",
      type: "text",
    },
    {
      id: "formula",
      question: "Do you have any formula preference? *Your dermatologist will make the final call.",
      type: "radio",
      options: ["Let my doctor decide what's best", "Tretinoin 0.01%", "Hydrocortisone 1%"],
    },
  ],
};

export const medicalHistoryQuestions = [
  {
    id: "medicalConditions",
    question: "Do you have any medical conditions that your provider should know of?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "medicalConditionsDetails",
    question: "If yes, please specify your medical conditions.",
    type: "text",
  },
  {
    id: "medications",
    question: "Do you currently take medications (oral or topical) or supplement(s) (ex: Birth control, tranexamic acid, etc.)?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "medicationsDetails",
    question: "If yes, please list your medications or supplements.",
    type: "text",
  },
  {
    id: "skinIssues",
    question: "Do you experience any of the following skin issues (ex: acne, rosacea, perioral dermatitis, sensitive skin, eczema, skin cancer, etc.)?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "skinIssuesDetails",
    question: "If yes, please specify your skin issues.",
    type: "text",
  },
  {
    id: "allergies",
    question: "Do you have any known skin or drug allergies?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "allergiesDetails",
    question: "If yes, please list your allergies.",
    type: "text",
  },
  {
    id: "pregnancy",
    question: "Are you currently nursing or pregnant?",
    type: "radio",
    options: ["I'm not currently nursing or pregnant", "Yes, I am nursing", "Yes, I am pregnant"],
  },
];