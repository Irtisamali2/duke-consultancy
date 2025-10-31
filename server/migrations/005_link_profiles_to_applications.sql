-- Migration: Link profile data to specific applications
-- This allows each job application to have independent form data

-- Add application_id to healthcare_profiles
ALTER TABLE healthcare_profiles ADD COLUMN application_id INT DEFAULT NULL;
ALTER TABLE healthcare_profiles ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;

-- Add application_id to education_records
ALTER TABLE education_records ADD COLUMN application_id INT DEFAULT NULL;
ALTER TABLE education_records ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;

-- Add application_id to work_experience
ALTER TABLE work_experience ADD COLUMN application_id INT DEFAULT NULL;
ALTER TABLE work_experience ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;

-- Add application_id to candidate_documents
ALTER TABLE candidate_documents ADD COLUMN application_id INT DEFAULT NULL;
ALTER TABLE candidate_documents ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;

-- Add middle_name field to healthcare_profiles (was missing)
ALTER TABLE healthcare_profiles ADD COLUMN middle_name VARCHAR(255) AFTER first_name;

-- Update indexes for better performance
CREATE INDEX idx_healthcare_profiles_application ON healthcare_profiles(application_id);
CREATE INDEX idx_education_records_application ON education_records(application_id);
CREATE INDEX idx_work_experience_application ON work_experience(application_id);
CREATE INDEX idx_candidate_documents_application ON candidate_documents(application_id);

-- Note: Existing profile data (application_id = NULL) represents the candidate's master profile
-- New applications will copy from master profile or start fresh
