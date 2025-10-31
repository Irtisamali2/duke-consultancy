import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const candidateStatusEnum = pgEnum('candidate_status', ['pending', 'verified', 'rejected']);
export const yesNoEnum = pgEnum('yes_no', ['yes', 'no']);
export const applicationStatusEnum = pgEnum('application_status', ['draft', 'pending', 'verified', 'rejected', 'approved']);
export const jobStatusEnum = pgEnum('job_status', ['active', 'inactive', 'closed']);
export const blogStatusEnum = pgEnum('blog_status', ['draft', 'published']);

// Admin Users Table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidates/Healthcare Professionals Table
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  status: candidateStatusEnum("status").default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  country: varchar("country", { length: 100 }),
  jobType: varchar("job_type", { length: 100 }),
  specialization: varchar("specialization", { length: 255 }),
  experienceRequired: varchar("experience_required", { length: 100 }),
  salaryRange: varchar("salary_range", { length: 100 }),
  status: jobStatusEnum("status").default('active'),
  createdBy: integer("created_by").references(() => admins.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applications Table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: 'set null' }),
  applicationType: varchar("application_type", { length: 100 }),
  status: applicationStatusEnum("status").default('draft'),
  remarks: text("remarks"),
  appliedDate: timestamp("applied_date").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  modifiedAt: timestamp("modified_at"),
  modifiedBy: integer("modified_by"),
  modifiedByType: varchar("modified_by_type", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare Profiles Table
export const healthcareProfiles = pgTable("healthcare_profiles", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  applicationId: integer("application_id").references(() => applications.id, { onDelete: 'cascade' }),
  
  // Trade Information
  tradeAppliedFor: varchar("trade_applied_for", { length: 255 }),
  availabilityToJoin: varchar("availability_to_join", { length: 100 }),
  willingnessToRelocate: yesNoEnum("willingness_to_relocate"),
  countriesPreference: text("countries_preference"),
  tradesPreference: text("trades_preference"),
  
  // Personal Information
  photoUrl: varchar("photo_url", { length: 500 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  firstName: varchar("first_name", { length: 255 }),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  fatherHusbandName: varchar("father_husband_name", { length: 255 }),
  maritalStatus: varchar("marital_status", { length: 50 }),
  gender: varchar("gender", { length: 20 }),
  religion: varchar("religion", { length: 50 }),
  dateOfBirth: date("date_of_birth"),
  placeOfBirth: varchar("place_of_birth", { length: 255 }),
  province: varchar("province", { length: 100 }),
  country: varchar("country", { length: 100 }),
  cnic: varchar("cnic", { length: 50 }),
  cnicIssueDate: date("cnic_issue_date"),
  cnicExpireDate: date("cnic_expire_date"),
  passportNumber: varchar("passport_number", { length: 50 }),
  passportIssueDate: date("passport_issue_date"),
  passportExpireDate: date("passport_expire_date"),
  emailAddress: varchar("email_address", { length: 255 }),
  confirmEmailAddress: varchar("confirm_email_address", { length: 255 }),
  telOffNo: varchar("tel_off_no", { length: 50 }),
  telResNo: varchar("tel_res_no", { length: 50 }),
  mobileNo: varchar("mobile_no", { length: 50 }),
  presentAddress: text("present_address"),
  presentStreet: varchar("present_street", { length: 255 }),
  presentPostalCode: varchar("present_postal_code", { length: 20 }),
  permanentAddress: text("permanent_address"),
  permanentStreet: varchar("permanent_street", { length: 255 }),
  permanentPostalCode: varchar("permanent_postal_code", { length: 20 }),
  sameAsPresentAddress: boolean("same_as_present_address").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Education Records Table
export const educationRecords = pgTable("education_records", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  applicationId: integer("application_id").references(() => applications.id, { onDelete: 'cascade' }),
  degreeDiplomaTitle: varchar("degree_diploma_title", { length: 255 }),
  universityInstituteName: varchar("university_institute_name", { length: 255 }),
  graduationYear: varchar("graduation_year", { length: 10 }),
  programDuration: varchar("program_duration", { length: 50 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  marksPercentage: varchar("marks_percentage", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Work Experience Table
export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  applicationId: integer("application_id").references(() => applications.id, { onDelete: 'cascade' }),
  jobTitle: varchar("job_title", { length: 255 }),
  employerHospital: varchar("employer_hospital", { length: 255 }),
  specialization: varchar("specialization", { length: 255 }),
  fromDate: date("from_date"),
  toDate: date("to_date"),
  totalExperience: varchar("total_experience", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document Uploads
export const candidateDocuments = pgTable("candidate_documents", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: 'cascade' }),
  applicationId: integer("application_id").references(() => applications.id, { onDelete: 'cascade' }),
  cvResumeUrl: varchar("cv_resume_url", { length: 500 }),
  passportUrl: varchar("passport_url", { length: 500 }),
  degreeCertificatesUrl: varchar("degree_certificates_url", { length: 500 }),
  licenseCertificateUrl: varchar("license_certificate_url", { length: 500 }),
  ieltsOetCertificateUrl: varchar("ielts_oet_certificate_url", { length: 500 }),
  experienceLettersUrl: varchar("experience_letters_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blogs Table
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 100 }),
  tags: varchar("tags", { length: 500 }),
  status: blogStatusEnum("status").default('draft'),
  createdBy: integer("created_by").references(() => admins.id, { onDelete: 'set null' }),
  publishedDate: timestamp("published_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legacy users table (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
