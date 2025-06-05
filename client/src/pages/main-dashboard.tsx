import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
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
  Menu,
  X,
  TrendingUp,
  Award,
  Clock,
  Video,
  Upload,
  CheckSquare,
  User,
  School,
  CreditCard,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher-new";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";

// Sidebar Component
function CollapsibleSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["management", "modules", "teaching", "learning"]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        title: t("Tableau de bord", "Tablo jesyon", "Dashboard"),
        icon: BarChart3,
        path: "/",
        badge: null,
        isSection: false,
        sectionId: null,
        isSubItem: false
      }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          {
            title: t("Gestion", "Jesyon", "Management"),
            icon: Settings,
            path: null,
            badge: null,
            isSection: true,
            sectionId: "management",
            isSubItem: false,
            isCollapsible: true
          },
          {
            title: t("Utilisateurs", "Itilizatè yo", "Users"),
            icon: Users,
            path: "/user-management",
            badge: "1,234",
            isSection: false,
            sectionId: "management",
            isSubItem: true
          },
          {
            title: t("Écoles", "Lekòl yo", "Schools"),
            icon: School,
            path: "/school-management",
            badge: "45",
            isSection: false,
            sectionId: "management",
            isSubItem: true
          },
          {
            title: t("Classes", "Klas yo", "Classes"),
            icon: BookOpen,
            path: "/class-management",
            badge: "156",
            isSection: false,
            sectionId: "management",
            isSubItem: true
          },
          {
            title: t("Cours", "Kou yo", "Courses"),
            icon: Upload,
            path: "/course-management",
            badge: "89",
            isSection: false,
            sectionId: "management",
            isSubItem: true
          },
          {
            title: t("Modules", "Modil yo", "Modules"),
            icon: CreditCard,
            path: null,
            badge: null,
            isSection: true,
            sectionId: "modules",
            isSubItem: false,
            isCollapsible: true
          },
          {
            title: t("Vidéoconférence", "Videokonferans", "Video Conference"),
            icon: Video,
            path: "/video-conference",
            badge: "Live",
            isSection: false,
            sectionId: "modules",
            isSubItem: true
          },
          {
            title: t("Paiements", "Peman yo", "Payments"),
            icon: CreditCard,
            path: "/payment-module",
            badge: "€2,450",
            isSection: false,
            sectionId: "modules",
            isSubItem: true
          },
          {
            title: t("App Mobile", "App Mobil", "Mobile App"),
            icon: Smartphone,
            path: "/mobile-app",
            badge: "Beta",
            isSection: false,
            sectionId: "modules",
            isSubItem: true
          }
        ];
      case 'teacher':
        return [
          ...baseItems,
          {
            title: t("Enseignement", "Ansèyman", "Teaching"),
            icon: GraduationCap,
            path: null,
            badge: null,
            isSection: true,
            sectionId: "teaching",
            isSubItem: false,
            isCollapsible: true
          },
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: BookOpen,
            path: "/teacher/courses",
            badge: "12",
            isSection: false,
            sectionId: "teaching",
            isSubItem: true
          },
          {
            title: t("Étudiants", "Elèv yo", "Students"),
            icon: Users,
            path: "/teacher/students",
            badge: "156",
            isSection: false,
            sectionId: "teaching",
            isSubItem: true
          },
          {
            title: t("Planning", "Planifikasyon", "Schedule"),
            icon: Calendar,
            path: "/teacher/schedule",
            badge: null,
            isSection: false,
            sectionId: "teaching",
            isSubItem: true
          }
        ];
      case 'student':
        return [
          ...baseItems,
          {
            title: t("Apprentissage", "Aprantisaj", "Learning"),
            icon: BookOpen,
            path: null,
            badge: null,
            isSection: true,
            sectionId: "learning",
            isSubItem: false,
            isCollapsible: true
          },
          {
            title: t("Mes cours", "Kou mwen yo", "My Courses"),
            icon: BookOpen,
            path: "/student/courses",
            badge: "8",
            isSection: false,
            sectionId: "learning",
            isSubItem: true
          },
          {
            title: t("Devoirs", "Devoir yo", "Assignments"),
            icon: ClipboardList,
            path: "/student/assignments",
            badge: "3",
            isSection: false,
            sectionId: "learning",
            isSubItem: true
          }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header with toggle */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold text-primary">EduPro</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            // Section headers (collapsible)
            if (item.isSection) {
              if (isCollapsed) return null;
              const isExpanded = expandedSections.includes(item.sectionId!);
              
              return (
                <div key={index} className="mt-6 first:mt-0">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(item.sectionId!)}
                    className="w-full justify-start text-left hover:bg-accent px-3 py-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                        <span className="text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </Button>
                </div>
              );
            }

            // Sub-items (only show if parent section is expanded)
            if (item.isSubItem) {
              if (isCollapsed) return null;
              if (!expandedSections.includes(item.sectionId!)) return null;
              
              return (
                <Link key={item.path} href={item.path!}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left hover:bg-accent pl-8 py-2 ml-4"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {item.icon && <item.icon className="h-4 w-4 mr-3 text-muted-foreground" />}
                        <span className="text-sm text-foreground">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </Link>
              );
            }

            // Regular menu items (not sub-items)
            if (!item.path) return null;

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left hover:bg-accent ${isCollapsed ? 'px-2' : 'pl-6'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {item.icon && <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />}
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          className={`w-full ${isCollapsed ? 'px-2' : ''}`}
        >
          <X className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && t("Déconnexion", "Dekonekte", "Logout")}
        </Button>
      </div>
    </div>
  );
}

