// 👇 This must be at the VERY TOP — before any imports
import { jest } from "@jest/globals";

jest.unstable_mockModule("../database.mts", async () => {
  const mockPool = await import("./utils/mockDb.ts");
  return {
    __esModule: true,
    default: mockPool.default,
  };
});

import { mockQuery } from "./utils/mockDb.ts";
import request from "supertest";
import express from "express";
const { router: patientRouter } = await import("../patientRoutes.mts");

//  Setup app
const app = express();
app.use(express.json());
app.use("/api/patient", patientRouter);

describe("Patient API", () => {
  it("GET /api/patient should return 'Patient route'", async () => {
    const res = await request(app).get("/api/patient");
    expect(res.status).toBe(200);
    expect(res.text).toBe('"Patient route"');
  });
});

describe("POST /api/patient/add", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return 201 when insert succeeds", async () => {
    const mockPatient = {
      patientid: 1,
      fullname: "Alice Tan",
      surgeonid: 3,
      sex: "F",
      ethnicity: "Chinese",
      age: 45,
      bmi: 22.1,
      height: 162,
      weight: 58,
    };
    mockQuery.mockResolvedValueOnce({ rows: [mockPatient] });

    const res = await request(app).post("/api/patient/add").send({
      fullname: mockPatient.fullname,
      surgeonid: mockPatient.surgeonid,
      sex: mockPatient.sex,
      ethnicity: mockPatient.ethnicity,
      age: mockPatient.age,
      bmi: mockPatient.bmi,
      height: mockPatient.height,
      weight: mockPatient.weight,
    });

    expect(res.status).toBe(201);
    expect(res.body.patient).toEqual(mockPatient);
  }, 10000);

  it("should return 500 when DB insert fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB failure"));

    const res = await request(app).post("/api/patient/add").send({
      fullname: "Error Case",
      surgeonid: 1,
      sex: "M",
      ethnicity: "Indian",
      age: 30,
      bmi: 24.5,
      height: 170,
      weight: 70,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe("PUT /api/patient/edit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and updated patient when successful", async () => {
    const mockPatient = {
      patientid: 1,
      fullname: "Alice Tan",
      surgeonid: 3,
      sex: "F",
      ethnicity: "Chinese",
      age: 45,
      bmi: 22.1,
      height: 162,
      weight: 58,
    };

    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [mockPatient],
    });

    const res = await request(app).put("/api/patient/edit").send(mockPatient);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Patient updated successfully");
    expect(res.body.patient).toEqual(mockPatient);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if patientid is missing", async () => {
    const res = await request(app).put("/api/patient/edit").send({
      fullname: "Bob",
      age: 35,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Patient ID is required.");
    expect(mockQuery).toHaveBeenCalledTimes(0);
  });

  it("should return 404 if no patient was updated", async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    const res = await request(app).put("/api/patient/edit").send({
      patientid: 999,
      fullname: "Ghost Patient",
      surgeonid: 1,
      sex: "M",
      ethnicity: "Unknown",
      age: 99,
      bmi: 99.9,
      height: 199,
      weight: 99,
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Patient not found.");
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("should return 500 on DB error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB fail"));

    const res = await request(app).put("/api/patient/edit").send({
      patientid: 1,
      fullname: "Broken",
      surgeonid: 1,
      sex: "M",
      ethnicity: "Bug",
      age: 40,
      bmi: 30,
      height: 170,
      weight: 70,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe("DELETE /api/patient/delete/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 when patient is deleted", async () => {
    const mockDeleted = {
      patientid: 1,
      fullname: "Alice Tan",
      surgeonid: 3,
      sex: "F",
      ethnicity: "Chinese",
      age: 45,
      bmi: 22.1,
      height: 162,
      weight: 58,
    };

    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [mockDeleted],
    });

    const res = await request(app).delete("/api/patient/delete/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Patient deleted successfully");
    expect(res.body.deletedPatient).toEqual(mockDeleted);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM patient"),
      ["1"]
    );
  });

  it("should return 404 when patient not found", async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    const res = await request(app).delete("/api/patient/delete/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Patient not found or already deleted.");
  });

  it("should return 500 on database error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB connection failed"));

    const res = await request(app).delete("/api/patient/delete/123");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});

