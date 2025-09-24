export interface AddPatientForm {
  fullname: string;
  sex: string;
  ethnicity: string;
  age: string;
  bmi: string;
  height?: string;
  weight?: string;
  surgeonid?: string;
}

export const Sex: Record<string, string> = {
  0: "Male",
  1: "Female",
};

export const Age = {
  0: "Below 65 years",
  1: "65 years and above",
};

export const Ethnicity: Record<string, string> = {
  0: "Chinese",
  1: "Malay",
  2: "Indian",
  3: "Caucasian",
  4: "Others"
};

export const BMI = {
  0: "Normal/Underweight (< 25)",
  1: "Overweight/Obese (>= 25)",
};

export const SurgeonTitle: Record<string, string> = {
  AC: "Associate Consultant",
  C: "Consultant",
  AP: "Associate Professor",
  P: "Professor",
  O: "Other",
};

export type FilterType = {
  age?: { range: number };
  bmi?: { range: number };
  categories: string[];
};
export const FunctionWalking = {
  0: "Unlimited",
  1: ">2 bus-stops",
  2: "1-2 bus-stops ",
  3: "1 bus-stop",
  4: "Housebound",
  5: "Unable",
};

export const FunctionStairs = {
  0: "Normal up and down",
  1: "Normal up and down with rail",
  2: "Up and down with rail",
  3: "Up with rail, down unable ",
  4: "Unable",
};

export const Pain = {
  0: "None ",
  1: "Mild / Occasional",
  2: "Mild (Stairs only)",
  3: "Mild (Walking and Stairs)",
  4: "Moderate -Occasional",
  5: "Moderate -Occasional",
  6: "Severe",
};

export const Mobility = {
  0: "I have no problems in walking about",
  1: "I have slight problems in walking about",
  2: "I have moderate problems in walking about",
  3: "I have severe problems in walking about",
  4: "I am unable to walk",
};
  
export const SelfCare = {
  0: "I have no problems in washing or dressing myself",
  1: "I have slight problems in washing or dressing myself",
  2: "I have moderate problems in washing or dressing myself",
  3: "I have severe problems in washing or dressing myself",
  4: "I am unable to wash or dress myself",
};

export const UsualActivities = {
  0: "I have no problems in doing my usual activities",
  1: "I have slight problems in doing my usual activities",
  2: "I have moderate problems in doing my usual activities",
  3: "I have severe problems in doing my usual activities",
  4: "I am unable to do my usual activities",
};

export const PainDiscomfort = {
  0: "I have no pain or discomfort",
  1: "I have slight pain or discomfort",
  2: "I have moderate pain or discomfort",
  3: "I have severe pain or discomfort",
  4: "I have extreme pain or discomfort",
};

export const AnxietyDepression = {
  0: "I am not anxious or depressed",
  1: "I am slightly anxious or depressed",
  2: "I am moderately anxious or depressed",
  3: "I am severely anxious or depressed",
  4: "I am extremely anxious or depressed",
};

export const OKSKneePain = {
  0: "None",
  1: "Very mild",
  2: "Mild",
  3: "Moderate",
  4: "Severe",
};

export const OKSKneeTrouble = {
  0: "No trouble at all",
  1: "Very little trouble",
  2: "Moderate trouble",
  3: "Extreme difficulty",
  4: "Impossible to do",
};

export const OKSWalking = {
  0: "No pain/More than 30 mins",
  1: "16-30 mins",
  2: "5-15 mins",
  3: "Around the house only",
  4: "Not at all/Pain severe when walking",
};

export const OKSStanding = {
  0: "Not at all painful",
  1: "Slightly painful",
  2: "Moderately painful",
  3: "Very painful",
  4: "Unbearable",
};

export const OKSFrequency = {
  0: "Rarely/Never",
  1: "Sometimes, just at first",
  2: "Often, not just at first",
  3: "Most of the time",
  4: "All of the time",
};

export const OKSEase = {
  0: "Yes, easily",
  1: "With little difficulty",
  2: "With moderate difficulty",
  3: "With extreme difficulty",
  4: "No, impossible",
};

export const OKSNightPain = {
  0: "No nights",
  1: "Only 1 or 2 nights",
  2: "Some nights",
  3: "Most nights",
  4: "Every night",
};

export const OKSWorkInterference = {
  0: "Not at all",
  1: "A little bit",
  2: "Moderately",
  3: "Greatly",
  4: "Totally",
};

export const OtherOptions = {
  0: "None",
  1: "Slight",
  2: "Moderate",
  3: "Severe",
  4: "Extreme",
};

export const TopFiveAreas = {
  0: "Mobility",
  1: "Self-care",
  2: "Usual Activities",
  3: "Pain/Discomfort",
  4: "Anxiety/Depression",
};

