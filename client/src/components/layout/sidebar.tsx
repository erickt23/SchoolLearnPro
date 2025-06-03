import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  MessageSquare,
  Video,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Upload,
  CheckSquare,
  Clock,
  Presentation
} from "lucide-react";
import { useLocation } from "wouter";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        label: t("Tableau de bord", "Tablo jesyon", "Dashboard"),
        icon: LayoutDashboard,
        path: '/',
        badge: null
      }
    ];

    const roleBasedItems = {
      admin: [
        {
          key: 'users',
          label: t("Gestion des utilisateurs", "Jesyon itilizatè yo", "User Management"),
          icon: Users,
          path: '/admin/users',
          badge: null
        },
        {
          key: 'schools',
          label: t("Écoles", "Lekòl yo", "Schools"),
          icon: GraduationCap,
          path: '/admin/schools',
          badge: null
        },
        {
          key: 'courses',
          label: t("Gestion des cours", "Jesyon kou yo", "Course Management"),
          icon: BookOpen,
          path: '/admin/courses',
          badge: null
        },
        {
          key: 'analytics',
          label: t("Analyses", "Analiz yo", "Analytics"),
          icon: BarChart3,
          path: '/admin/analytics',
          badge: null
        }
      ],
      teacher: [
        {
          key: 'my-courses',
          label: t("Mes cours", "Kou mwen yo", "My Courses"),
          icon: BookOpen,
          path: '/teacher/courses',
          badge: null
        },
        {
          key: 'course-creation',
          label: t("Créer un cours", "Kreye yon kou", "Create Course"),
          icon: Upload,
          path: '/teacher/create-course',
          badge: null
        },
        {
          key: 'live-sessions',
          label: t("Sessions en direct", "Sesyon vivan yo", "Live Sessions"),
          icon: Video,
          path: '/teacher/live-sessions',
          badge: null
        },
        {
          key: 'assignments',
          label: t("Devoirs", "Devoir yo", "Assignments"),
          icon: ClipboardList,
          path: '/teacher/assignments',
          badge: 3
        },
        {
          key: 'quizzes',
          label: t("Quiz", "Quiz yo", "Quizzes"),
          icon: CheckSquare,
          path: '/teacher/quizzes',
          badge: null
        },
        {
          key: 'gradebook',
          label: t("Carnet de notes", "Kaye nòt yo", "Gradebook"),
          icon: BarChart3,
          path: '/teacher/gradebook',
          badge: null
        },
        {
          key: 'students',
          label: t("Mes élèves", "Elèv mwen yo", "My Students"),
          icon: Users,
          path: '/teacher/students',
          badge: null
        }
      ],
      student: [
        {
          key: 'my-courses',
          label: t("Mes cours", "Kou mwen yo", "My Courses"),
          icon: BookOpen,
          path: '/student/courses',
          badge: null
        },
        {
          key: 'schedule',
          label: t("Emploi du temps", "Òrè yo", "Schedule"),
          icon: Calendar,
          path: '/student/schedule',
          badge: null
        },
        {
          key: 'assignments',
          label: t("Devoirs", "Devoir yo", "Assignments"),
          icon: ClipboardList,
          path: '/student/assignments',
          badge: 2
        },
        {
          key: 'grades',
          label: t("Notes", "Nòt yo", "Grades"),
          icon: BarChart3,
          path: '/student/grades',
          badge: null
        },
        {
          key: 'live-classes',
          label: t("Cours en direct", "Kou vivan yo", "Live Classes"),
          icon: Video,
          path: '/student/live-classes',
          badge: null
        },
        {
          key: 'resources',
          label: t("Ressources", "Resous yo", "Resources"),
          icon: FileText,
          path: '/student/resources',
          badge: null
        }
      ],
      parent: [
        {
          key: 'children',
          label: t("Mes enfants", "Pitit mwen yo", "My Children"),
          icon: Users,
          path: '/parent/children',
          badge: null
        },
        {
          key: 'progress',
          label: t("Progression", "Pwogre yo", "Progress"),
          icon: BarChart3,
          path: '/parent/progress',
          badge: null
        },
        {
          key: 'messages',
          label: t("Messages", "Mesaj yo", "Messages"),
          icon: MessageSquare,
          path: '/parent/messages',
          badge: 1
        },
        {
          key: 'calendar',
          label: t("Calendrier", "Kalandriye", "Calendar"),
          icon: Calendar,
          path: '/parent/calendar',
          badge: null
        }
      ]
    };

    const commonItems = [
      {
        key: 'messages',
        label: t("Messages", "Mesaj yo", "Messages"),
        icon: MessageSquare,
        path: '/messages',
        badge: 2
      },
      {
        key: 'calendar',
        label: t("Calendrier", "Kalandriye", "Calendar"),
        icon: Calendar,
        path: '/calendar',
        badge: null
      }
    ];

    return [
      ...baseItems,
      ...(roleBasedItems[user?.role as keyof typeof roleBasedItems] || []),
      ...commonItems
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">EduHaïti</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-10 ${collapsed ? 'px-2' : 'px-3'} hover:bg-blue-50 hover:text-blue-700`}
                  onClick={() => setLocation(item.path)}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Settings and Logout */}
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 ${collapsed ? 'px-2' : 'px-3'} hover:bg-gray-50`}
          onClick={() => setLocation('/settings')}
        >
          <Settings className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
          {!collapsed && <span>{t("Paramètres", "Paramèt yo", "Settings")}</span>}
        </Button>
        
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 ${collapsed ? 'px-2' : 'px-3'} hover:bg-red-50 hover:text-red-700`}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
          {!collapsed && <span>{t("Déconnexion", "Dekonekte", "Logout")}</span>}
        </Button>
      </div>
    </div>
  );
}