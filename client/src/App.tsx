import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import { ThemeProvider } from "./hooks/use-theme";
import LandingPage from "@/pages/landing-page-fixed";
import AuthPage from "@/pages/auth-page-fixed";
import MainDashboard from "@/pages/main-dashboard";
import UserManagement from "@/pages/user-management";
import UsersTable from "@/pages/users-table";
import BulkImport from "@/pages/bulk-import";
import ClassManagement from "@/pages/class-management";
import VideoConference from "@/pages/video-conference";
import PaymentModule from "@/pages/payment-module";
import MobileApp from "@/pages/mobile-app";
import SchoolManagement from "@/pages/school-management";
import SchoolNetworkManagement from "@/pages/school-network-management";
import CourseManagement from "@/pages/course-management";
import ELearningDashboard from "@/pages/elearning-dashboard";
import DisciplineDashboard from "@/pages/discipline-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={MainDashboard} />
      <ProtectedRoute path="/user-management" component={UserManagement} />
      <ProtectedRoute path="/school-management" component={SchoolManagement} />
      <ProtectedRoute path="/class-management" component={ClassManagement} />
      <ProtectedRoute path="/course-management" component={CourseManagement} />
      <ProtectedRoute path="/video-conference" component={VideoConference} />
      <ProtectedRoute path="/payment-module" component={PaymentModule} />
      <ProtectedRoute path="/mobile-app" component={MobileApp} />
      <ProtectedRoute path="/elearning" component={ELearningDashboard} />
      <ProtectedRoute path="/discipline" component={DisciplineDashboard} />
      <ProtectedRoute path="/bulk-import" component={BulkImport} />
      <Route path="/landing" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <LanguageProvider>
            <AuthProvider>
              <Toaster />
              <Router />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
