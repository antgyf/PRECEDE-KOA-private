-- ==============================
-- 1. Users
-- ==============================

-- Surgeon table
DROP TABLE IF EXISTS surgeon CASCADE;
CREATE TABLE surgeon (
    surgeonid INT PRIMARY KEY,
    surgeontitle TEXT NOT NULL,
    username TEXT UNIQUE,
    password TEXT
);

-- Researcher table
DROP TABLE IF EXISTS researcher CASCADE;
CREATE TABLE researcher (
    researcherID SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- ==============================
-- 2. Patient and Surgery
-- ==============================

-- Patient table
DROP TABLE IF EXISTS patient CASCADE;
CREATE TABLE patient (
    patientid SERIAL PRIMARY KEY,
    surgeonid INT NOT NULL,
    surgeontitle TEXT NOT NULL,
    fullname TEXT NOT NULL,
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL,
    hasform BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fksurgeon FOREIGN KEY (surgeonid) REFERENCES surgeon(surgeonid) ON DELETE CASCADE
);

-- Reference Patient table (patients from dataset)
DROP TABLE IF EXISTS referencepatient CASCADE;
CREATE TABLE referencepatient (
    referencepatientid INT PRIMARY KEY,
    surgeontitle TEXT NOT NULL,                  -- keep snapshot like surgery
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL,
    operationdate DATE NOT NULL,
    simbilateral BOOLEAN NOT NULL DEFAULT FALSE,     -- SimBK
    stagedbilateral BOOLEAN NOT NULL DEFAULT FALSE,  -- StaBK
    orderinstage INT,                               -- orderSID
    stageinterval INT,                                -- StaBKINT
    side INT                                      -- left/right/both
);

-- ==============================
-- 3. Registry + Forms
-- ==============================

-- Form table
DROP TABLE IF EXISTS refform CASCADE;
CREATE TABLE refform (
    formid SERIAL PRIMARY KEY,
    referencepatientid INT NOT NULL REFERENCES referencepatient(referencepatientid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (referencepatientid, term) -- prevent duplicates
);

-- Question table
DROP TABLE IF EXISTS question CASCADE;
CREATE TABLE question (
    questionid SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,        -- e.g. 'OKS1', 'EQ5D-Mobility'
    text TEXT NOT NULL
);

-- Form Response table
DROP TABLE IF EXISTS refformresponse CASCADE;
CREATE TABLE refformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES refform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT NOT NULL,   -- assuming integer scale responses
    UNIQUE (formid, questionid) -- prevent duplicates
);

DROP TABLE IF EXISTS patientform CASCADE;
CREATE TABLE patientform (
    formid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    term INT NOT NULL,   -- 0 for 'T0', 1 for 'T1', etc.
    UNIQUE (patientid, term) -- prevent duplicates
);

DROP TABLE IF EXISTS patientformresponse CASCADE;
CREATE TABLE patientformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES patientform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT,
    UNIQUE (formid, questionid) -- prevent duplicates
);

CREATE TABLE patientpriority (
    priorityid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    term INT NOT NULL,  -- so priorities can differ at T0, T1, etc
    UNIQUE (patientid, questionid, term) -- prevent duplicates
);

-- ==============================
-- 4. Seed Questions
-- ==============================

INSERT INTO question (code, text) VALUES
('KFS', 'Function stairs'),
('KFW', 'Function walking'),
('KPAIN', 'Knee pain overall'),
('EQ5D-MOB', 'EQ-5D: Mobility'),
('EQ5D-SC', 'EQ-5D: Self-care'),
('EQ5D-UA', 'EQ-5D: Usual activities'),
('EQ5D-PD', 'EQ-5D: Pain/discomfort'),
('EQ5D-AD', 'EQ-5D: Anxiety/depression'),
('OKS1', 'During the past 4 weeks, how severe was your knee pain?'),
('OKS2', 'Can you wash and dry yourself?'),
('OKS3', 'Do you have pain when using transport?'),
('OKS4', 'Do you have pain walking?'),
('OKS5', 'Do you have pain rising from sitting?'),
('OKS6', 'Do you limp when walking?'),
('OKS7', 'Do you have pain kneeling?'),
('OKS8', 'Do you have pain lying in bed?'),
('OKS9', 'Do you have pain doing usual activities?'),
('OKS10', 'Does your knee ever give way?'),
('OKS11', 'Can you go shopping?'),
('OKS12', 'Do you have difficulty with stairs?');

