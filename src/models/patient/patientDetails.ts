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

export const SexCh: Record<string, string> = {
  0: "男",
  1: "女",
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

export const EthnicityCh: Record<string, string> = {
  0: "华人",
  1: "马来人",
  2: "印度人",
  3: "高加索人",
  4: "其他"
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
  1: "超过2个巴士站",
  2: "1到2个巴士站",
  3: "1个巴士站",
  4: "仅限室内活动",
  5: "不能走路",
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
  2: "上下楼梯都需扶栏杆",
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
  1: "轻微/偶尔疼痛",
  2: "轻微(仅上下楼梯时)疼痛",
  3: "轻微(平地行走时也)疼痛",
  4: "适中-偶尔疼痛",
  5: "适中-持续疼痛",
  6: "严重疼痛",
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

export const OKSCarTroubleCh = {
  0: "完全无困难",
  1: "一点点困难",
  2: "有些困难",
  3: "非常困难",
  4: "无法上下车或使用公共交通",
};

export const chOKSWashingTrouble = {
  0: "完全无困难",
  1: "一点点困难",
  2: "有些困难",
  3: "非常困难",
  4: "无法洗澡或擦干身体",
}

export const OKSWalking = {
  0: "No pain/More than 30 mins",
  1: "16-30 mins",
  2: "5-15 mins",
  3: "Around the house only",
  4: "Not at all/Pain severe when walking",
};

export const OKSWalkingCh = {
  0: "无疼痛/超过30分钟",
  1: "16到30分钟",
  2: "5到15分钟",
  3: "只能在家周围活动",
  4: "完全无法走路/一走路就疼痛",
};

export const OKSStanding = {
  0: "Not at all painful",
  1: "Slightly painful",
  2: "Moderately painful",
  3: "Very painful",
  4: "Unbearable",
};

export const OKSStandingCh = {
  0: "完全无困难",
  1: "一点点困难",
  2: "有些困难",
  3: "非常困难",
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
  0: "很少/从来没有",
  1: "有时，或刚开始时",
  2: "经常，不是只有刚开始时",
  3: "大部分时间",
  4: "一直跛行（一瘸一拐）",
};

export const OKSEase = {
  0: "Yes, easily",
  1: "With little difficulty",
  2: "With moderate difficulty",
  3: "With extreme difficulty",
  4: "No, impossible",
};

export const OKSKneelingCh = {
  0: "可以，容易完成",
  1: "一点点困难",
  2: "有些困难",
  3: "非常困难",
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
  0: "从未感到困扰",
  1: "仅1到2晚",
  2: "有一些夜晚",
  3: "大部分夜晚",
  4: "每晚都感到困扰",
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
  1: "一点点影响",
  2: "有些影响",
  3: "很大影响",
  4: "完全无法工作或做家务",
};

export const GiveWayCh = {
  0: "几乎没有/从来没有",
  1: "有时，或者只有刚开始时",
  2: "经常，不是只有刚开始时",
  3: "大部分时间",
  4: "一直如此",
};

export const OKSEaseCh = {
  0: "可以，容易完成",
  1: "一点点困难",
  2: "有些困难",
  3: "非常困难",
  4: "不可能做到",
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
  chQuestion: string;
  chineseDescription: string;
  chList: Record<number, string>; // Likert or option scale in Chinese
};

// Actual questions list aligned with DB
export const Questions: QuestionType[] = [
  { id: 1, code: "KFS", question: "How well can you use stairs?", list: FunctionStairs, description: "Ability to use stairs" , chQuestion: "您能上下楼梯吗？", chineseDescription: "上下楼梯的能力", chList: FunctionStairsCh},
  { id: 2, code: "KFW", question: "How far can you walk?", list: FunctionWalking, description: "Ability to walk" , chQuestion: "您能持续走路多久？", chineseDescription: "持续走路的能力", chList: FunctionWalkingCh},
  { id: 3, code: "KPAIN", question: "How is your overall knee pain?", list: Pain, description: "Overall knee pain", chQuestion: "您的膝关节疼痛程度如何？", chineseDescription: "膝关节疼痛程度", chList: PainCh },
  /*
  { id: 4, code: "EQ5D-MOB", question: "Did you have problems in walking about today?", list: Mobility, description: "Problems in walking" },
  { id: 5, code: "EQ5D-SC", question: "Did you have problems in washing or dressing yourself today?", list: SelfCare, description: "Problems washing or dressing yourself" },
  { id: 6, code: "EQ5D-UA", question: "Did you have problems in doing your usual activities today? (e.g. work, study, housework, family or leisure activities)", list: UsualActivities, description: "Problems doing your usual activities (e.g. work, study, housework, family or leisure activities)" },
  { id: 7, code: "EQ5D-PD", question: "Did you have any pain/discomfort today?", list: PainDiscomfort, description: "Pain/discomfort level" },
  { id: 8, code: "EQ5D-AD", question: "Do you feel anxious/depressed today?", list: AnxietyDepression, description: "Anxiety/depression level" },
  */  
  { id: 9, code: "OKS1", question: "How would you describe the pain you usually have from your knee?", list: OKSKneePain, description: "Knee pain severity", chQuestion: "您如何描述膝关节通常的疼痛?", chineseDescription: "膝盖日常疼痛程度", chList: OKSKneePainCh },
  { id: 10, code: "OKS2", question: "Have you had any trouble with washing and drying yourself (all over) because of your knee?", list: OKSKneeTrouble, description: "Difficulty with washing and drying yourself because of your knee" , chQuestion: "您是否因为膝关节问题在洗澡或擦干身体时感到困难？", chineseDescription: "洗澡/擦身困难", chList: chOKSWashingTrouble },
  { id: 11, code: "OKS3", question: "Have you had any trouble getting in and out of a car or using public transport because of your knee? (whichever you tend to use)", list: OKSKneeTrouble, description: "Difficulty getting in and out of a car or bus because of your knee", chQuestion: "您是否因为膝关节问题在上下车或使用公共交通时感到困难？", chineseDescription: "上下车/乘车困难", chList: OKSCarTroubleCh },
  { id: 12, code: "OKS4", question: "For how long have you been able to walk before pain from your knee becomes severe? (with or without a stick)", list: OKSWalking, description: "Walking duration before knee pain becomes severe", chQuestion: "您走路多久之后膝关节疼痛会变得严重（用或不用拐杖)？", chineseDescription: "发生疼痛前能走多久", chList: OKSWalkingCh },
  { id: 13, code: "OKS5", question: "After a meal (sat at a table), how painful has it been for you to stand up from a chair because of your knee?", list: OKSStanding, description: "Difficulty with standing up from a chair", chQuestion: "在吃完饭后（坐在餐桌旁），因为膝关节问题，您从椅子上站起来时有多痛？", chineseDescription: "站起时的疼痛程度", chList: OKSStandingCh },
  { id: 14, code: "OKS6", question: "Have you been limping when walking, because of your knee?", list: OKSFrequency, description: "Limping because of your knee", chQuestion: "您走路时是否因为膝关节问题而跛行（一瘸一拐）？", chineseDescription: "跛行（一瘸一拐）", chList: OKSFrequencyCh },
  { id: 15, code: "OKS7", question: "Could you kneel down and get up again afterwards?", list: OKSEase, description: "Difficulty with kneeling down and getting up again", chQuestion: "您能跪下后又站起来吗？", chineseDescription: "跪下再起身的能力", chList: OKSKneelingCh },
  { id: 16, code: "OKS8", question: "Have you been troubled by pain from your knee in bed at night?", list: OKSNightPain, description: "Knee pain at night", chQuestion: "您晚上睡觉时是否因为膝关节疼痛而感到困扰？", chineseDescription: "膝盖夜间疼痛影响睡眠", chList: OKSNightPainCh },
  { id: 17, code: "OKS9", question: "How much has pain from your knee interfered with your usual work (including housework)?", list: OKSWorkInterference, description: "Work interference by knee pain", chQuestion: "膝关节疼痛对您的日常工作（包括家务活）有多大的影响？", chineseDescription: "膝盖疼痛影响日常工作", chList: OKSWorkInterferenceCh },
  { id: 18, code: "OKS10", question: "Have you felt that your knee might suddenly 'give way' or let you down?", list: OKSFrequency, description: "Feeling knee suddenly 'giving way' or letting you down", chQuestion: "您曾感到膝关节会突然 “打软” 或让你跌倒吗？", chineseDescription: "膝盖突然无力", chList: GiveWayCh },
  { id: 19, code: "OKS11", question: "Could you do the household shopping on your own?", list: OKSEase, description: "Ability to do household shopping", chQuestion: "您可以自己去买东西吗？", chineseDescription: "自己去买东西的能力", chList: OKSEaseCh },
  { id: 20, code: "OKS12", question: "Could you walk down one flight of stairs?", list: OKSEase, description: "Ability to walk down stairs", chQuestion: "您能往下走一层楼梯吗？", chineseDescription: "下楼梯的能力", chList: OKSEaseCh },
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