export const AllOptions = [
  "KFS",        // Function stairs
  "KFW",        // Function walking
  "KPAIN",      // Knee pain overall
  "EQ5D-MOB",   // Mobility
  "EQ5D-SC",    // Self-care
  "EQ5D-UA",    // Usual activities
  "EQ5D-PD",    // Pain/discomfort
  "EQ5D-AD",    // Anxiety/depression
  "OKS1",
  "OKS2",
  "OKS3",
  "OKS4",
  "OKS5",
  "OKS6",
  "OKS7",
  "OKS8",
  "OKS9",
  "OKS10",
  "OKS11",
  "OKS12",
] as const; // Use `as const` to make the array readonly and infer literal types

export type AllOptionsType = (typeof AllOptions)[number]; // Create a union type from the array

// Human-readable names (labels for UI)
export const AllOptionNames = [
  "Function stairs",
  "Function walking",
  "Knee pain overall",
  "EQ-5D: Mobility",
  "EQ-5D: Self-care",
  "EQ-5D: Usual activities",
  "EQ-5D: Pain/discomfort",
  "EQ-5D: Anxiety/depression",
  "How would you describe the pain you usually have from your knee?",
  "Have you had any trouble with washing and drying yourself (all over) because of your knee?",
  "Have you had any trouble getting in and out of a car or using public transport because of your knee? (whichever you tend to use)",
  "For how long have you been able to walk before pain from your knee becomes severe? (with or without a stick)",
  "After a meal (sat at a table), how painful has it been for you to stand up from a chair because of your knee?",
  "Have you been limping when walking, because of your knee?",
  "Could you kneel down and get up again afterwards?",
  "Have you been troubled by pain from your knee in bed at night?",
  "How much has pain from your knee interfered with your usual work (including housework)?",
  "Have you felt that your knee might suddenly 'give way' or let you down?",
  "Could you do the household shopping on your own?",
  "Could you walk down one flight of stairs?",
] as const;

export type AllOptionNamesType = (typeof AllOptionNames)[number];

// Question type
export type QuestionType = {
  id: number;
  code: AllOptionsType;    // match DB code
  question: string;        // display text
  list: Record<number, string>; // Likert or option scale
};

// Actual questions list aligned with DB
export const Questions: QuestionType[] = [
  { id: 1, code: "KFS", question: "Function stairs", list: FunctionStairs },
  { id: 2, code: "KFW", question: "Function walking", list: FunctionWalking },
  { id: 3, code: "KPAIN", question: "Knee pain overall", list: Pain },
  { id: 4, code: "EQ5D-MOB", question: "Mobility", list: Mobility },
  { id: 5, code: "EQ5D-SC", question: "Self-care", list: SelfCare },
  { id: 6, code: "EQ5D-UA", question: "Usual activities", list: UsualActivities },
  { id: 7, code: "EQ5D-PD", question: "Pain/discomfort", list: PainDiscomfort },
  { id: 8, code: "EQ5D-AD", question: "Anxiety/depression", list: AnxietyDepression },
  { id: 9, code: "OKS1", question: "How would you describe the pain you usually have from your knee?", list: OKSKneePain },
  { id: 10, code: "OKS2", question: "Have you had any trouble with washing and drying yourself (all over) because of your knee?", list: OKSKneeTrouble },
  { id: 11, code: "OKS3", question: "Have you had any trouble getting in and out of a car or using public transport because of your knee? (whichever you tend to use)", list: OKSKneeTrouble },
  { id: 12, code: "OKS4", question: "For how long have you been able to walk before pain from your knee becomes severe? (with or without a stick)", list: OKSWalking },
  { id: 13, code: "OKS5", question: "After a meal (sat at a table), how painful has it been for you to stand up from a chair because of your knee?", list: OKSStanding },
  { id: 14, code: "OKS6", question: "Have you been limping when walking, because of your knee?", list: OKSFrequency },
  { id: 15, code: "OKS7", question: "Could you kneel down and get up again afterwards?", list: OKSEase },
  { id: 16, code: "OKS8", question: "Have you been troubled by pain from your knee in bed at night?", list: OKSNightPain },
  { id: 17, code: "OKS9", question: "How much has pain from your knee interfered with your usual work (including housework)?", list: OKSWorkInterference },
  { id: 18, code: "OKS10", question: "Have you felt that your knee might suddenly 'give way' or let you down?", list: OKSFrequency },
  { id: 19, code: "OKS11", question: "Could you do the household shopping on your own?", list: OKSEase },
  { id: 20, code: "OKS12", question: "Could you walk down one flight of stairs?", list: OKSEase },
];

export type BarChartData = {
  title: string;
  variableName: string;
  variableQuestion: string | undefined;
  initial: number;
  options: {
    label: string;
    percentage: string;
  }[];
};

export type QuestionData = {
  totalRows: number;
  variableName: string;
  data: {
    option: `${keyof typeof OtherOptions}`;
    count: string;
    percentage: number;
  }[];
};