-- ==============================
-- 5. Staging Raw Table
-- ==============================

DROP TABLE IF EXISTS stagingraw CASCADE;
CREATE TABLE stagingraw (
    pid INT, 
    simbk INT, 
    stabk INT, 
    ordersid INT, 
    opdate DATE,
    stabk_int INT, 
    side TEXT, 
    weightkg NUMERIC(5, 2), 
    heightcm NUMERIC(5, 2), 
    bmi NUMERIC(5, 2), 
    age INT, 
    gender TEXT,
    race TEXT,
    surgeon INT,
    surgeont TEXT,
    kfwt0 INT,
    kfst0 INT,
    kpaint0 INT,
    okfwt0 INT,
    okfst0 INT,
    okpaint0 INT,
    oks1t0 INT,
    oks2t0 INT,
    oks3t0 INT,
    oks4t0 INT,
    oks5t0 INT,
    oks6t0 INT,
    oks7t0 INT,
    oks8t0 INT,
    oks9t0 INT,
    oks10t0 INT,
    oks11t0 INT,
    oks12t0 INT,
    emot0 INT,
    esct0 INT,
    euat0 INT,
    epdt0 INT,
    eadt0 INT,
    kfwt1 INT,
    kfst1 INT,
    kpaint1 INT,
    okfwt1 INT,
    okfst1 INT,
    okpaint1 INT,
    oks1t1 INT,
    oks2t1 INT,
    oks3t1 INT,
    oks4t1 INT,
    oks5t1 INT,
    oks6t1 INT,
    oks7t1 INT,
    oks8t1 INT,
    oks9t1 INT,
    oks10t1 INT,
    oks11t1 INT,
    oks12t1 INT,
    emot1 INT,
    esct1 INT,
    euat1 INT,
    epdt1 INT,
    eadt1 INT,
    kfwt2 INT,
    kfst2 INT,
    kpaint2 INT,
    okfwt2 INT,
    okfst2 INT,
    okpaint2 INT,
    oks1t2 INT,
    oks2t2 INT,
    oks3t2 INT,
    oks4t2 INT,
    oks5t2 INT,
    oks6t2 INT,
    oks7t2 INT,
    oks8t2 INT,
    oks9t2 INT,
    oks10t2 INT,
    oks11t2 INT,
    oks12t2 INT,
    emot2 INT,
    esct2 INT,
    euat2 INT,
    epdt2 INT,
    eadt2 INT,
    kfwt3 INT,
    kfst3 INT,
    kpaint3 INT,
    okfwt3 INT,
    okfst3 INT,
    okpaint3 INT,
    oks1t3 INT,
    oks2t3 INT,
    oks3t3 INT,
    oks4t3 INT,
    oks5t3 INT,
    oks6t3 INT,
    oks7t3 INT,
    oks8t3 INT,
    oks9t3 INT,
    oks10t3 INT,
    oks11t3 INT,
    oks12t3 INT,
    emot3 INT,
    esct3 INT,
    euat3 INT,
    epdt3 INT,
    eadt3 INT,
    kfwt4 INT,
    kfst4 INT,
    kpaint4 INT,
    okfwt4 INT,
    okfst4 INT,
    okpaint4 INT,
    oks1t4 INT,
    oks2t4 INT,
    oks3t4 INT,
    oks4t4 INT,
    oks5t4 INT,
    oks6t4 INT,
    oks7t4 INT,
    oks8t4 INT,
    oks9t4 INT,
    oks10t4 INT,
    oks11t4 INT,
    oks12t4 INT,
    emot4 INT,
    esct4 INT,
    euat4 INT,
    epdt4 INT,
    eadt4 INT
);


--==============================--
-- 6. INSERTING DATA
--==============================--
-- Insert into surgeon from stagingraw
INSERT INTO surgeon (surgeonid, surgeontitle, username, password)
SELECT DISTINCT
    surgeon     AS surgeonid,
    surgeont    AS surgeontitle,
    NULL        AS username,
    NULL        AS password
FROM stagingraw
ON CONFLICT (surgeonid) DO NOTHING;

