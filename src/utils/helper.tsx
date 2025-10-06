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
      The 5 areas{" "}
      <strong style={{ color: "#1976D2" }}>
        {" "}
        {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
      </strong>{" "}
      hopes to see improvement most are:
      <ul className="leading-tight">
        {priorityQuestions.map((q) => (
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

  if (filters.categories.includes("Surgeon Title")) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>Surgeon Title</strong> (
        {patient.surgeontitle})
      </>
    );
  }

  if (filters.categories.includes("Surgeon ID")) {
    parts.push(
      <>
        <strong style={{ color: "#1976D2" }}>Surgeon ID</strong> (
        {patient.surgeonid})
      </>
    );
  }
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
