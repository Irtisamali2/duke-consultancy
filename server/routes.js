import { createServer } from "http";
import { storage } from "./storage.js";
import testRoutes from "./routes/test.js";
import migrateRoutes from "./routes/migrate.js";
import authRoutes from "./routes/auth.js";
import fixAdminRoutes from "./routes/fix-admin.js";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import healthcareProfilesRoutes from "./routes/healthcare-profiles.js";
import blogsRoutes from "./routes/blogs.js";
import statsRoutes from "./routes/stats.js";
import candidateAuthRoutes from "./routes/candidate-auth.js";
import candidateProfileRoutes from "./routes/candidate-profile.js";
import emailSettingsRoutes from "./routes/email-settings.js";

export async function registerRoutes(app) {
  // Database test routes
  app.use('/api', testRoutes);
  app.use('/api', migrateRoutes);
  app.use('/api', fixAdminRoutes);
  
  // Authentication routes
  app.use('/api', authRoutes);
  app.use('/api', candidateAuthRoutes);
  
  // Admin CRUD routes
  app.use('/api', jobsRoutes);
  app.use('/api', applicationsRoutes);
  app.use('/api', healthcareProfilesRoutes);
  app.use('/api', blogsRoutes);
  app.use('/api', statsRoutes);
  app.use('/api', emailSettingsRoutes);
  
  // Candidate routes
  app.use('/api', candidateProfileRoutes);

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
