import React from "react";
import { useForm } from "../hooks/FormContext";
import {
  Ethnicity,
  FilterType,
  Questions,
  Sex,
} from "../models/patient/patientDetails";
import { Patient } from "../models/patient/patientReport";

export const getRankDescription = () => {
  const { form, patient } = useForm();
  const priorityQuestions = form?.priorities?.map((id) => {
    const description = Questions.find((q) => q.id === id)?.description || "N/A";

    return description;
  });

  return (
    <>
      The {priorityQuestions?.length || 0} areas{" "}
      <strong style={{ color: "#1976D2" }}>
        {" "}
        {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
      </strong>{" "}
      hopes to see improvement most are:
      <ul className="leading-tight">
        {(priorityQuestions ?? []).map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
    </>
  );
};

export const getName = () => {
  const { patient } = useForm();
  return (
    <strong style={{ color: "#1976D2" }}>
      {" "}
      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
    </strong>
  );
};

export const getFilterDescription = (filters: FilterType, patient: Patient) => {
  const parts: React.ReactNode[] = [];

  if (filters.categories.includes("Age Range") && filters.age) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>Age</strong> (within{" "}
        {filters.age.range} years)
      </>
    );
  }

  if (filters.categories.includes("BMI Range") && filters.bmi) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>BMI</strong> (within{" "}
        {filters.bmi.range} kg/m²)
      </>
    );
  }

  if (filters.categories.includes("Gender")) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>Gender</strong> ({Sex[patient.sex]}
        )
      </>
    );
  }

  if (filters.categories.includes("Ethnicity")) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>Ethnicity</strong> (
        {Ethnicity[patient.ethnicity]})
      </>
    );
  }

  if (filters.categories.includes("Surgeon Title")) {
    parts.push(
      <>
        and were operated on by a <strong style={{ color: "#1976D2" }}>{filters.surgeontitle}</strong> surgeon
      </>
    );
  }

  if (filters.surgeonid) {
    parts.push(
      <>
        and were operated on by Surgeon <strong style={{ color: "#1976D2" }}>
        {filters.surgeonid}</strong> 
      </>
    );
  }

  return (
    <>
      {parts.length > 0 && " in "}
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && ", "}
          {part}
        </React.Fragment>
      ))}
    </>
  );
};
