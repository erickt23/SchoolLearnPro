import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch, Route } from "wouter";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  ClipboardList,
  Settings,
  Bell,
  Menu,
  X,
  TrendingUp,
  Award,
  Clock,
  Video,
  Upload,
  CheckSquare
} from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher-new";
import Sidebar from "@/components/layout/sidebar";
import KalitekSidebar from "@/components/layout/kalitek-sidebar";
import CourseCreation from "@/components/elearning/course-creation";
import StudentDashboard from "@/components/elearning/student-dashboard";
import LiveSession from "@/components/elearning/live-session";
import QuizInterface from "@/components/elearning/quiz-interface";

function DashboardHome() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: t("Total des utilisateurs", "Total itilizatè yo", "Total Users"),
            value: "1,234",
            change: "+12%",
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: t("Écoles actives", "Lekòl aktif yo", "Active Schools"),
            value: "45",
            change: "+3%",
            icon: GraduationCap,
            color: "text-green-600"
          },
          {
            title: t("Cours créés", "Kou yo kreye", "Courses Created"),
            value: "567",
            change: "+18%",
            icon: BookOpen,
            color: "text-purple-600"
          },
          {
            title: t("Sessions actives", "Sesyon aktif yo", "Active Sessions"),
            value: "89",
            change: "+25%",
            icon: BarChart3,
            color: "text-orange-600"
          }
        ];
      case 'teacher':
        return [
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            value: "12",
            change: "+2",
            icon: BookOpen,
            color: "text-blue-600"
          },
          {
            title: t("Total étudiants", "Total elèv yo", "Total Students"),
            value: "345",
            change: "+15",
            icon: Users,
            color: "text-green-600"
          },
          {
            title: t("Devoirs à corriger", "Devoir pou korije", "Assignments to Grade"),
            value: "23",
            change: "-5",
            icon: ClipboardList,
            color: "text-orange-600"
          },
          {
            title: t("Sessions cette semaine", "Sesyon semèn sa a", "Sessions This Week"),
            value: "8",
            change: "+3",
            icon: Calendar,
            color: "text-purple-600"
          }
        ];
      case 'student':
        return [
          {
            title: t("Cours inscrits", "Kou yo enskriw", "Enrolled Courses"),
            value: "6",
            change: "+1",
            icon: BookOpen,
            color: "text-blue-600"
          },
          {
            title: t("Progression moyenne", "Pwogre mwayen", "Average Progress"),
            value: "78%",
            change: "+5%",
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: t("Devoirs en cours", "Devoir k ap fèt yo", "Pending Assignments"),
            value: "4",
            change: "-2",
            icon: ClipboardList,
            color: "text-orange-600"
          },
          {
            title: t("Certificats obtenus", "Sètifika yo jwenn", "Certificates Earned"),
            value: "3",
            change: "+1",
            icon: Award,
            color: "text-purple-600"
          }
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: t("Gérer utilisateurs", "Jere itilizatè yo", "Manage Users"),
            icon: Users,
            path: "/admin/users",
            color: "bg-blue-50 hover:bg-blue-100 text-blue-600"
          },
          {
            title: t("Rapports", "Rapò yo", "Reports"),
            icon: BarChart3,
            path: "/admin/reports",
            color: "bg-green-50 hover:bg-green-100 text-green-600"
          },
          {
            title: t("Ajouter école", "Ajoute lekòl", "Add School"),
            icon: GraduationCap,
            path: "/admin/add-school",
            color: "bg-purple-50 hover:bg-purple-100 text-purple-600"
          },
          {
            title: t("Paramètres", "Paramèt yo", "Settings"),
            icon: Settings,
            path: "/settings",
            color: "bg-gray-50 hover:bg-gray-100 text-gray-600"
          }
        ];
      case 'teacher':
        return [
          {
            title: t("Créer cours", "Kreye kou", "Create Course"),
            icon: Upload,
            path: "/teacher/create-course",
            color: "bg-blue-50 hover:bg-blue-100 text-blue-600"
          },
          {
            title: t("Session live", "Sesyon vivan", "Live Session"),
            icon: Video,
            path: "/teacher/live-sessions",
            color: "bg-red-50 hover:bg-red-100 text-red-600"
          },
          {
            title: t("Nouveau quiz", "Nouvo quiz", "New Quiz"),
            icon: CheckSquare,
            path: "/teacher/create-quiz",
            color: "bg-green-50 hover:bg-green-100 text-green-600"
          },
          {
            title: t("Mes élèves", "Elèv mwen yo", "My Students"),
            icon: Users,
            path: "/teacher/students",
            color: "bg-purple-50 hover:bg-purple-100 text-purple-600"
          }
        ];
      case 'student':
        return [
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: BookOpen,
            path: "/student/courses",
            color: "bg-blue-50 hover:bg-blue-100 text-blue-600"
          },
          {
            title: t("Devoirs", "Devoir yo", "Assignments"),
            icon: ClipboardList,
            path: "/student/assignments",
            color: "bg-orange-50 hover:bg-orange-100 text-orange-600"
          },
          {
            title: t("Sessions live", "Sesyon vivan yo", "Live Sessions"),
            icon: Video,
            path: "/student/live-classes",
            color: "bg-red-50 hover:bg-red-100 text-red-600"
          },
          {
            title: t("Certificats", "Sètifika yo", "Certificates"),
            icon: Award,
            path: "/student/certificates",
            color: "bg-purple-50 hover:bg-purple-100 text-purple-600"
          }
        ];
      default:
        return [];
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return t("Administrateur", "Administratè", "Administrator");
      case "teacher": return t("Enseignant", "Pwofesè", "Teacher");
      case "student": return t("Élève", "Elèv", "Student");
      case "parent": return t("Parent", "Paran", "Parent");
      default: return role;
    }
  };

  const stats = getDashboardStats();
  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Language Switcher */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduHaïti</h1>
                <p className="text-sm text-gray-600">
                  {t("Tableau de bord", "Tablo jesyon", "Dashboard")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{getRoleLabel(user?.role || "")}</p>
                </div>
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t(`Bienvenue, ${user?.firstName}!`, `Byenveni, ${user?.firstName}!`, `Welcome, ${user?.firstName}!`)}
          </h2>
          <p className="text-gray-600">
            {user?.role === 'admin' && t("Gérez votre plateforme éducative", "Jere platfòm edikatif ou a", "Manage your educational platform")}
            {user?.role === 'teacher' && t("Créez et gérez vos cours", "Kreye ak jere kou ou yo", "Create and manage your courses")}
            {user?.role === 'student' && t("Continuez votre apprentissage", "Kontinye aprann ou an", "Continue your learning journey")}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} {t("ce mois", "mwa sa a", "this month")}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("Actions rapides", "Aksyon rapid yo", "Quick Actions")}
                </CardTitle>
                <CardDescription>
                  {t("Accès rapide aux fonctionnalités principales", "Aksè rapid nan fonksyonalite prensipal yo", "Quick access to main features")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`h-24 flex flex-col gap-2 ${action.color}`}
                      onClick={() => window.location.href = action.path}
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-sm font-medium text-center">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & E-Learning Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("Activité récente", "Aktivite resan", "Recent Activity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t("Nouveau cours publié", "Nouvo kou pibliye", "New course published")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("Mathématiques avancées", "Matematik avanse", "Advanced Mathematics")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("Il y a 2 heures", "Depi 2 è", "2 hours ago")}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t("Quiz terminé", "Quiz fini", "Quiz completed")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("Score: 85/100", "Nòt: 85/100", "Score: 85/100")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("Il y a 4 heures", "Depi 4 è", "4 hours ago")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E-Learning Module Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  {t("Module E-Learning", "Modil E-Learning", "E-Learning Module")}
                </CardTitle>
                <CardDescription>
                  {t("Accès aux nouvelles fonctionnalités", "Aksè nan nouvo fonksyonalite yo", "Access to new features")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/elearning/dashboard'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t("Interface avancée", "Entèfas avanse", "Advanced Interface")}
                  </Button>
                  
                  {user?.role === 'teacher' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/teacher/create-course'}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t("Créer cours", "Kreye kou", "Create Course")}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/live-session/demo'}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {t("Session live", "Sesyon vivan", "Live Session")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [useSidebarMode, setUseSidebarMode] = useState(false);
  const [showKalitekSidebar, setShowKalitekSidebar] = useState(false);

  if (useSidebarMode) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          collapsed={!showSidebar} 
          onToggle={() => setShowSidebar(!showSidebar)}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseSidebarMode(false)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Mode classique
              </Button>
              <LanguageSwitcher />
            </div>
          </div>
          
          <Switch>
            <Route path="/" component={DashboardHome} />
            <Route path="/teacher/create-course" component={CourseCreation} />
            <Route path="/teacher/live-sessions" component={LiveSession} />
            <Route path="/student/courses" component={StudentDashboard} />
            <Route path="/student/quiz/:id" component={QuizInterface} />
            <Route path="/live-session/:id" component={LiveSession} />
            <Route>
              <DashboardHome />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Kalitek Sidebar */}
      {showKalitekSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowKalitekSidebar(false)}
          />
          <KalitekSidebar 
            isOpen={showKalitekSidebar} 
            onToggle={() => setShowKalitekSidebar(!showKalitekSidebar)}
          />
        </>
      )}

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={() => setShowKalitekSidebar(true)}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
        <Button
          onClick={() => setUseSidebarMode(true)}
          className="flex items-center gap-2"
          size="sm"
        >
          <BarChart3 className="h-4 w-4" />
          Mode avancé
        </Button>
      </div>
      
      <Switch>
        <Route path="/elearning/dashboard" component={() => {
          setUseSidebarMode(true);
          return <DashboardHome />;
        }} />
        <Route path="/teacher/create-course" component={CourseCreation} />
        <Route path="/teacher/live-sessions" component={LiveSession} />
        <Route path="/student/courses" component={StudentDashboard} />
        <Route path="/student/quiz/:id" component={QuizInterface} />
        <Route path="/live-session/:id" component={LiveSession} />
        <Route>
          <DashboardHome />
        </Route>
      </Switch>
    </div>
  );
}