-- FACULTY
CREATE TABLE faculty(
  id_faculty INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROGRAM
CREATE TABLE program (
  id_program INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  program_name VARCHAR(150) NOT NULL UNIQUE,
  id_faculty INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_faculty FOREIGN KEY (id_faculty) REFERENCES faculty(id_faculty)
);

-- ACADEMIC LEVELS
CREATE TABLE academic_levels (
  id_level INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR(150) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EMPLOYMENT STATUSES
CREATE TABLE employment_statuses (
  id_status INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR(150) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTORS
CREATE TABLE sectors (
  id_sector INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CONTRACT TYPES
CREATE TABLE contract_types (
  id_type INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  contract_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(150) NOT NULL UNIQUE,
  duration VARCHAR(19) NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GRADUATES
CREATE TABLE graduates (
  id_graduate INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  birth_date DATE,
  graduation_year INTEGER NOT NULL,
  id_level INTEGER NOT NULL,
  id_status INTEGER NOT NULL,
  id_program INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_level FOREIGN KEY (id_level) REFERENCES academic_levels(id_level),
  CONSTRAINT fk_status FOREIGN KEY (id_status) REFERENCES employment_statuses(id_status),
  CONSTRAINT fk_program FOREIGN KEY (id_program) REFERENCES program(id_program)
);

-- JOBS
CREATE TABLE jobs (
  id_job INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_graduate INTEGER NOT NULL,
  company VARCHAR(150) NOT NULL,
  id_sector INTEGER,
  position VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE,
  id_type INTEGER,
  related_to_career BOOLEAN,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_graduate FOREIGN KEY (id_graduate) REFERENCES graduates(id_graduate),
  CONSTRAINT fk_sector FOREIGN KEY (id_sector) REFERENCES sectors(id_sector),
  CONSTRAINT fk_type FOREIGN KEY (id_type) REFERENCES contract_types(id_type)
);

-- CONTINUING EDUCATION
CREATE TABLE continuing_education (
  id_continuing_education INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_graduate INTEGER NOT NULL,
  description_program VARCHAR(200),
  education_type VARCHAR(100),
  time TIME NOT NULL, 
  education_date DATE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ce_graduate FOREIGN KEY (id_graduate) REFERENCES graduates(id_graduate)
);

-- WORK SUPERVISOR
CREATE TABLE work_supervisor (
  id_supervisor INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_program INTEGER NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  id_graduate INTEGER NOT NULL,
  id_job INTEGER NOT NULL,
  contact_job VARCHAR(150) NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ws_program FOREIGN KEY (id_program) REFERENCES program(id_program),
  CONSTRAINT fk_ws_graduate FOREIGN KEY (id_graduate) REFERENCES graduates(id_graduate),
  CONSTRAINT fk_ws_job FOREIGN KEY (id_job) REFERENCES jobs(id_job)
);

-- JOB OFFER
CREATE TABLE job_offer (
  id_offer INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  position VARCHAR(150) NOT NULL,
  company VARCHAR(150) NOT NULL,
  salary DECIMAL(10,2),
  id_type INTEGER NOT NULL,
  area VARCHAR(150) NOT NULL,
  email_contact VARCHAR(150) NOT NULL,
  offer_date DATE NOT NULL,
  id_program INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_offer_type FOREIGN KEY (id_type) REFERENCES contract_types(id_type),
  CONSTRAINT fk_offer_program FOREIGN KEY (id_program) REFERENCES program(id_program)
);

-- USER TYPES
CREATE TABLE user_types(
  id_type INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR(150) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USERS
CREATE TABLE users (
  id_user INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL,
  id_type INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_type FOREIGN KEY (id_type) REFERENCES user_types(id_type)  
);
-- ==============================
-- 1. ZONA HORARIA (COLOMBIA)
-- ==============================
SET TIME ZONE 'America/Bogota';

-- (Opcional permanente a nivel BD)
-- ALTER DATABASE tu_basedatos SET timezone TO 'America/Bogota';


-- ==============================
-- 2. FUNCIÓN GLOBAL UPDATE_DATE
-- ==============================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.update_date = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==============================
-- 3. TRIGGERS PARA TODAS LAS TABLAS
-- ==============================

-- FACULTY
CREATE TRIGGER trg_faculty_update
BEFORE UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- PROGRAM
CREATE TRIGGER trg_program_update
BEFORE UPDATE ON program
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ACADEMIC LEVELS
CREATE TRIGGER trg_academic_levels_update
BEFORE UPDATE ON academic_levels
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- EMPLOYMENT STATUSES
CREATE TRIGGER trg_employment_statuses_update
BEFORE UPDATE ON employment_statuses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- SECTORS
CREATE TRIGGER trg_sectors_update
BEFORE UPDATE ON sectors
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- CONTRACT TYPES
CREATE TRIGGER trg_contract_types_update
BEFORE UPDATE ON contract_types
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- GRADUATES
CREATE TRIGGER trg_graduates_update
BEFORE UPDATE ON graduates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- JOBS
CREATE TRIGGER trg_jobs_update
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- CONTINUING EDUCATION
CREATE TRIGGER trg_continuing_education_update
BEFORE UPDATE ON continuing_education
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- WORK SUPERVISOR
CREATE TRIGGER trg_work_supervisor_update
BEFORE UPDATE ON work_supervisor
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- JOB OFFER
CREATE TRIGGER trg_job_offer_update
BEFORE UPDATE ON job_offer
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- USER TYPES
CREATE TRIGGER trg_user_types_update
BEFORE UPDATE ON user_types
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- USERS
CREATE TRIGGER trg_users_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- JOB INTERVIEW
CREATE TABLE job_interview (
  id_interview INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_graduate INTEGER NOT NULL,
  currently_employed BOOLEAN NOT NULL,
  related BOOLEAN NOT NULL,
  salary DECIMAL(10, 2),
  id_type INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_graduate_interview FOREIGN KEY (id_graduate) REFERENCES graduates(id_graduate),
  CONSTRAINT fk_type_interview FOREIGN KEY (id_type) REFERENCES contract_types(id_type)
);

CREATE TRIGGER trg_job_interview_update
BEFORE UPDATE ON job_interview
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

# en todas las tablas, booleano: ture = activo, false = eliminado.
# campos create y update son automaticos usar hora col.
# jwt consultar token - temporal - cifrado ¿? - api
# metodo en users
# funcionamiento de roles | administrativo (docente, decano) | administrador ! egresados 
# power BI para reportes // acceso a los reportes de los egresados. con api.
# quitar update y create de los modelos