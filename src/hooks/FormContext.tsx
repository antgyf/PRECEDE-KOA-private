import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Patient, PatientForm } from "../models/patient/patientReport";

interface FormContextProps {
  form: PatientForm | undefined;
  patient: Patient | undefined;
  term: number | undefined;
  setCurrentForm: (form: PatientForm, term: number, priorities?: number[]) => void;
  setCurrentPatient: (patient: Patient | undefined) => void;
  setPriorities: (priorities: number[]) => void;
  clearFormContext: () => void;
}

export const FormContext = createContext<FormContextProps | undefined>(
  undefined
);

const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Utility: safely parse JSON from localStorage
  const parseSafe = <T,>(key: string): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch {
      console.warn(`Corrupted localStorage item: ${key}`);
      localStorage.removeItem(key);
      return undefined;
    }
  };

  // --- Load initial state from localStorage
  const [patient, setPatient] = useState<Patient | undefined>(() =>
    parseSafe("patient")
  );
  const [form, setForm] = useState<PatientForm | undefined>(() =>
    parseSafe("form")
  );
  const [term, setTerm] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("term");
    return stored ? Number(stored) : undefined;
  });

  // --- Persist patient
  useEffect(() => {
    try {
      if (patient) localStorage.setItem("patient", JSON.stringify(patient));
      else localStorage.removeItem("patient");
    } catch (error) {
      console.error("Error saving patient to localStorage:", error);
    }
  }, [patient]);

  // --- Persist form
  useEffect(() => {
    try {
      if (form) localStorage.setItem("form", JSON.stringify(form));
      else localStorage.removeItem("form");
    } catch (error) {
      console.error("Error saving form to localStorage:", error);
    }
  }, [form]);

  // --- Persist term
  useEffect(() => {
    try {
      if (term !== undefined) localStorage.setItem("term", String(term));
      else localStorage.removeItem("term");
    } catch (error) {
      console.error("Error saving term to localStorage:", error);
    }
  }, [term]);

  // --- Setters
  const setCurrentPatient = (patient: Patient | undefined) => {
    setPatient(patient);
  };

  const setCurrentForm = (form: PatientForm, term: number, priorities?: number[]) => {
    setForm({
      ...form,
      term,
      priorities: priorities ?? form.priorities,
    });
    setTerm(term);
  };

  const setPriorities = (priorities: number[]) => {
    if (!form) return;
    setForm({ ...form, priorities });
  };

  // --- Clear everything (for logout / switching patient)
  const clearFormContext = () => {
    setPatient(undefined);
    setForm(undefined);
    setTerm(undefined);
    localStorage.removeItem("patient");
    localStorage.removeItem("form");
    localStorage.removeItem("term");
  };

  return (
    <FormContext.Provider
      value={{
        patient,
        form,
        term,
        setCurrentPatient,
        setCurrentForm,
        setPriorities,
        clearFormContext,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextProps => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

export default FormProvider;
