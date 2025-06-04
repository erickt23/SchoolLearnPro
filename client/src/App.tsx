import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import LandingPage from "@/pages/landing-page-fixed";
import AuthPage from "@/pages/auth-page-fixed";
import EnhancedDashboard from "@/pages/enhanced-dashboard";
import UserManagement from "@/pages/user-management";
import UsersTable from "@/pages/users-table";
import BulkImport from "@/pages/bulk-import";
import ClassManagement from "@/pages/class-management";
import VideoConference from "@/pages/video-conference";
import PaymentModule from "@/pages/payment-module";
import MobileApp from "@/pages/mobile-app";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={EnhancedDashboard} />
      <ProtectedRoute path="/admin/users" component={UsersTable} />
      <ProtectedRoute path="/admin/user-management" component={UserManagement} />
      <ProtectedRoute path="/admin/bulk-import" component={BulkImport} />
      <ProtectedRoute path="/admin/classes" component={ClassManagement} />
      <ProtectedRoute path="/admin/video-conference" component={VideoConference} />
      <ProtectedRoute path="/admin/payments" component={PaymentModule} />
      <Route path="/landing" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
