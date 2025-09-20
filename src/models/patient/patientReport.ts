import { AllOptionsType } from "./patientDetails";

export interface Patient {
  patientid: number;
  fullname: string;
  age: number;
  sex: number;
  ethnicity: number;
  height: number;
  weight: number;
  bmi: number;
  hasform: boolean;
}

export interface PatientForm {
  PainWalking: number;
  PainStairClimbing: number;
  PainNocturnal: number;
  PainRest: number;
  PainWeightbearing: number;
  StiffnessMorning: number;
  StiffnessLaterDay: number;
  PHDecendingstairs: number;
  PHAscendingstairs: number;
  PHRisingfromsitting: number;
  PHStanding: number;
  PHBendingtofloor: number;
  PHWalkingonflatsurface: number;
  PHGettinginoutofcar: number;
  PHGoingshopping: number;
  PHPuttingonsocks: number;
  PHLyinginbed: number;
  PHTakingoffsocks: number;
  PHRisingfrombed: number;
  PHGettinginoutofbath: number;
  PHSitting: number;
  PHGettingonofftoilet: number;
  PHHeavydomesticduties: number;
  PHLightdomesticduties: number;
  rank1: AllOptionsType;
  rank2: AllOptionsType;
  rank3: AllOptionsType;
  rank4: AllOptionsType;
  rank5: AllOptionsType;
}

export type GraphData = Array<
  | [
      string,
      string,
      { role: "style" },
      {
        role: "annotation";
        type: "string";
      }
    ] // Header row
  | [string, number, string, string]
>;

export type RadarDataPoint = {
  variableName: string;
  initial: number;
  median: number;
  n: number;
  importance: number;
};
