import React from "react";
import { useForm } from "../hooks/FormContext";
import {
  Ethnicity,
  EthnicityCh,
  FilterType,
  Questions,
  Sex,
  SexCh,
} from "../models/patient/patientDetails";
import { Patient } from "../models/patient/patientReport";

export const getChSurgeonTitle = (title: string) => {
  switch (title) {
    case "Consultant":
      return "顾问";
    case "Associate Consultant":
      return "副顾问";
    case "Associate Professor":
      return "副教授";
    case "Professor":
      return "教授";
    case "Senior Consultant":
      return "高级顾问";
    default:
      return title;
  }
};

export const getRankDescription = (lan: string) => {
  const { form } = useForm();
  let priorityQuestions: string[] | undefined;
  if (lan === "zh") {
    priorityQuestions = form?.priorities?.map((id) => {
      const description = Questions.find((q) => q.id === id)?.chineseDescription || "N/A";
      return description;
    });
  } else {
    priorityQuestions = form?.priorities?.map((id) => {
      const description = Questions.find((q) => q.id === id)?.description || "N/A";
      return description;
    });
  }

  if (lan === "en") {
    return (
      <>

        <ul className="leading-tight">
          {(priorityQuestions ?? []).map((q) => (
            <li key={q}>{"  "}{q}</li>
          ))}
        </ul>
      </>
    );
  } else if (lan === "zh") {
    return (
      <>
        <ul className="leading-tight">
          {(priorityQuestions ?? []).map((q) => (
            <li key={q}>{"  "}{q}</li>
          ))}
        </ul>
      </>
    );
  }
};

export const getName = (language: string) => {
  const { patient } = useForm();
  if (language === "en") {
    return (
    <strong style={{ color: "#1976D2" }}>
      {" "}
      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
    </strong>
  );
} else if (language === "zh") {
    return (
      <strong style={{ color: "#1976D2" }}>
        {" "}
        {patient?.fullname} {patient?.sex ? "女士" : "先生"}
      </strong>
    );
  }
};

export const getFilterDescription = (filters: FilterType, patient: Patient, lan: string) => {
  const parts: React.ReactNode[] = [];

  if (filters.categories.includes("Age Range") && filters.age) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Age</strong> (within{" "}
          {filters.age.range} years)
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>年龄</strong> (在{" "}
          {filters.age.range} 岁之间)
        </>
      );
    }
  }

  if (filters.categories.includes("BMI Range") && filters.bmi) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>BMI</strong> (within{" "}
          {filters.bmi.range} kg/m²)
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>体重指数</strong> (在{" "}
          {filters.bmi.range} kg/m² 之间)
        </>
      );
    }
  }

  if (filters.categories.includes("Gender")) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Gender</strong> ({Sex[patient.sex]}
          )
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>性别</strong> ({SexCh[patient.sex]}
          )
        </>
      );
    }
  }

  if (filters.categories.includes("Ethnicity")) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Ethnicity</strong> (
          {Ethnicity[patient.ethnicity]})
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>种族</strong> ({EthnicityCh[patient.ethnicity]})
        </> 
      );
    }
  }

  if (filters.categories.includes("Surgeon Title")) {
    if (lan === "en") {
      parts.push(
        <>
          and were operated on by a <strong style={{ color: "#1976D2" }}>{filters.surgeontitle}</strong> surgeon
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          并由一位 <strong style={{ color: "#1976D2" }}>{filters.surgeontitle ? getChSurgeonTitle(filters.surgeontitle) : ""}</strong> 外科医生进行手术
        </>
      );
    }
  }

  if (filters.surgeonid) {
    if (lan === "en") {
      parts.push(
        <>
          and were operated on by Surgeon <strong style={{ color: "#1976D2" }}>
          {filters.surgeonid}</strong> 
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          并由外科医生 <strong style={{ color: "#1976D2" }}>{filters.surgeonid}</strong> 进行手术
        </>
      );
    }
  }

  return (
    <>
      {parts.length > 0}
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && ", "}
          {part}
        </React.Fragment>
      ))}
    </>
  );
};