-- Insert into referencepatient from stagingraw where stab
-- Insert staged bilateral patients from stagingraw into referencepatient

WITH ops AS (
  SELECT
    sr.*,
    ROW_NUMBER() OVER (PARTITION BY pid ORDER BY opdate) AS rn,
    COUNT(*)     OVER (PARTITION BY pid) AS totalops
  FROM stagingraw sr
  WHERE pid IS NOT NULL
    AND opdate IS NOT NULL
),

onetkr AS (
  SELECT *
  FROM ops
  WHERE totalops = 1
    AND rn = 1
)

INSERT INTO referencepatient (
  surgeontitle,
  sex,
  ethnicity,
  age,
  height,
  weight,
  bmi,
  operationdate,
  simbilateral,
  stagedbilateral,
  orderinstage,
  stageinterval
)
SELECT
  surgeont AS surgeontitle,
  CASE gender
    WHEN 'Male' THEN 1
    WHEN 'Female' THEN 2
    ELSE 0
  END AS gender,
  CASE race
    WHEN 'Chinese' THEN 1
    WHEN 'Malay' THEN 2
    WHEN 'Indian' THEN 3
    WHEN 'Caucasian' THEN 4
    ELSE 0
  END AS ethnicity,
  age,
  heightcm::numeric(5,2) AS height,
  weightkg::numeric(5,2) AS weight,
  bmi::numeric(5,2) AS bmi,
  opdate,
  FALSE AS simbilateral,
  TRUE AS stagedbilateral,
  ordersid,
  stabk_int
FROM onetkr
WHERE stabk = 1;


INSERT INTO referencepatient (
    referencepatientid,
    surgeontitle,
    sex,
    ethnicity,
    age,
    height,
    weight,
    bmi,
	operationdate,
	simbilateral,
    stagedbilateral,
	orderinstage,
	stageinterval
)
SELECT 
    sr.pid,
    sr.surgeont,
    CASE 
        WHEN sr.gender = 'Male' THEN 0
        WHEN sr.gender = 'Female' THEN 1
        ELSE 0
    END AS gendercode,
    CASE 
        WHEN sr.race = 'Chinese' THEN 0
        WHEN sr.race = 'Malay' THEN 1
        WHEN sr.race = 'Indian' THEN 2
        WHEN sr.race = 'Caucasian' THEN 3
        WHEN sr.race = 'Others' THEN 4
        ELSE -1
    END AS ethnicitycode,
    sr.age,
    sr.heightcm,
    sr.weightkg,
    sr.bmi,
	sr.opdate,
	FALSE,
	TRUE,
	sr.ordersid,
	sr.stabk_int
FROM stagingraw sr
WHERE sr.stabk_int >= 6

-- insert referencepatient for simbk patients
INSERT INTO referencepatient (
    referencepatientid,
    surgeontitle,
    sex,
    ethnicity,
    age,
    height,
    weight,
    bmi,
    operationdate,
    simbilateral,
    stagedbilateral,
    orderinstage,
    stageinterval
)
SELECT 
    sr.pid,
    sr.surgeont,
    CASE 
        WHEN sr.gender = 'Male' THEN 0
        WHEN sr.gender = 'Female' THEN 1
        ELSE 0
    END AS gendercode,
    CASE 
        WHEN sr.race = 'Chinese' THEN 0
        WHEN sr.race = 'Malay' THEN 1
        WHEN sr.race = 'Indian' THEN 2
        WHEN sr.race = 'Caucasian' THEN 3
        WHEN sr.race = 'Others' THEN 4
        ELSE -1
    END AS ethnicitycode,
    sr.age,
    sr.heightcm,
    sr.weightkg,
    sr.bmi,
    sr.opdate,
    TRUE AS simbilateral,      -- ✅ simultaneous
    FALSE AS stagedbilateral,  -- ✅ not staged
    0 AS orderinstage,         -- always 0 since not staged
    0 AS stageinterval      -- no interval since not staged
FROM stagingraw sr
WHERE sr.simbk = 1
  AND sr.stabk = 0
  AND sr.stabk_int IS NULL;