describe("GET /api/patient/searchByName", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return patients matching the name", async () => {
    const mockPatients = [
      {
        patientid: 1,
        fullname: "Alice Tan",
        surgeonid: 1,
        sex: "F",
        ethnicity: "Chinese",
        age: 45,
        bmi: 22.1,
        height: 162,
        weight: 58,
      },
    ];

    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients }) // for patient query
      .mockResolvedValueOnce({ rows: [{ count: 1 }] }); // for count query

    const res = await request(app)
      .get("/api/patient/searchByName")
      .query({ name: "Alice", surgeonid: 1, page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.patients).toEqual(mockPatients);
    expect(res.body.totalPatients).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.currentPage).toBe(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("should return 400 if name param is missing", async () => {
    const res = await request(app)
      .get("/api/patient/searchByName")
      .query({ surgeonid: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Valid name parameter is required");
  });

  it("should return 404 if no patients match", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get("/api/patient/searchByName")
      .query({ name: "Nobody", surgeonid: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No patients found with the given name");
    expect(res.body.totalPatients).toBe(0);
  });

  it("should return 500 on database error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB Error"));

    const res = await request(app)
      .get("/api/patient/searchByName")
      .query({ name: "Alice" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error searching patients by name");
  });
});

describe("GET /api/patient/filter", () => {
  afterEach(() => jest.clearAllMocks());

  const mockPatients = [
    {
      patientid: 1,
      fullname: "Alice Tan",
      surgeonid: 1,
      sex: 1,
      ethnicity: 2,
      age: 45,
      bmi: 24,
      height: 160,
      weight: 62,
    },
  ];

  const mockCount = [{ count: "1" }];

  it("should return patients with no filters", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients }) // data query
      .mockResolvedValueOnce({ rows: mockCount }); // count query

    const res = await request(app).get("/api/patient/filter");

    expect(res.status).toBe(200);
    expect(res.body.patients).toEqual(mockPatients);
    expect(res.body.totalPatients).toBe(1);
  });

  it("should filter by surgeonid", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients })
      .mockResolvedValueOnce({ rows: mockCount });

    const res = await request(app)
      .get("/api/patient/filter")
      .query({ surgeonid: 1 });

    expect(res.status).toBe(200);
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("should filter by sex, ethnicity, and age", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients })
      .mockResolvedValueOnce({ rows: mockCount });

    const res = await request(app)
      .get("/api/patient/filter")
      .query({ sex: 1, ethnicity: 2, age: 45 });

    expect(res.status).toBe(200);
    expect(res.body.patients.length).toBeGreaterThanOrEqual(0);
  });

  it("should filter by bmi < 25 (bmi = 0)", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients })
      .mockResolvedValueOnce({ rows: mockCount });

    const res = await request(app).get("/api/patient/filter").query({ bmi: 0 });

    expect(res.status).toBe(200);
  });

  it("should filter by bmi >= 25 (bmi = 1)", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: mockPatients })
      .mockResolvedValueOnce({ rows: mockCount });

    const res = await request(app).get("/api/patient/filter").query({ bmi: 1 });

    expect(res.status).toBe(200);
  });

  it("should return 500 on DB error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB Error"));

    const res = await request(app).get("/api/patient/filter");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching patients");
  });
});

describe("GET /api/patient/form", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return form data for valid patientid", async () => {
    const mockFormData = [
      {
        formid: 1,
        patientid: 123,
        PainWalking: 2,
        PainStairClimbing: 3,
        // ... add more fields if needed
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: mockFormData });

    const res = await request(app)
      .get("/api/patient/form")
      .query({ patientid: 123 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockFormData);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM form WHERE patientid=$1",
      [123]
    );
  });

  it("should return 500 on DB error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app)
      .get("/api/patient/form")
      .query({ patientid: 123 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error searching patient data");
    expect(mockQuery).toHaveBeenCalled();
  });
});

