-- Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Candidates/Healthcare Professionals Table  
CREATE TABLE IF NOT EXISTS candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Healthcare Profiles Table (detailed information matching Figma exactly)
CREATE TABLE IF NOT EXISTS healthcare_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  
  -- 1-Trade Information
  trade_applied_for VARCHAR(255),
  availability_to_join VARCHAR(100),
  willingness_to_relocate ENUM('yes', 'no'),
  
  -- 2-Personal Information
  photo_url VARCHAR(500),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  father_husband_name VARCHAR(255),
  marital_status VARCHAR(50),
  gender VARCHAR(20),
  religion VARCHAR(50),
  date_of_birth DATE,
  place_of_birth VARCHAR(255),
  province VARCHAR(100),
  country VARCHAR(100),
  cnic VARCHAR(50),
  cnic_issue_date DATE,
  cnic_expire_date DATE,
  passport_number VARCHAR(50),
  passport_issue_date DATE,
  passport_expire_date DATE,
  email_address VARCHAR(255),
  confirm_email_address VARCHAR(255),
  tel_off_no VARCHAR(50),
  tel_res_no VARCHAR(50),
  mobile_no VARCHAR(50),
  present_address TEXT,
  present_street VARCHAR(255),
  present_postal_code VARCHAR(20),
  permanent_address TEXT,
  permanent_street VARCHAR(255),
  permanent_postal_code VARCHAR(20),
  same_as_present_address BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 4-Education & Certifications Table
CREATE TABLE IF NOT EXISTS education_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  degree_diploma_title VARCHAR(255),
  university_institute_name VARCHAR(255),
  graduation_year VARCHAR(10),
  program_duration VARCHAR(50),
  registration_number VARCHAR(100),
  marks_percentage VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 3-Professional Details / Work Experience Table
CREATE TABLE IF NOT EXISTS work_experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  job_title VARCHAR(255),
  employer_hospital VARCHAR(255),
  specialization VARCHAR(255),
  from_date DATE,
  to_date DATE,
  total_experience VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 5-Document Uploads
CREATE TABLE IF NOT EXISTS candidate_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  cv_resume_url VARCHAR(500),
  passport_url VARCHAR(500),
  degree_certificates_url VARCHAR(500),
  license_certificate_url VARCHAR(500),
  ielts_oet_certificate_url VARCHAR(500),
  experience_letters_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  country VARCHAR(100),
  job_type VARCHAR(100),
  specialization VARCHAR(255),
  experience_required VARCHAR(100),
  salary_range VARCHAR(100),
  status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  job_id INT,
  application_type VARCHAR(100),
  status ENUM('pending', 'verified', 'rejected', 'approved') DEFAULT 'pending',
  remarks TEXT,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  tags VARCHAR(500),
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_by INT,
  published_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Create default admin user (password: admin123)
INSERT INTO admins (email, password, name) 
VALUES ('admin@duke.com', '$2a$10$8K1p/a1dI1SFsS6eVPvEfO0bNjKqC1Y3qDLYNZMPZPK0qHgYQmGDO', 'Admin User')
ON DUPLICATE KEY UPDATE email=email;
