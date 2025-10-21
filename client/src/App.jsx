import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import DatabaseTestPage from "@/pages/DatabaseTestPage";

import BlogsPage from "@/pages/admin/BlogsPage";
import BlogFormPage from "@/pages/admin/BlogFormPage";
import JobsPage from "@/pages/admin/JobsPage";
import JobFormPage from "@/pages/admin/JobFormPage";
import ApplicationsPage from "@/pages/admin/ApplicationsPage";
import ApplicationDetailsPage from "@/pages/admin/ApplicationDetailsPage";

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Admin pages */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      
      {/* Blogs */}
      <Route path="/admin/blogs" component={BlogsPage} />
      <Route path="/admin/blogs/new" component={BlogFormPage} />
      <Route path="/admin/blogs/edit/:id" component={BlogFormPage} />
      
      {/* Jobs */}
      <Route path="/admin/jobs" component={JobsPage} />
      <Route path="/admin/jobs/new" component={JobFormPage} />
      <Route path="/admin/jobs/edit/:id" component={JobFormPage} />
      
      {/* Applications */}
      <Route path="/admin/applications" component={ApplicationsPage} />
      <Route path="/admin/applications/:id" component={ApplicationDetailsPage} />
      
      {/* Database test */}
      <Route path="/db-test" component={DatabaseTestPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