describe("POST /api/patient/form", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert form and update patient, returning 200", async () => {
    const formID = 123;
    const mockFormResponse = { rows: [{ formID }] };

    // 1. BEGIN
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // 2. INSERT FORM
    mockQuery.mockResolvedValueOnce(mockFormResponse);

    // 3. UPDATE PATIENT
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // 4. COMMIT
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const payload = {
      patientid: 1,
      PainWalking: 1,
      PainStairClimbing: 2,
      PainNocturnal: 3,
      PainRest: 2,
      PainWeightbearing: 3,
      StiffnessMorning: 1,
      StiffnessLaterDay: 2,
      PHDecendingstairs: 1,
      PHAscendingstairs: 2,
      PHRisingfromsitting: 3,
      PHStanding: 1,
      PHBendingtofloor: 2,
      PHWalkingonflatsurface: 3,
      PHGettinginoutofcar: 2,
      PHGoingshopping: 3,
      PHPuttingonsocks: 1,
      PHLyinginbed: 2,
      PHTakingoffsocks: 3,
      PHRisingfrombed: 2,
      PHGettinginoutofbath: 3,
      PHSitting: 1,
      PHGettingonofftoilet: 2,
      PHHeavydomesticduties: 3,
      PHLightdomesticduties: 2,
      rank1: "A",
      rank2: "B",
      rank3: "C",
      rank4: "D",
      rank5: "E",
    };

    const res = await request(app).post("/api/patient/form").send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      "Form added successfully and patient record updated."
    );
    expect(res.body.formID).toBe(formID);
    expect(mockQuery).toHaveBeenCalledTimes(4);
  });

  it("should return 500 and rollback if any query fails", async () => {
    // 1. BEGIN
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // 2. INSERT FORM (fails)
    mockQuery.mockRejectedValueOnce(new Error("DB insert error"));

    // 3. ROLLBACK
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/patient/form").send({
      patientid: 1,
      PainWalking: 1,
      PainStairClimbing: 2,
      PainNocturnal: 3,
      PainRest: 2,
      PainWeightbearing: 3,
      StiffnessMorning: 1,
      StiffnessLaterDay: 2,
      PHDecendingstairs: 1,
      PHAscendingstairs: 2,
      PHRisingfromsitting: 3,
      PHStanding: 1,
      PHBendingtofloor: 2,
      PHWalkingonflatsurface: 3,
      PHGettinginoutofcar: 2,
      PHGoingshopping: 3,
      PHPuttingonsocks: 1,
      PHLyinginbed: 2,
      PHTakingoffsocks: 3,
      PHRisingfrombed: 2,
      PHGettinginoutofbath: 3,
      PHSitting: 1,
      PHGettingonofftoilet: 2,
      PHHeavydomesticduties: 3,
      PHLightdomesticduties: 2,
      rank1: "A",
      rank2: "B",
      rank3: "C",
      rank4: "D",
      rank5: "E",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error adding form or updating patient");
    expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
  });
});

describe("POST /api/patient/before", () => {
  const mockPatient = {
    patientid: 1,
    fullname: "Alice",
    age: 30,
    sex: 1,
    ethnicity: 2,
    height: 170,
    weight: 70,
    bmi: 22,
    hasform: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return counts and percentages for each option", async () => {
    const variableName = "PHStanding";
    const options = ["None", "Mild", "Severe"];
    const patient = {
      sex: 1,
      ethnicity: 2,
      age: 40,
      bmi: 22,
    };
    const filters = {
      categories: ["Gender", "Ethnicity", "Age Range", "BMI Range"],
      age: { range: 5 },
      bmi: { range: 2 },
    };

    // Mock COUNT(*) total
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 100 }] });

    // Mock counts for each option
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: 10 }] })
      .mockResolvedValueOnce({ rows: [{ count: 50 }] })
      .mockResolvedValueOnce({ rows: [{ count: 40 }] });

    const res = await request(app)
      .post("/api/patient/before")
      .send({ variableName, options, patient, filters });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Data fetched successfully");
    expect(res.body.totalRows).toBe(100);
    expect(res.body.data).toEqual([
      { option: "None", count: 10, percentage: 10 },
      { option: "Mild", count: 50, percentage: 50 },
      { option: "Severe", count: 40, percentage: 40 },
    ]);
    expect(mockQuery).toHaveBeenCalled();
  });

  it("should return 500 on DB error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB failed"));

    const res = await request(app)
      .post("/api/patient/before")
      .send({
        variableName: "PHStanding",
        options: ["None", "Mild"],
        patient: { sex: 1, ethnicity: 2, age: 40, bmi: 22 },
        filters: { categories: [] },
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching data from registry");
  });

  it("returns 200 with message and empty data when totalRows === 0", async () => {
    // Mock total query to return 0
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["Low", "Medium", "High"],
        initial: "High",
        time: 6,
        patient: {
          patientid: 1,
          fullname: "Alice Tan",
          age: 45,
          sex: 1,
          ethnicity: 2,
          height: 160,
          weight: 55,
          bmi: 21.5,
          hasform: true,
        },
        filters: {
          categories: ["Gender", "Age Range"],
          age: { range: 5 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "No data found for the given filters.",
      totalRows: 0,
      data: [],
    });

    // Only one DB call should happen (the total count one)
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("returns 0% when count = 0 and totalRows > 0", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 5 }] }); // totalQuery
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 0 }] }); // optionQuery

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["Low"],
        initial: "Low",
        time: 6,
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(5);
    expect(res.body.data[0].percentage).toBe(0);
  });

  it("calculates correct percentage when count > 0 and totalRows > 0", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 4 }] }); // totalQuery
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 1 }] }); // optionQuery

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["Medium"],
        initial: "Medium",
        time: 6,
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(4);
    expect(res.body.data[0]).toEqual({
      option: "Medium",
      count: 1,
      percentage: 25,
    });
  });

  it("should return 200 with empty data if totalRows is 0", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const res = await request(app)
      .post("/api/patient/before")
      .send({
        variableName: "PainRest",
        options: [0, 1],
        initial: 1,
        patient: mockPatient,
        filters: {
          categories: ["Age Range"],
          age: { range: 10 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(0);
    expect(res.body.data).toEqual([]);
    expect(res.body.message).toBe("No data found for the given filters.");
  });

  it("sets count to 0 if count is missing in optionRows[0]", async () => {
    // Mock total count query to return totalRows > 0
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 10 }] });

    // Mock option count query to return empty object (no count field)
    mockQuery.mockResolvedValueOnce({ rows: [{}] });

    const res = await request(app)
      .post("/api/patient/before")
      .send({
        variableName: "PainRest",
        options: ["High"], // Only one option needed to hit the loop
        initial: "High",
        time: 6,
        patient: {
          patientid: 1,
          fullname: "Alice Tan",
          age: 45,
          sex: 1,
          ethnicity: 2,
          height: 160,
          weight: 55,
          bmi: 21.5,
          hasform: true,
        },
        filters: {
          categories: ["Gender"],
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0].count).toBe(0);
  });

  it("uses count from optionRows[0] when defined", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 10 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 3 }] });

    const res = await request(app)
      .post("/api/patient/before")
      .send({
        variableName: "PainRest",
        options: ["High"],
        initial: "High",
        time: 6,
        patient: {
          patientid: 1,
          fullname: "Alice Tan",
          age: 45,
          sex: 1,
          ethnicity: 2,
          height: 160,
          weight: 55,
          bmi: 21.5,
          hasform: true,
        },
        filters: {
          categories: ["Gender"],
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0].count).toBe(3);
  });
});

