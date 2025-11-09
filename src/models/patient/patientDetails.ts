export interface AddPatientForm {
  fullname: string;
  sex: string;
  ethnicity: string;
  age: string;
  bmi: string;
  height?: string;
  weight?: string;
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
  surgeonid?: string;
  surgeontitle?: string;
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

export const FunctionWalkingCh = {
  0: "无任何限制",
  1: "约1千米以上",
  2: "500-1000米",
  3: "不到500米",
  4: "仅能在室内活动",
  5: "不能步行",
};

export const FunctionStairs = {
  0: "Normal up and down",
  1: "Normal up and down with rail",
  2: "Up and down with rail",
  3: "Up with rail, down unable ",
  4: "Unable",
};

export const FunctionStairsCh = {
  0: "正常上下楼梯",
  1: "正常上楼，下楼梯需扶栏杆",
  2: "下楼梯均需扶栏杆",
  3: "借助扶手能上楼，但不能下楼",
  4: "完全不能上下楼梯",
}

export const Pain = {
  0: "None ",
  1: "Mild / Occasional",
  2: "Mild (Stairs only)",
  3: "Mild (Walking and Stairs)",
  4: "Moderate - Occasional",
  5: "Moderate - Continual",
  6: "Severe",
};

export const PainCh = {
  0: "不疼",
  1: "轻度/偶尔",
  2: "轻度(上下楼梯时轻微疼痛)",
  3: "轻度(平地行走时也轻微疼痛)",
  4: "中度-偶尔",
  5: "中度-经常",
  6: "严重",
};

export const Mobility = {
  0: "I have no problems in walking about",
  1: "I have slight problems in walking about",
  2: "I have moderate problems in walking about",
  3: "I have severe problems in walking about",
  4: "I am unable to walk",
};

export const MobilityCh = {
  0: "无疼痛",
  1: "极轻微疼痛",
  2: "轻微疼痛",
  3: "中等疼痛",
  4: "严重疼痛",
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

export const OKSKneePainCh = {
  0: "无疼痛",
  1: "极轻微疼痛",
  2: "轻微疼痛",
  3: "中等疼痛",
  4: "严重疼痛",
}

export const OKSKneeTrouble = {
  0: "No trouble at all",
  1: "Very little trouble",
  2: "Moderate trouble",
  3: "Extreme difficulty",
  4: "Impossible to do",
};

export const OKSKneeTroubleCh = {
  0: "完全无困难",
  1: "轻度困难",
  2: "中度困难",
  3: "非常困难",
  4: "无法完成",
};

export const OKSWalking = {
  0: "No pain/More than 30 mins",
  1: "16-30 mins",
  2: "5-15 mins",
  3: "Around the house only",
  4: "Not at all/Pain severe when walking",
};

export const OKSWalkingCh = {
  0: "超过30分钟无疼痛",
  1: "16到30分钟",
  2: "5到15分钟",
  3: "只能在家周围活动",
  4: "行走及疼痛",
};

export const OKSStanding = {
  0: "Not at all painful",
  1: "Slightly painful",
  2: "Moderately painful",
  3: "Very painful",
  4: "Unbearable",
};

export const OKSStandingCh = {
  0: "完全无疼痛",
  1: "轻度疼痛",
  2: "中度疼痛",
  3: "严重疼痛",
  4: "难以忍受的疼痛",
};

export const OKSFrequency = {
  0: "Rarely/Never",
  1: "Sometimes, just at first",
  2: "Often, not just at first",
  3: "Most of the time",
  4: "All of the time",
};

export const OKSFrequencyCh = {
  0: "从不或极少",
  1: "有时会有或刚开始行走时",
  2: "经常有",
  3: "大多数情况下",
  4: "一直有",
};

export const OKSEase = {
  0: "Yes, easily",
  1: "With little difficulty",
  2: "With moderate difficulty",
  3: "With extreme difficulty",
  4: "No, impossible",
};

export const OKSEaseCh = {
  0: "容易完成",
  1: "轻度困难",
  2: "中度困难",
  3: "重度困难",
  4: "无法完成",
};

export const OKSNightPain = {
  0: "No nights",
  1: "Only 1 or 2 nights",
  2: "Some nights",
  3: "Most nights",
  4: "Every night",
};

export const OKSNightPainCh = {
  0: "没有",
  1: "偶尔发生",
  2: "有时发生",
  3: "经常发生",
  4: "每天晚上都有",
};

export const OKSWorkInterference = {
  0: "Not at all",
  1: "A little bit",
  2: "Moderately",
  3: "Greatly",
  4: "Totally",
};

export const OKSWorkInterferenceCh = {
  0: "完全不影响",
  1: "轻度影响",
  2: "中度影响",
  3: "严重影响",
  4: "完全无法工作或做家务",
};

export const GiveWayCh = {
  0: "从不/极少",
  1: "有时",
  2: "经常",
  3: "大多数时候",
  4: "完全无法控制膝关节",
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
  description: string;  // optional description
  chineseDescription: string;
  chList: Record<number, string>; // Likert or option scale in Chinese
};

// Actual questions list aligned with DB
export const Questions: QuestionType[] = [
  { id: 1, code: "KFS", question: "How well can you use stairs?", list: FunctionStairs, description: "Ability to use stairs" , chineseDescription: "上下楼梯", chList: FunctionStairsCh},
  { id: 2, code: "KFW", question: "How far can you walk?", list: FunctionWalking, description: "Ability to walk" , chineseDescription: "行走能力", chList: FunctionWalkingCh},
  { id: 3, code: "KPAIN", question: "How is your overall knee pain?", list: Pain, description: "Overall knee pain", chineseDescription: "疼痛", chList: PainCh },
  /*
  { id: 4, code: "EQ5D-MOB", question: "Did you have problems in walking about today?", list: Mobility, description: "Problems in walking" },
  { id: 5, code: "EQ5D-SC", question: "Did you have problems in washing or dressing yourself today?", list: SelfCare, description: "Problems washing or dressing yourself" },
  { id: 6, code: "EQ5D-UA", question: "Did you have problems in doing your usual activities today? (e.g. work, study, housework, family or leisure activities)", list: UsualActivities, description: "Problems doing your usual activities (e.g. work, study, housework, family or leisure activities)" },
  { id: 7, code: "EQ5D-PD", question: "Did you have any pain/discomfort today?", list: PainDiscomfort, description: "Pain/discomfort level" },
  { id: 8, code: "EQ5D-AD", question: "Do you feel anxious/depressed today?", list: AnxietyDepression, description: "Anxiety/depression level" },
  */  
  { id: 9, code: "OKS1", question: "How would you describe the pain you usually have from your knee?", list: OKSKneePain, description: "Knee pain severity", chineseDescription: "平时膝关节疼痛程度", chList: OKSKneePainCh },
  { id: 10, code: "OKS2", question: "Have you had any trouble with washing and drying yourself (all over) because of your knee?", list: OKSKneeTrouble, description: "Difficulty with washing and drying yourself because of your knee" , chineseDescription: "洗漱及擦身有无困难", chList: OKSKneeTroubleCh },
  { id: 11, code: "OKS3", question: "Have you had any trouble getting in and out of a car or using public transport because of your knee? (whichever you tend to use)", list: OKSKneeTrouble, description: " Difficulty getting in and out of a car or bus because of your knee", chineseDescription: "上下小轿车及公共汽车是否有困难", chList: OKSKneeTroubleCh },
  { id: 12, code: "OKS4", question: "For how long have you been able to walk before pain from your knee becomes severe? (with or without a stick)", list: OKSWalking, description: "Walking duration before knee pain becomes severe", chineseDescription: "行走多长时间会感觉到膝关节疼痛严重？", chList: OKSWalkingCh },
  { id: 13, code: "OKS5", question: "After a meal (sat at a table), how painful has it been for you to stand up from a chair because of your knee?", list: OKSStanding, description: "Difficulty with standing up from a chair", chineseDescription: "吃饭或坐位时站起膝关节疼痛严重程度", chList: OKSStandingCh },
  { id: 14, code: "OKS6", question: "Have you been limping when walking, because of your knee?", list: OKSFrequency, description: "Limping because of your knee", chineseDescription: "行走时是否有跛行", chList: OKSFrequencyCh },
  { id: 15, code: "OKS7", question: "Could you kneel down and get up again afterwards?", list: OKSEase, description: "Difficulty with kneeling down and getting up again", chineseDescription: "能否跪下然后起立？", chList: OKSEaseCh },
  { id: 16, code: "OKS8", question: "Have you been troubled by pain from your knee in bed at night?", list: OKSNightPain, description: "Knee pain at night", chineseDescription: "晚上睡觉时是否有膝关节疼痛", chList: OKSNightPainCh },
  { id: 17, code: "OKS9", question: "How much has pain from your knee interfered with your usual work (including housework)?", list: OKSWorkInterference, description: "Work interference by knee pain", chineseDescription: "膝关节疼痛影响日常工作和家务的程度", chList: OKSWorkInterferenceCh },
  { id: 18, code: "OKS10", question: "Have you felt that your knee might suddenly 'give way' or let you down?", list: OKSFrequency, description: "Feeling knee suddenly 'giving way' or letting you down", chineseDescription: "是否感觉膝关节可能突然失去控制或者摔倒？", chList: GiveWayCh },
  { id: 19, code: "OKS11", question: "Could you do the household shopping on your own?", list: OKSEase, description: "Ability to do household shopping", chineseDescription: "独自购物的困难程度", chList: OKSEaseCh },
  { id: 20, code: "OKS12", question: "Could you walk down one flight of stairs?", list: OKSEase, description: "Ability to walk down stairs", chineseDescription: "下楼梯的困难程度", chList: OKSEaseCh },
];

export type BarChartData = {
  title: string;
  questionid: number;
  variableQuestion: string | undefined;
  initial: number;
  options: {
    label: string;
    percentageText: string;
    percent: number;
  }[];
};

export type QuestionData = {
  totalRows: number;
  questionid: number;
  data: {
    option: `${keyof typeof OtherOptions}`;
    count: string;
    percentage: number;
  }[];
};
