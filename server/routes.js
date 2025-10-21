import { createServer } from "http";
import { storage } from "./storage.js";
import testRoutes from "./routes/test.js";
import migrateRoutes from "./routes/migrate.js";
import authRoutes from "./routes/auth.js";
import fixAdminRoutes from "./routes/fix-admin.js";

export async function registerRoutes(app) {
  // Database test routes
  app.use('/api', testRoutes);
  app.use('/api', migrateRoutes);
  app.use('/api', fixAdminRoutes);
  
  // Authentication routes
  app.use('/api', authRoutes);

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
