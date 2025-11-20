import React, { useState } from "react";
import { useForm } from "../../hooks/FormContext";
import { Ethnicity, EthnicityCh, Sex, SexCh } from "../../models/patient/patientDetails";
import api from "../../api/api";
import { useAlert } from "../../hooks/AlertContext";
import { useNavigate } from "react-router-dom";
import EditPatientBox from "./EditPatientBox";
import { useAuth } from "../../hooks/AuthContext";

interface PatientDetailProps {
  currentLang: string;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ currentLang }) => {
  const auth = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, setCurrentPatient } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  if (!patient) {
    return (
      <div className="text-center">
        <p>{currentLang === "en" ? "No patient data available." : "没有患者数据可用。"}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await api.delete(
        `/patients/delete/${patient.patientid}`
      );
      setCurrentPatient(undefined);
      currentLang === "en"
        ? showAlert("Patient deleted successfully!", "success")
        : showAlert("患者删除成功！", "success");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting patient:", error);
      currentLang === "en"
        ? showAlert("Failed to delete patient.", "error")
        : showAlert("删除患者失败。", "error");
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
              <th className="border px-3 py-2">{currentLang === "en" ? "Study ID" : "研究编号"}</th>
              <th className="border px-3 py-2">{currentLang === "en" ? "Name" : "姓名"}</th>
              <th className="border px-3 py-2">{currentLang === "en" ? "Age" : "年龄"}</th>
              <th className="border px-3 py-2">{currentLang === "en" ? "Sex" : "性别"}</th>
              <th className="border px-3 py-2">{currentLang === "en" ? "Ethnicity" : "种族"}</th>
              <th className="border px-3 py-2">{currentLang === "en" ? "BMI (kg/m²)" : "身体质量指数 (kg/m²)"}</th>
              {!auth.isSurgeon && <th className="border px-3 py-2">{currentLang === "en" ? "Actions" : "操作"}</th>}
            </tr>
          </thead>
          <tbody className="text-base bg-white">
            <tr className="text-center">
              <td className="border px-3 py-2">{patient.patientid}</td>
              <td className="border px-3 py-2">{patient.fullname}</td>
              <td className="border px-3 py-2">{patient.age}</td>
              <td className="border px-3 py-2">{currentLang === "en" ? Sex[patient?.sex] : SexCh[patient?.sex]}</td>
              <td className="border px-3 py-2">
                {currentLang === "en" ? Ethnicity[patient.ethnicity] : EthnicityCh[patient.ethnicity]}
              </td>
              <td className="border px-3 py-2">{patient.bmi}</td>
              {!auth.isSurgeon && (
                <td className="border px-3 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setIsEditing(true)} // Open Edit Form
                  >
                    {currentLang === "en" ? "Edit" : "编辑"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={handleDelete}
                  >
                    {currentLang === "en" ? "Delete" : "删除"}
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
