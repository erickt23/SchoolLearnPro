import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Menu,
  X,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  ClipboardList,
  Settings,
  Bell,
  Video,
  Upload,
  CheckSquare,
  Award,
  FileText,
  TrendingUp,
  School,
  UserCheck,
  PlusCircle,
  Library,
  Clock,
  Star,
  Target,
  Activity
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function KalitekSidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getMenuItems = () => {
    const baseItems = [
      {
        title: t("Tableau de bord", "Tablo jesyon", "Dashboard"),
        icon: Home,
        path: "/",
        badge: null,
        isSection: false
      }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          {
            title: t("Gestion", "Jesyon", "Management"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Utilisateurs", "Itilizatè yo", "Users"),
            icon: Users,
            path: "/admin/users",
            badge: "1,234",
            isSection: false
          },
          {
            title: t("Écoles", "Lekòl yo", "Schools"),
            icon: School,
            path: "/admin/schools",
            badge: "45",
            isSection: false
          },
          {
            title: t("Réseaux scolaires", "Rezo lekòl yo", "School Networks"),
            icon: GraduationCap,
            path: "/admin/networks",
            badge: null,
            isSection: false
          },
          {
            title: t("Analyse", "Analiz", "Analytics"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Rapports", "Rapò yo", "Reports"),
            icon: BarChart3,
            path: "/admin/reports",
            badge: null
          },
          {
            title: t("Statistiques", "Estatistik yo", "Statistics"),
            icon: TrendingUp,
            path: "/admin/stats",
            badge: null
          },
          {
            title: t("E-Learning", "E-Learning", "E-Learning"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Cours", "Kou yo", "Courses"),
            icon: BookOpen,
            path: "/admin/courses",
            badge: "567"
          },
          {
            title: t("Sessions", "Sesyon yo", "Sessions"),
            icon: Video,
            path: "/admin/sessions",
            badge: "89"
          },
          {
            title: t("Système", "Sistèm", "System"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Paramètres", "Paramèt yo", "Settings"),
            icon: Settings,
            path: "/admin/settings",
            badge: null
          },
          {
            title: t("Notifications", "Notifikasyon yo", "Notifications"),
            icon: Bell,
            path: "/admin/notifications",
            badge: "12"
          }
        ];

      case 'teacher':
        return [
          ...baseItems,
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Créer un cours", "Kreye yon kou", "Create Course"),
            icon: PlusCircle,
            path: "/teacher/create-course",
            badge: null
          },
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: BookOpen,
            path: "/teacher/courses",
            badge: "12"
          },
          {
            title: t("Bibliothèque", "Bibliyotèk", "Library"),
            icon: Library,
            path: "/teacher/library",
            badge: null
          },
          {
            title: t("Sessions live", "Sesyon vivan yo", "Live Sessions"),
            icon: Video,
            path: "/teacher/live-sessions",
            badge: null
          },
          {
            title: t("Évaluations", "Evalyasyon yo", "Assessments"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Quiz & Examens", "Quiz ak Egzamen yo", "Quizzes & Exams"),
            icon: CheckSquare,
            path: "/teacher/quizzes",
            badge: null
          },
          {
            title: t("Devoirs", "Devoir yo", "Assignments"),
            icon: ClipboardList,
            path: "/teacher/assignments",
            badge: "23"
          },
          {
            title: t("Notes", "Nòt yo", "Grades"),
            icon: Star,
            path: "/teacher/grades",
            badge: null
          },
          {
            title: t("Gestion de classe", "Jesyon klas la", "Class Management"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Mes élèves", "Elèv mwen yo", "My Students"),
            icon: Users,
            path: "/teacher/students",
            badge: "345"
          },
          {
            title: t("Présence", "Prezans", "Attendance"),
            icon: UserCheck,
            path: "/teacher/attendance",
            badge: null
          },
          {
            title: t("Messages", "Mesaj yo", "Messages"),
            icon: MessageSquare,
            path: "/teacher/messages",
            badge: "8"
          },
          {
            title: t("Calendrier", "Kalandriye", "Calendar"),
            icon: Calendar,
            path: "/teacher/calendar",
            badge: null
          }
        ];

      case 'student':
        return [
          ...baseItems,
          {
            title: t("Apprentissage", "Aprann", "Learning"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: BookOpen,
            path: "/student/courses",
            badge: "6"
          },
          {
            title: t("Sessions live", "Sesyon vivan yo", "Live Classes"),
            icon: Video,
            path: "/student/live-classes",
            badge: "3"
          },
          {
            title: t("Bibliothèque", "Bibliyotèk", "Library"),
            icon: Library,
            path: "/student/library",
            badge: null
          },
          {
            title: t("Évaluations", "Evalyasyon yo", "Assessments"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Devoirs", "Devoir yo", "Assignments"),
            icon: ClipboardList,
            path: "/student/assignments",
            badge: "4"
          },
          {
            title: t("Quiz & Tests", "Quiz ak Tès yo", "Quizzes & Tests"),
            icon: CheckSquare,
            path: "/student/quizzes",
            badge: "2"
          },
          {
            title: t("Notes", "Nòt yo", "Grades"),
            icon: Star,
            path: "/student/grades",
            badge: null
          },
          {
            title: t("Progrès", "Pwogre", "Progress"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Mon progrès", "Pwogre mwen", "My Progress"),
            icon: TrendingUp,
            path: "/student/progress",
            badge: "78%"
          },
          {
            title: t("Objectifs", "Objektif yo", "Goals"),
            icon: Target,
            path: "/student/goals",
            badge: null
          },
          {
            title: t("Activités", "Aktivite yo", "Activities"),
            icon: Activity,
            path: "/student/activities",
            badge: null
          },
          {
            title: t("Récompenses", "Rekonpans yo", "Achievements"),
            icon: Award,
            path: "/student/achievements",
            badge: "3"
          },
          {
            title: t("Communication", "Kominikasyon", "Communication"),
            icon: null,
            path: null,
            badge: null,
            isSection: true
          },
          {
            title: t("Messages", "Mesaj yo", "Messages"),
            icon: MessageSquare,
            path: "/student/messages",
            badge: "5"
          },
          {
            title: t("Calendrier", "Kalandriye", "Calendar"),
            icon: Calendar,
            path: "/student/calendar",
            badge: null
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path: string) => {
    if (path) {
      window.location.href = path;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-50 text-red-600 border-red-200";
      case "teacher": return "bg-blue-50 text-blue-600 border-blue-200";
      case "student": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
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

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 overflow-y-auto
      `}>
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">EduHaïti</h2>
              <p className="text-sm text-gray-600">
                {t("Plateforme éducative", "Platfòm edikatif", "Educational Platform")}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge variant="outline" className={`text-xs ${getRoleColor(user?.role || "")}`}>
                {getRoleLabel(user?.role || "")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              if ('isSection' in item && item.isSection) {
                return (
                  <div key={index} className="pt-6 pb-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                      {item.title}
                    </div>
                    <Separator className="mt-2" />
                  </div>
                );
              }

              const Icon = item.icon;
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left hover:bg-primary/5 group"
                  onClick={() => handleNavigation(item.path || "")}
                >
                  <div className="flex items-center gap-3 w-full">
                    {Icon && (
                      <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary border-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="text-center text-xs text-gray-500">
            <p>{t("Système scolaire haïtien", "Sistèm lekòl ayisyen", "Haitian School System")}</p>
            <p className="mt-1">© 2024 EduHaïti</p>
          </div>
        </div>
      </div>
    </>
  );
}