// Main Dashboard Content
function DashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return t("Administrateur", "Administratè", "Administrator");
      case "teacher": return t("Enseignant", "Pwofesè", "Teacher");
      case "student": return t("Élève", "Elèv", "Student");
      case "parent": return t("Parent", "Paran", "Parent");
      default: return role;
    }
  };

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
            value: "156",
            change: "+8",
            icon: Users,
            color: "text-green-600"
          },
          {
            title: t("Devoirs", "Devoir yo", "Assignments"),
            value: "34",
            change: "+5",
            icon: ClipboardList,
            color: "text-purple-600"
          },
          {
            title: t("Sessions cette semaine", "Sesyon semèn nan", "Sessions This Week"),
            value: "8",
            change: "+2",
            icon: Calendar,
            color: "text-orange-600"
          }
        ];
      case 'student':
        return [
          {
            title: t("Cours inscrits", "Kou yo enskriwi", "Enrolled Courses"),
            value: "8",
            change: "+1",
            icon: BookOpen,
            color: "text-blue-600"
          },
          {
            title: t("Devoirs en cours", "Devoir k ap fèt", "Pending Assignments"),
            value: "3",
            change: "-2",
            icon: ClipboardList,
            color: "text-orange-600"
          },
          {
            title: t("Progression", "Pwogrè", "Progress"),
            value: "78%",
            change: "+5%",
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: t("Certificats", "Sètifika yo", "Certificates"),
            value: "2",
            change: "+1",
            icon: Award,
            color: "text-purple-600"
          }
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();

  return (
    <div className="p-6 space-y-6">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Actions rapides", "Aksyon rapid yo", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("Accédez rapidement aux fonctionnalités principales", "Jwenn aksè rapid nan fonksyonalite prensipal yo", "Quick access to main features")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === 'admin' && (
                <>
                  <Link href="/user-management">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      {t("Gérer les utilisateurs", "Jere itilizatè yo", "Manage Users")}
                    </Button>
                  </Link>
                  <Link href="/school-management">
                    <Button variant="outline" className="w-full justify-start">
                      <School className="h-4 w-4 mr-2" />
                      {t("Gérer les écoles", "Jere lekòl yo", "Manage Schools")}
                    </Button>
                  </Link>
                </>
              )}
              {user?.role === 'teacher' && (
                <>
                  <Link href="/course-management">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      {t("Créer un cours", "Kreye yon kou", "Create Course")}
                    </Button>
                  </Link>
                  <Link href="/video-conference">
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      {t("Session live", "Sesyon vivan", "Live Session")}
                    </Button>
                  </Link>
                </>
              )}
              {user?.role === 'student' && (
                <>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t("Mes cours", "Kou mwen yo", "My Courses")}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    {t("Devoirs", "Devoir yo", "Assignments")}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Activité récente", "Aktivite resan yo", "Recent Activity")}</CardTitle>
            <CardDescription>
              {t("Aperçu de vos dernières actions", "Apèsi dènye aksyon ou yo", "Overview of your recent actions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">
                  {t("Nouveau cours créé: Mathématiques", "Nouvo kou kreye: Matematik", "New course created: Mathematics")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">
                  {t("5 nouveaux étudiants inscrits", "5 nouvo elèv enskriwi", "5 new students enrolled")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm">
                  {t("Session vidéo planifiée", "Sesyon videyo planifye", "Video session scheduled")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

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
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CollapsibleSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-64 z-50">
            <CollapsibleSidebar 
              isCollapsed={false} 
              onToggle={() => setMobileMenuOpen(false)} 
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card shadow-sm border-b border-border sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {t("Tableau de bord", "Tablo jesyon", "Dashboard")}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Language and Theme toggles */}
                <div className="flex items-center space-x-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {/* User profile */}
                <div className="flex items-center space-x-3 pl-3 border-l border-border">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
                  </div>
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}