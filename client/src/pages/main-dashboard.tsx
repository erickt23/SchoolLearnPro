import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Switch, Route } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import CourseCreation from "@/components/elearning/course-creation";
import StudentDashboard from "@/components/elearning/student-dashboard";
import LiveSession from "@/components/elearning/live-session";
import QuizInterface from "@/components/elearning/quiz-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
  Award,
  Clock
} from "lucide-react";

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

  const getRecentActivity = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: t("Nouvelle école ajoutée", "Nouvo lekòl yo ajoute", "New school added"),
            description: t("École Nationale de Port-au-Prince", "Lekòl Nasyonal Pòtoprens", "National School of Port-au-Prince"),
            time: t("Il y a 2 heures", "Depi 2 è", "2 hours ago"),
            icon: GraduationCap
          },
          {
            title: t("Rapport mensuel généré", "Rapò mensyèl yo jenere", "Monthly report generated"),
            description: t("Statistiques d'utilisation", "Estatistik itilizasyon", "Usage statistics"),
            time: t("Il y a 4 heures", "Depi 4 è", "4 hours ago"),
            icon: BarChart3
          }
        ];
      case 'teacher':
        return [
          {
            title: t("Cours publié", "Kou yo pibliye", "Course published"),
            description: t("Mathématiques avancées", "Matematik avanse", "Advanced Mathematics"),
            time: t("Il y a 1 heure", "Depi 1 è", "1 hour ago"),
            icon: BookOpen
          },
          {
            title: t("Session terminée", "Sesyon fini", "Session completed"),
            description: t("Révision d'algèbre", "Revizyon aljèb", "Algebra review"),
            time: t("Il y a 3 heures", "Depi 3 è", "3 hours ago"),
            icon: Clock
          }
        ];
      case 'student':
        return [
          {
            title: t("Cours terminé", "Kou fini", "Course completed"),
            description: t("Introduction aux sciences", "Entwodiksyon nan syans yo", "Introduction to Sciences"),
            time: t("Il y a 30 minutes", "Depi 30 minit", "30 minutes ago"),
            icon: BookOpen
          },
          {
            title: t("Devoir soumis", "Devoir soumèt", "Assignment submitted"),
            description: t("Analyse littéraire", "Analiz literè", "Literary analysis"),
            time: t("Il y a 2 heures", "Depi 2 è", "2 hours ago"),
            icon: ClipboardList
          }
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();
  const activities = getRecentActivity();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t(`Bienvenue, ${user?.firstName}!`, `Byenveni, ${user?.firstName}!`, `Welcome, ${user?.firstName}!`)}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'admin' && t("Gérez votre plateforme éducative", "Jere platfòm edikatif ou a", "Manage your educational platform")}
          {user?.role === 'teacher' && t("Créez et gérez vos cours", "Kreye ak jere kou ou yo", "Create and manage your courses")}
          {user?.role === 'student' && t("Continuez votre apprentissage", "Kontinye aprann ou an", "Continue your learning journey")}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} {t("ce mois", "mwa sa a", "this month")}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Activité récente", "Aktivite resan", "Recent Activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Actions rapides", "Aksyon rapid yo", "Quick Actions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {user?.role === 'admin' && (
                <>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-xs">{t("Gérer utilisateurs", "Jere itilizatè yo", "Manage Users")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">{t("Rapports", "Rapò yo", "Reports")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-xs">{t("Ajouter école", "Ajoute lekòl", "Add School")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">{t("Paramètres", "Paramèt yo", "Settings")}</span>
                  </Button>
                </>
              )}
              
              {user?.role === 'teacher' && (
                <>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">{t("Créer cours", "Kreye kou", "Create Course")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <ClipboardList className="h-6 w-6" />
                    <span className="text-xs">{t("Nouveau devoir", "Nouvo devoir", "New Assignment")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-xs">{t("Session live", "Sesyon vivan", "Live Session")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">{t("Progressions", "Pwogre yo", "Progress")}</span>
                  </Button>
                </>
              )}
              
              {user?.role === 'student' && (
                <>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">{t("Mes cours", "Kou mwen yo", "My Courses")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <ClipboardList className="h-6 w-6" />
                    <span className="text-xs">{t("Devoirs", "Devoir yo", "Assignments")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-xs">{t("Planning", "Plan", "Schedule")}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Award className="h-6 w-6" />
                    <span className="text-xs">{t("Certificats", "Sètifika yo", "Certificates")}</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 overflow-auto">
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