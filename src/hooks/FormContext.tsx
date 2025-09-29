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
  setPriorities: (priorities: number[]) => void; // optional
}

export const FormContext = createContext<FormContextProps | undefined>(
  undefined
);

const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patient, setPatient] = useState<Patient | undefined>(() => {
    try {
      const storedPatient = localStorage.getItem("patient");
      return storedPatient ? JSON.parse(storedPatient) : undefined;
    } catch (error) {
      console.error("Error loading patient from localStorage:", error);
      return undefined;
    }
  });

  const [form, setForm] = useState<PatientForm | undefined>(() => {
    try {
      const storedForm = localStorage.getItem("form");
      return storedForm ? JSON.parse(storedForm) : undefined;
    } catch (error) {
      console.error("Error loading form from localStorage:", error);
      return undefined;
    }
  });

  const [term, setTerm] = useState<number | undefined>(undefined);

  // Save patient to localStorage whenever it updates
  useEffect(() => {
    try {
      if (patient) {
        localStorage.setItem("patient", JSON.stringify(patient));
      } else {
        localStorage.removeItem("patient");
      }
    } catch (error) {
      console.error("Error saving patient to localStorage:", error);
    }
  }, [patient]);

  // Save form to localStorage whenever it updates
  useEffect(() => {
    try {
      if (form) {
        localStorage.setItem("form", JSON.stringify(form));
      } else {
        localStorage.removeItem("form");
      }
    } catch (error) {
      console.error("Error saving form to localStorage:", error);
    }
  }, [form]);

  const setCurrentPatient = (patient: Patient | undefined) =>
    setPatient(patient);

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

  return (
    <FormContext.Provider
      value={{ patient, form, term, setCurrentPatient, setCurrentForm, setPriorities }}
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
