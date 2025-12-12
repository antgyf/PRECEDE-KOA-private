import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ForwardButton from "../UI/Button/ForwardButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";

// You can define proper types if needed
export interface Patient {
  fullName: string;
  sex: string;
  ethnicity: string;
  age: string;
  height: string;
  weight: string;
  bmi: string;
}

export interface FormData {
  [key: string]: any;
}

const PreTkaSurveyPage: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // URL params
  const langParam = params.get("lang") || "en";
  const patientParam = params.get("patient") ? JSON.parse(params.get("patient")!) : {};
  const formParam = params.get("form") ? JSON.parse(params.get("form")!) : {};

  // Local states
  const [localLang, setLocalLang] = useState<string>(langParam);
  const [localPatient, setLocalPatient] = useState<Patient>({
    fullName: patientParam?.fullName || "",
    sex: patientParam?.sex || "",
    ethnicity: patientParam?.ethnicity || "",
    age: patientParam?.age || "",
    height: patientParam?.height || "",
    weight: patientParam?.weight || "",
    bmi: patientParam?.bmi || "",
  });
  const [localForm] = useState<FormData>(formParam);

  // Auto-calculate BMI
  useEffect(() => {
    const h = parseFloat(localPatient.height);
    const w = parseFloat(localPatient.weight);

    if (h > 0 && w > 0) {
      const bmiValue = (w / (h * h)).toFixed(1);
      setLocalPatient((prev) => ({ ...prev, bmi: bmiValue }));
    } else {
      setLocalPatient((prev) => ({ ...prev, bmi: "" }));
    }
  }, [localPatient.height, localPatient.weight]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalPatient({ ...localPatient, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
  // Check required patient fields
  const { fullName, sex, ethnicity, height, weight, age } = localPatient;
    if (!fullName || !sex || !ethnicity || !height || !weight || !age) {
        alert(localLang === "zh" ? "请填写所有必填字段" : "Please fill in all required fields");
        return false; // Stop navigation
    }
    return true; // Allow navigation
    };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex justify-center items-center h-full w-full">
        <article className="prose">
          <h1>Precede TKA Survey</h1>
        </article>

        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={localLang} onChange={setLocalLang} />
        </div>
      </div>

      {/* Form */}
      {localLang === "zh" && (
      <div className="mt-6 max-w-xl w-full flex flex-col gap-4 bg-white p-6 rounded-2xl shadow">
        {/* Full Name */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">姓名</span>
          <input
            type="text"
            name="fullName"
            value={localPatient.fullName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* Sex */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">性别</span>
          <select
            name="sex"
            value={localPatient.sex}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>

        {/* Ethnicity */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">种族</span>
          <select
            name="ethnicity"
            value={localPatient.ethnicity}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value=""></option>
            <option value="0">华人</option>
            <option value="1">马来人</option>
            <option value="2">印度人</option>
            <option value="3">高加索人</option>
            <option value="4">其他</option>
          </select>
        </label>

        {/* Age */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">年龄</span>
          <input
            type="number"
            name="age"
            value={localPatient.age}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* Height */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">身高 (米)</span>
          <input
            type="number"
            name="height"
            value={localPatient.height}
            onChange={handleChange}
            className="border p-2 rounded"
            step="0.01"
          />
        </label>

        {/* Weight */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">体重 (公斤)</span>
          <input
            type="number"
            name="weight"
            value={localPatient.weight}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* BMI */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">体重指数 (BMI)</span>
          <input
            type="text"
            value={localPatient.bmi}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </label>
      </div>
      )}

      {localLang === "en" && (
      <div className="mt-6 max-w-xl w-full flex flex-col gap-4 bg-white p-6 rounded-2xl shadow">
        {/* Full Name */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Full Name</span>
          <input
            type="text"
            name="fullName"
            value={localPatient.fullName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* Sex */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Sex</span>
          <select
            name="sex"
            value={localPatient.sex}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        {/* Ethnicity */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Ethnicity</span>
          <select
            name="ethnicity"
            value={localPatient.ethnicity}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value=""></option>
            <option value="0">Chinese</option>
            <option value="1">Malay</option>
            <option value="2">Indian</option>
            <option value="3">Caucasian</option>
            <option value="4">Others</option>
          </select>
        </label>

        {/* Age */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Age</span>
          <input
            type="number"
            name="age"
            value={localPatient.age}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* Height */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Height (meters)</span>
          <input
            type="number"
            name="height"
            value={localPatient.height}
            onChange={handleChange}
            className="border p-2 rounded"
            step="0.01"
          />
        </label>

        {/* Weight */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Weight (kg)</span>
          <input
            type="number"
            name="weight"
            value={localPatient.weight}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        {/* BMI */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">BMI</span>
          <input
            type="text"
            value={localPatient.bmi}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </label>
      </div>
      )}

      {/* Forward Button */}
      <ForwardButton
        target={localLang === "zh" ? "下一页" : "Next"}
        to={`/surveyquestions?lang=${localLang}&form=${encodeURIComponent(
          JSON.stringify(localForm)
        )}&patient=${encodeURIComponent(JSON.stringify(localPatient))}`}
        isDisabled={(!localPatient.fullName || !localPatient.sex || !localPatient.ethnicity || !localPatient.height || !localPatient.weight || !localPatient.age)}
      />

    </div>
  );
};

export default PreTkaSurveyPage;
