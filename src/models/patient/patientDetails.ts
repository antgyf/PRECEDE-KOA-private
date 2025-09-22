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
  // "FunctionWalking",
  // "FunctionStairs",
  // "Pain",
  "PainWalking",
  "PainStairClimbing",
  "PainNocturnal",
  "PainRest",
  "PainWeightbearing",
  "StiffnessMorning",
  "StiffnessLaterDay",
  "PHDecendingstairs",
  "PHAscendingstairs",
  "PHRisingfromsitting",
  "PHStanding",
  "PHBendingtofloor",
  "PHWalkingonflatsurface",
  "PHGettinginoutofcar",
  "PHGoingshopping",
  "PHPuttingonsocks",
  "PHLyinginbed",
  "PHTakingoffsocks",
  "PHRisingfrombed",
  "PHGettinginoutofbath",
  "PHSitting",
  "PHGettingonofftoilet",
  "PHHeavydomesticduties",
  "PHLightdomesticduties",
] as const; // Use `as const` to make the array readonly and infer literal types

export type AllOptionsType = (typeof AllOptions)[number]; // Create a union type from the array

export const AllOptionNames = [
  "Your pain when walking?",
  "Your pain when climbing stairs?",
  "Your pain at night?",
  "Your pain when resting?",
  "Your pain when carrying heavy things?",
  "Your stiffness in the morning?",
  "Your stiffness later in the day?",
  "Your difficulty in walking down stairs?",
  "Your difficulty in walking up stairs?",
  "Your difficulty in rising from sitting?",
  "Your difficulty in standing?",
  "Your difficulty in bending to the floor?",
  "Your difficulty in walking on a flat surface?",
  "Your difficulty in getting in or out of a car?",
  "Your difficulty in going shopping?",
  "Your difficulty in putting on socks?",
  "Your difficulty in lying in bed?",
  "Your difficulty in taking off socks?",
  "Your difficulty in rising from bed?",
  "Your difficulty in getting in or out of a bath?",
  "Your difficulty in sitting?",
  "Your difficulty in getting on and off the toilet?",
  "Your difficulty in doing heavy housework?",
  "Your difficulty in doing light housework?",
];

export type AllOptionNamesType = (typeof AllOptionNames)[number];

export type QuestionType = {
  name: AllOptionsType;
  question: string;
  list: Record<number, string>;
};

export const Questions: QuestionType[] = [
  {
    name: "PainWalking",
    question: "Your pain when walking?",
    list: OtherOptions,
  },
  {
    name: "PainStairClimbing",
    question: "Your pain when climbing stairs?",
    list: OtherOptions,
  },
  {
    name: "PainNocturnal",
    question: "Your pain at night?",
    list: OtherOptions,
  },
  {
    name: "PainRest",
    question: "Your pain when resting?",
    list: OtherOptions,
  },
  {
    name: "PainWeightbearing",
    question: "Your pain when carrying heavy things?",
    list: OtherOptions,
  },
  {
    name: "StiffnessMorning",
    question: "Your stiffness in the morning?",
    list: OtherOptions,
  },
  {
    name: "StiffnessLaterDay",
    question: "Your stiffness later in the day?",
    list: OtherOptions,
  },
  {
    name: "PHDecendingstairs",
    question: "Your difficulty in walking down stairs?",
    list: OtherOptions,
  },
  {
    name: "PHAscendingstairs",
    question: "Your difficulty in walking up stairs?",
    list: OtherOptions,
  },
  {
    name: "PHRisingfromsitting",
    question: "Your difficulty in rising from sitting?",
    list: OtherOptions,
  },
  {
    name: "PHStanding",
    question: "Your difficulty in standing?",
    list: OtherOptions,
  },
  {
    name: "PHBendingtofloor",
    question: "Your difficulty in bending to the floor?",
    list: OtherOptions,
  },
  {
    name: "PHWalkingonflatsurface",
    question: "Your difficulty in walking on a flat surface?",
    list: OtherOptions,
  },
  {
    name: "PHGettinginoutofcar",
    question: "Your difficulty in getting in or out of a car?",
    list: OtherOptions,
  },
  {
    name: "PHGoingshopping",
    question: "Your difficulty in going shopping?",
    list: OtherOptions,
  },
  {
    name: "PHPuttingonsocks",
    question: "Your difficulty in putting on socks?",
    list: OtherOptions,
  },
  {
    name: "PHLyinginbed",
    question: "Your difficulty in lying in bed?",
    list: OtherOptions,
  },
  {
    name: "PHTakingoffsocks",
    question: "Your difficulty in taking off socks?",
    list: OtherOptions,
  },
  {
    name: "PHRisingfrombed",
    question: "Your difficulty in rising from bed?",
    list: OtherOptions,
  },
  {
    name: "PHGettinginoutofbath",
    question: "Your difficulty in getting in or out of a bath?",
    list: OtherOptions,
  },
  {
    name: "PHSitting",
    question: "Your difficulty in sitting?",
    list: OtherOptions,
  },
  {
    name: "PHGettingonofftoilet",
    question: "Your difficulty in getting on and off the toilet?",
    list: OtherOptions,
  },
  {
    name: "PHHeavydomesticduties",
    question: "Your difficulty in doing heavy housework?",
    list: OtherOptions,
  },
  {
    name: "PHLightdomesticduties",
    question: "Your difficulty in doing light housework?",
    list: OtherOptions,
  },
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