-- Insert into form and formresponse from stagingraw
-- This involves unpivoting the wide format of responses into a long format
-- Step 1: Flatten all patient responses across timepoints
-- Step 1: Flatten all patient responses across timepoints
WITH flattened AS (
    -- T0
    SELECT rp.referencepatientid, 0 AS term, 'KFW' AS code, sr.kfwt0 AS answervalue
    FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'KFS', sr.kfst0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'KPAIN', sr.kpaint0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS1', sr.oks1t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS2', sr.oks2t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS3', sr.oks3t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS4', sr.oks4t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS5', sr.oks5t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS6', sr.oks6t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS7', sr.oks7t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS8', sr.oks8t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS9', sr.oks9t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS10', sr.oks10t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS11', sr.oks11t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS12', sr.oks12t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'EQ5D-MOB', sr.emot0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'EQ5D-SC', sr.esct0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'EQ5D-UA', sr.euat0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'EQ5D-PD', sr.epdt0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 0, 'EQ5D-AD', sr.eadt0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid

    -- T1
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KFW', sr.kfwt1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KFS', sr.kfst1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KPAIN', sr.kpaint1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS1', sr.oks1t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS2', sr.oks2t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS3', sr.oks3t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS4', sr.oks4t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS5', sr.oks5t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS6', sr.oks6t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS7', sr.oks7t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS8', sr.oks8t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS9', sr.oks9t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS10', sr.oks10t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS11', sr.oks11t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS12', sr.oks12t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'EQ5D-MOB', sr.emot1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'EQ5D-SC', sr.esct1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'EQ5D-UA', sr.euat1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'EQ5D-PD', sr.epdt1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 1, 'EQ5D-AD', sr.eadt1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid

    -- T2
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KFW', sr.kfwt2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KFS', sr.kfst2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KPAIN', sr.kpaint2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS1', sr.oks1t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS2', sr.oks2t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS3', sr.oks3t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS4', sr.oks4t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS5', sr.oks5t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS6', sr.oks6t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS7', sr.oks7t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS8', sr.oks8t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS9', sr.oks9t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS10', sr.oks10t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS11', sr.oks11t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS12', sr.oks12t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'EQ5D-MOB', sr.emot2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'EQ5D-SC', sr.esct2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'EQ5D-UA', sr.euat2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'EQ5D-PD', sr.epdt2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 2, 'EQ5D-AD', sr.eadt2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid

    -- T3
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KFW', sr.kfwt3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KFS', sr.kfst3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KPAIN', sr.kpaint3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS1', sr.oks1t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS2', sr.oks2t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS3', sr.oks3t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS4', sr.oks4t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS5', sr.oks5t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS6', sr.oks6t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS7', sr.oks7t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS8', sr.oks8t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS9', sr.oks9t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS10', sr.oks10t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS11', sr.oks11t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS12', sr.oks12t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'EQ5D-MOB', sr.emot3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'EQ5D-SC', sr.esct3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'EQ5D-UA', sr.euat3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'EQ5D-PD', sr.epdt3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 3, 'EQ5D-AD', sr.eadt3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid

    -- T4
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KFW', sr.kfwt4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KFS', sr.kfst4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KPAIN', sr.kpaint4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS1', sr.oks1t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS2', sr.oks2t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS3', sr.oks3t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS4', sr.oks4t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS5', sr.oks5t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS6', sr.oks6t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS7', sr.oks7t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS8', sr.oks8t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS9', sr.oks9t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS10', sr.oks10t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS11', sr.oks11t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS12', sr.oks12t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'EQ5D-MOB', sr.emot4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'EQ5D-SC', sr.esct4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'EQ5D-UA', sr.euat4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'EQ5D-PD', sr.epdt4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    UNION ALL
    SELECT rp.referencepatientid, 4, 'EQ5D-AD', sr.eadt4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
),

-- Step 2: Insert forms
insertedforms AS (
    INSERT INTO refform (referencepatientid, term)
    SELECT DISTINCT referencepatientid, term
    FROM flattened
    RETURNING formid, referencepatientid, term
)

-- Step 3: Insert form responses
INSERT INTO refformresponse (formid, questionid, answervalue)
SELECT
    f.formid,
    q.questionid,
    fl.answervalue
FROM insertedforms f
JOIN flattened fl
    ON f.referencepatientid = fl.referencepatientid
    AND f.term = fl.term
JOIN question q
    ON q.code = fl.code
WHERE fl.answervalue IS NOT NULL;
