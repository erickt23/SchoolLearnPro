import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import TeacherDashboard from "@/components/dashboard/teacher-dashboard";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import ParentDashboard from "@/components/dashboard/parent-dashboard";
import { 
  GraduationCap, 
  LogOut, 
  Bell, 
  Settings,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">{t("Chargement...", "Ap chaje...")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "teacher": return "bg-green-100 text-green-800";
      case "student": return "bg-blue-100 text-blue-800";
      case "parent": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return t("Administrateur", "Administratè");
      case "teacher": return t("Enseignant", "Pwofesè");
      case "student": return t("Élève", "Elèv");
      case "parent": return t("Parent", "Paran");
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSwitcher />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduHaïti</h1>
                <p className="text-sm text-gray-600">
                  {t("Tableau de bord", "Tablo jesyon")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("Bonjour", "Bonjou")}, {user.firstName} !
          </h1>
          <p className="text-gray-600">
            {t(
              "Voici un aperçu de vos activités récentes",
              "Men yon apèsi nan aktivite resan ou yo"
            )}
          </p>
        </div>

        {/* Role-specific Dashboard */}
        <div>
          {user.role === "admin" && <AdminDashboard data={dashboardData} />}
          {user.role === "teacher" && <TeacherDashboard data={dashboardData} />}
          {user.role === "student" && <StudentDashboard data={dashboardData} />}
          {user.role === "parent" && <ParentDashboard data={dashboardData} />}
        </div>
      </main>
    </div>
  );
}
