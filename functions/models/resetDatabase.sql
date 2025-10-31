-- ============================================
-- Database Reset Script for Testing
-- Run this in pgAdmin to completely reset the database
-- ============================================

-- ==============================
-- 1. CLEANUP - Drop all tables in correct order
-- ==============================

DO $$ 
BEGIN
    RAISE NOTICE 'Starting database reset...';
    
    -- Drop tables in reverse dependency order
    DROP TABLE IF EXISTS patientpriority CASCADE;
    DROP TABLE IF EXISTS patientformresponse CASCADE;
    DROP TABLE IF EXISTS patientform CASCADE;
    DROP TABLE IF EXISTS refformresponse CASCADE;
    DROP TABLE IF EXISTS refform CASCADE;
    DROP TABLE IF EXISTS referencepatient CASCADE;
    DROP TABLE IF EXISTS patient CASCADE;
    DROP TABLE IF EXISTS stagingraw CASCADE;
    DROP TABLE IF EXISTS question CASCADE;
    DROP TABLE IF EXISTS researcher CASCADE;
    DROP TABLE IF EXISTS surgeon CASCADE;
    
    RAISE NOTICE 'All tables dropped successfully';
END $$;

-- ==============================
-- 2. RECREATE TABLES
-- ==============================

-- Surgeon table
CREATE TABLE surgeon (
    surgeonid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Researcher table
CREATE TABLE researcher (
    researcherid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Patient table
CREATE TABLE patient (
    patientid SERIAL PRIMARY KEY,
    fullname TEXT NOT NULL,
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL,
    hasform BOOLEAN NOT NULL DEFAULT FALSE
);

-- Reference Patient table (patients from dataset)
CREATE TABLE referencepatient (
    referencepatientid INT NOT NULL PRIMARY KEY,
    surgeonid INT NOT NULL,
    surgeontitle TEXT NOT NULL,
    sex INT NOT NULL,
    ethnicity INT NOT NULL,
    age INT NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    bmi NUMERIC(5, 2) NOT NULL,
    operationdate DATE NOT NULL,
    simbilateral BOOLEAN NOT NULL DEFAULT FALSE,
    stagedbilateral BOOLEAN NOT NULL DEFAULT FALSE,
    orderinstage INT,
    stageinterval INT,
    side INT NOT NULL
);

-- Question table
CREATE TABLE question (
    questionid SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    text TEXT NOT NULL
);

-- Form tables
CREATE TABLE refform (
    formid SERIAL PRIMARY KEY,
    referencepatientid INT NOT NULL REFERENCES referencepatient(referencepatientid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (referencepatientid, term)
);

CREATE TABLE refformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES refform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT NOT NULL,
    UNIQUE (formid, questionid)
);

CREATE TABLE patientform (
    formid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (patientid, term)
);

CREATE TABLE patientformresponse (
    responseid SERIAL PRIMARY KEY,
    formid INT NOT NULL REFERENCES patientform(formid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    answervalue INT,
    UNIQUE (formid, questionid)
);

CREATE TABLE patientpriority (
    priorityid SERIAL PRIMARY KEY,
    patientid INT NOT NULL REFERENCES patient(patientid) ON DELETE CASCADE,
    questionid INT NOT NULL REFERENCES question(questionid) ON DELETE CASCADE,
    term INT NOT NULL,
    UNIQUE (patientid, questionid, term)
);

-- Staging Raw Table
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
    eadt4 INT,
    ooks1t0 INT,
    ooks2t0 INT,
    ooks3t0 INT,
    ooks4t0 INT,
    ooks5t0 INT,
    ooks6t0 INT,
    ooks7t0 INT,
    ooks8t0 INT,
    ooks9t0 INT,
    ooks10t0 INT,
    ooks11t0 INT,
    ooks12t0 INT,
    ooks1t1 INT,
    ooks2t1 INT,
    ooks3t1 INT,
    ooks4t1 INT,
    ooks5t1 INT,
    ooks6t1 INT,
    ooks7t1 INT,
    ooks8t1 INT,
    ooks9t1 INT,
    ooks10t1 INT,
    ooks11t1 INT,
    ooks12t1 INT,
    ooks1t2 INT,
    ooks2t2 INT,
    ooks3t2 INT,
    ooks4t2 INT,
    ooks5t2 INT,
    ooks6t2 INT,
    ooks7t2 INT,
    ooks8t2 INT,
    ooks9t2 INT,
    ooks10t2 INT,
    ooks11t2 INT,
    ooks12t2 INT,
    ooks1t3 INT,
    ooks2t3 INT,
    ooks3t3 INT,
    ooks4t3 INT,
    ooks5t3 INT,
    ooks6t3 INT,
    ooks7t3 INT,
    ooks8t3 INT,
    ooks9t3 INT,
    ooks10t3 INT,
    ooks11t3 INT,
    ooks12t3 INT,
    ooks1t4 INT,
    ooks2t4 INT,
    ooks3t4 INT,
    ooks4t4 INT,
    ooks5t4 INT,
    ooks6t4 INT,
    ooks7t4 INT,
    ooks8t4 INT,
    ooks9t4 INT,
    ooks10t4 INT,
    ooks11t4 INT,
    ooks12t4 INT
);

DO $$ 
BEGIN
    RAISE NOTICE 'All tables recreated successfully';
END $$;

-- ==============================
-- 3. SEED STATIC DATA
-- ==============================

-- Seed Questions (without EQ5D as requested)
INSERT INTO question (code, text) VALUES
('KFS', 'How well can you use stairs?'),
('KFW', 'How far can you walk?'),
('KPAIN', 'How is your overall knee pain?'),
('EQ5D-MOB', 'Did you have problems in walking about today?'),
('EQ5D-SC', 'Did you have problems in washing or dressing yourself today?'),
('EQ5D-UA', 'Did you have problems in doing your usual activities today? (e.g. work, study, housework, family or leisure activities)'),
('EQ5D-PD', 'Did you have any pain/discomfort today?'),
('EQ5D-AD', 'Did you feel anxious/depressed today?'),
('OKS1', 'How would you describe the pain you usually have from your knee?'),
('OKS2', 'Have you had any trouble with washing and drying yourself (all over) because of your knee?'),
('OKS3', 'Have you had any trouble getting in and out of a car or using public transport because of your knee? (whichever you tend to use)'),
('OKS4', 'For how long have you been able to walk before pain from your knee becomes severe? (with or without a stick)'),
('OKS5', 'After a meal (sat at a table), how painful has it been for you to stand up from a chair because of your knee?'),
('OKS6', 'Have you been limping when walking, because of your knee?'),
('OKS7', 'Could you kneel down and get up again afterwards?'),
('OKS8', 'Have you been troubled by pain from your knee in bed at night?'),
('OKS9', 'How much has pain from your knee interfered with your usual work (including housework)?'),
('OKS10', 'Have you felt that your knee might suddenly "give way" or let you down?'),
('OKS11', 'Could you do the household shopping on your own?'),
('OKS12', 'Could you walk down one flight of stairs?');

DO $$ 
BEGIN
    RAISE NOTICE 'Static data seeded successfully';
    RAISE NOTICE 'Questions inserted: %', (SELECT COUNT(*) FROM question);
END $$;

-- ==============================
-- 4. LOAD STAGING DATA (You'll need to modify this part)
-- ==============================

DO $$ 
BEGIN
    -- Clear any existing data first
    TRUNCATE TABLE stagingraw;
    
    -- Load from CSV - use single quotes only and forward slashes
    COPY stagingraw FROM 'C:/Program Files/PostgreSQL/17/data/CLEANED PROCEED App TKA 2024 KSS-3 OKS-12 EQ5D3L-5 (2).csv' DELIMITER ',' CSV HEADER;
    
    RAISE NOTICE 'Staging data loaded successfully';
    RAISE NOTICE 'Records in stagingraw: %', (SELECT COUNT(*) FROM stagingraw);
    
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not load staging data automatically: %', SQLERRM;
        RAISE NOTICE 'Please load staging data manually using pgAdmin import tool';
        RAISE NOTICE 'Expected file format: CSV with headers matching stagingraw columns';
END $$;

-- ==============================
-- 5. POPULATE REFERENCE PATIENTS AND FORMS
-- ==============================

DO $$ 
DECLARE
    staged_count INT;
    single_count INT;
    form_count INT;
    response_count INT;
BEGIN
    -- Insert staged bilateral patients
    INSERT INTO referencepatient (
        referencepatientid, surgeonid, surgeontitle, sex, ethnicity, age, height, weight, bmi,
        operationdate, simbilateral, stagedbilateral, orderinstage, stageinterval, side
    )
    SELECT 
        sr.pid AS referencepatientid,
        sr.surgeon AS surgeonid,
        sr.surgeont AS surgeontitle,
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
        sr.stabk_int,
        CASE 
            WHEN sr.side = 'L' THEN 0
            WHEN sr.side = 'R' THEN 1
            WHEN sr.side = 'Lt' THEN 0
            WHEN sr.side = 'Rt' THEN 1
            WHEN sr.side = 'Left' THEN 0
            WHEN sr.side = 'Right' THEN 1
            ELSE -1
        END AS side
    FROM stagingraw sr
    WHERE sr.simbk = 0
    AND sr.stabk = 1
    AND sr.ordersid = 1
    AND sr.stabk_int > 6;
    
    GET DIAGNOSTICS staged_count = ROW_COUNT;
    
    -- Insert single surgery patients
    INSERT INTO referencepatient (
        referencepatientid, surgeonid, surgeontitle, sex, ethnicity, age, height, weight, bmi,
        operationdate, simbilateral, stagedbilateral, orderinstage, stageinterval, side
    )
    SELECT 
        sr.pid AS referencepatientid,
        sr.surgeon AS surgeonid,
        sr.surgeont AS surgeontitle,
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
        FALSE AS simbilateral,
        FALSE AS stagedbilateral,
        0 AS orderinstage,
        0 AS stageinterval,
        CASE 
            WHEN sr.side = 'L' THEN 0
            WHEN sr.side = 'R' THEN 1
            WHEN sr.side = 'Lt' THEN 0
            WHEN sr.side = 'Rt' THEN 1
            WHEN sr.side = 'Left' THEN 0
            WHEN sr.side = 'Right' THEN 1
            ELSE -1
        END AS side
    FROM stagingraw sr
    WHERE sr.simbk = 0
      AND sr.stabk = 0
      AND sr.age IS NOT NULL;
    
    GET DIAGNOSTICS single_count = ROW_COUNT;
    
    RAISE NOTICE 'Reference patients inserted - Staged: %, Single: %', staged_count, single_count;
    
-- Insert into form and formresponse from stagingraw
-- This involves unpivoting the wide format of responses into a long format
-- Step 1: Flatten all patient responses across timepoints
    WITH flattened AS (
    -- T0
    SELECT rp.referencepatientid, 0 AS term, 'KFW' AS code, sr.kfwt0 AS answervalue
    FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'KFS', sr.kfst0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'KPAIN', sr.kpaint0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS1', sr.oks1t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS2', sr.oks2t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS3', sr.oks3t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS4', sr.oks4t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS5', sr.oks5t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS6', sr.oks6t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS7', sr.oks7t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS8', sr.oks8t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS9', sr.oks9t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS10', sr.oks10t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS11', sr.oks11t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 
    UNION ALL
    SELECT rp.referencepatientid, 0, 'OKS12', sr.oks12t0 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6)) 

    -- T1
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KFW', sr.kfwt1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KFS', sr.kfst1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'KPAIN', sr.kpaint1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS1', sr.oks1t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS2', sr.oks2t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS3', sr.oks3t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS4', sr.oks4t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS5', sr.oks5t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS6', sr.oks6t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS7', sr.oks7t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS8', sr.oks8t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS9', sr.oks9t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS10', sr.oks10t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS11', sr.oks11t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 1, 'OKS12', sr.oks12t1 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))

    -- T2
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KFW', sr.kfwt2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KFS', sr.kfst2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'KPAIN', sr.kpaint2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS1', sr.oks1t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS2', sr.oks2t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS3', sr.oks3t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS4', sr.oks4t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS5', sr.oks5t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS6', sr.oks6t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS7', sr.oks7t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS8', sr.oks8t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS9', sr.oks9t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS10', sr.oks10t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS11', sr.oks11t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 2, 'OKS12', sr.oks12t2 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))

    -- T3
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KFW', sr.kfwt3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KFS', sr.kfst3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'KPAIN', sr.kpaint3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS1', sr.oks1t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS2', sr.oks2t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS3', sr.oks3t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS4', sr.oks4t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS5', sr.oks5t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))   
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS6', sr.oks6t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS7', sr.oks7t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS8', sr.oks8t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS9', sr.oks9t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS10', sr.oks10t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS11', sr.oks11t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 3, 'OKS12', sr.oks12t3 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))

    -- T4
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KFW', sr.kfwt4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KFS', sr.kfst4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'KPAIN', sr.kpaint4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS1', sr.oks1t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS2', sr.oks2t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS3', sr.oks3t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS4', sr.oks4t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS5', sr.oks5t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS6', sr.oks6t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS7', sr.oks7t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS8', sr.oks8t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS9', sr.oks9t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS10', sr.oks10t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS11', sr.oks11t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
    UNION ALL
    SELECT rp.referencepatientid, 4, 'OKS12', sr.oks12t4 FROM stagingraw sr
    JOIN referencepatient rp ON rp.referencepatientid = sr.pid
    WHERE ((sr.stabk = 0 AND sr.simbk = 0) OR (sr.stabk = 1 AND sr.ordersid = 1 AND sr.stabk_int > 6))
),
    insertedforms AS (
        INSERT INTO refform (referencepatientid, term)
        SELECT DISTINCT referencepatientid, term
        FROM flattened
        RETURNING formid, referencepatientid, term
    )
    INSERT INTO refformresponse (formid, questionid, answervalue)
    SELECT
        f.formid,
        q.questionid,
        fl.answervalue
    FROM insertedforms f
    JOIN flattened fl ON f.referencepatientid = fl.referencepatientid AND f.term = fl.term
    JOIN question q ON q.code = fl.code
    WHERE fl.answervalue IS NOT NULL;
    
    GET DIAGNOSTICS form_count = ROW_COUNT;
    
    SELECT COUNT(*) INTO response_count FROM refformresponse;
    
    RAISE NOTICE 'Forms and responses populated - Forms: %, Responses: %', form_count, response_count;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during data population: %', SQLERRM;
        RAISE;
END $$;

-- ==============================
-- 6. FINAL VERIFICATION
-- ==============================

DO $$ 
DECLARE
    total_patients INT;
    total_forms INT;
    total_responses INT;
BEGIN
    SELECT COUNT(*) INTO total_patients FROM referencepatient;
    SELECT COUNT(*) INTO total_forms FROM refform;
    SELECT COUNT(*) INTO total_responses FROM refformresponse;
    
    RAISE NOTICE '=== DATABASE RESET COMPLETE ===';
    RAISE NOTICE 'Total reference patients: %', total_patients;
    RAISE NOTICE 'Total forms: %', total_forms;
    RAISE NOTICE 'Total form responses: %', total_responses;
    RAISE NOTICE '=== Ready for testing ===';
END $$;