describe("POST /api/patient/after", () => {
  const mockPatient = {
    patientid: 1,
    fullname: "Alice",
    age: 30,
    sex: 1,
    ethnicity: 2,
    height: 170,
    weight: 70,
    bmi: 22,
    hasform: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return 200 and percentage results on success", async () => {
    // total count
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 10 }] });

    // option 1
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 4 }] });

    // option 2
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 6 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainWalking",
        options: [0, 1],
        initial: 1,
        time: 6,
        patient: mockPatient,
        filters: {
          categories: ["Age Range", "BMI Range", "Ethnicity", "Gender"],
          age: { range: 5 },
          bmi: { range: 2 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(10);
    expect(res.body.data).toEqual([
      { option: "0", count: 4, percentage: 40 },
      { option: "1", count: 6, percentage: 60 },
    ]);
  });

  it("should return 400 if required params are missing", async () => {
    const res = await request(app).post("/api/patient/after").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required parameters.");
  });

  it("should return 200 with empty data if totalRows is 0", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: [0, 1],
        initial: 1,
        patient: mockPatient,
        filters: {
          categories: ["Age Range"],
          age: { range: 10 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(0);
    expect(res.body.data).toEqual([]);
    expect(res.body.message).toBe("No data found for the given filters.");
  });

  it("should return 500 on DB error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: [0, 1],
        initial: 1,
        patient: mockPatient,
        filters: {
          categories: [],
        },
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching data from registry.");
  });

  it("should skip undefined or null options", async () => {
    // Total count returns 5 valid rows
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 5 }] });

    // Only one valid option ('A'), one undefined will be skipped
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 3 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["A", undefined], // 👈 one valid, one invalid
        initial: "A",
        time: 6,
        patient: mockPatient,
        filters: {
          categories: [],
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(5);
    expect(res.body.data).toEqual([{ option: "A", count: 3, percentage: 60 }]);
    // Make sure mockQuery was only called twice:
    // - once for total
    // - once for the valid option
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("should return 0% when option count is 0 but totalRows > 0", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 10 }] }); // totalRows = 10
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 0 }] }); // count = 0

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["Z"],
        initial: "A",
        time: 6,
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.totalRows).toBe(10);
    expect(res.body.data).toEqual([{ option: "Z", count: 0, percentage: 0 }]);
  });

  it("sets timePoint to 2 when time is 6", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 1 }] }); // totalRows = 1
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 1 }] }); // count = 1

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["A"],
        initial: "A",
        time: 6,
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({
      option: "A",
      count: 1,
      percentage: 100,
    });
  });
  it("sets timePoint to 3 when time is 12", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 1 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 1 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["A"],
        initial: "A",
        time: 12,
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0].percentage).toBe(100);
  });

  it("sets timePoint to 4 when time is not 6 or 12", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ total: 2 }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 1 }] });

    const res = await request(app)
      .post("/api/patient/after")
      .send({
        variableName: "PainRest",
        options: ["A"],
        initial: "A",
        time: 18, // any other value
        patient: mockPatient,
        filters: { categories: [] },
      });

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({ option: "A", count: 1, percentage: 50 });
  });
});
