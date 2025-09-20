import React, { useState } from "react";
import { useForm } from "../../hooks/FormContext";
import { Ethnicity, Sex } from "../../models/patient/patientDetails";
import axios from "axios";
import { useAlert } from "../../hooks/AlertContext";
import { useNavigate } from "react-router-dom";
import EditPatientBox from "./EditPatientBox";
import { useAuth } from "../../hooks/AuthContext";

const PatientDetail: React.FC = () => {
  const auth = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, setCurrentPatient } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  if (!patient) {
    return (
      <div className="text-center">
        <p>No patient data available.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await axios.delete(
        `https://precede-koa.netlify.app/.netlify/functions/api/patients/delete/${patient.patientid}`
      );
      setCurrentPatient(undefined);
      showAlert("Patient deleted successfully!", "success");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting patient:", error);
      showAlert("Failed to delete patient.", "error");
    }
  };

  return (
    <div className="w-full overflow-x-auto m-0">
      {isEditing ? (
        // Show EditPatientBox when in edit mode
        <EditPatientBox onClose={() => setIsEditing(false)} />
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead className="text-base">
            <tr className="leading-tight bg-secondary">
              <th className="border px-3 py-2">Study ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Age</th>
              <th className="border px-3 py-2">Sex</th>
              <th className="border px-3 py-2">Ethnicity</th>
              <th className="border px-3 py-2">BMI (kg/m²)</th>
              {!auth.isSurgeon && <th className="border px-3 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-base bg-white">
            <tr className="text-center">
              <td className="border px-3 py-2">{patient.patientid}</td>
              <td className="border px-3 py-2">{patient.fullname}</td>
              <td className="border px-3 py-2">{patient.age}</td>
              <td className="border px-3 py-2">{Sex[patient?.sex]}</td>
              <td className="border px-3 py-2">
                {Ethnicity[patient.ethnicity]}
              </td>
              <td className="border px-3 py-2">{patient.bmi}</td>
              {!auth.isSurgeon && (
                <td className="border px-3 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setIsEditing(true)} // Open Edit Form
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientDetail;
