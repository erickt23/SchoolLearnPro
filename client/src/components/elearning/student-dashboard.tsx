import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Calendar, 
  Users, 
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Download,
  Star,
  ChevronRight
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  thumbnail: string;
  category: string;
  rating: number;
  duration: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  duration: string;
  participants: number;
  status: 'upcoming' | 'live' | 'ended';
}

export default function StudentDashboard() {
  const { t } = useLanguage();
  
  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction aux Mathématiques",
      instructor: "Prof. Jean Pierre",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      nextLesson: "Équations du second degré",
      thumbnail: "/api/placeholder/300/200",
      category: "Mathématiques",
      rating: 4.8,
      duration: "8h 30min"
    },
    {
      id: "2", 
      title: "Histoire d'Haïti",
      instructor: "Prof. Marie Claire",
      progress: 60,
      totalLessons: 15,
      completedLessons: 9,
      nextLesson: "L'indépendance de 1804",
      thumbnail: "/api/placeholder/300/200",
      category: "Histoire",
      rating: 4.9,
      duration: "6h 15min"
    },
    {
      id: "3",
      title: "Kreyòl Ayisyen",
      instructor: "Prof. Claude Michel",
      progress: 40,
      totalLessons: 12,
      completedLessons: 5,
      nextLesson: "Grammaire avancée",
      thumbnail: "/api/placeholder/300/200",
      category: "Langues",
      rating: 4.7,
      duration: "5h 45min"
    }
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Résolution d'équations",
      course: "Mathématiques",
      dueDate: "2025-06-08",
      status: "pending"
    },
    {
      id: "2",
      title: "Analyse historique",
      course: "Histoire d'Haïti", 
      dueDate: "2025-06-10",
      status: "submitted",
      grade: 85
    },
    {
      id: "3",
      title: "Composition en créole",
      course: "Kreyòl Ayisyen",
      dueDate: "2025-06-12",
      status: "pending"
    }
  ]);

  const [liveSessions] = useState<LiveSession[]>([
    {
      id: "1",
      title: "Révision Mathématiques",
      instructor: "Prof. Jean Pierre",
      startTime: "14:00",
      duration: "1h 30min",
      participants: 25,
      status: "upcoming"
    },
    {
      id: "2",
      title: "Discussion Histoire",
      instructor: "Prof. Marie Claire",
      startTime: "16:00", 
      duration: "45min",
      participants: 18,
      status: "live"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">{t("En attente", "Ap tann", "Pending")}</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">{t("Soumis", "Soumèt", "Submitted")}</Badge>;
      case 'graded':
        return <Badge variant="outline" className="text-green-600 border-green-600">{t("Noté", "Kote", "Graded")}</Badge>;
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">{t("En direct", "Vivan", "Live")}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">{t("À venir", "Ap vini", "Upcoming")}</Badge>;
      case 'ended':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">{t("Terminé", "Fini", "Ended")}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("Tableau de bord étudiant", "Tablo jesyon elèv la", "Student Dashboard")}
        </h1>
        <p className="text-gray-600">
          {t("Bienvenue! Continuez votre apprentissage.", "Byenveni! Kontinye aprann ou an.", "Welcome! Continue your learning journey.")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("Cours inscrits", "Kou yo enskriw", "Enrolled Courses")}
                </p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("Progression moyenne", "Pwogre mwayen", "Average Progress")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("Devoirs en attente", "Devoir ki ap tann yo", "Pending Assignments")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("Sessions aujourd'hui", "Sesyon jodi a", "Today's Sessions")}
                </p>
                <p className="text-3xl font-bold text-gray-900">{liveSessions.length}</p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {t("Mes cours", "Kou mwen yo", "My Courses")}
                </CardTitle>
                <Button variant="outline" size="sm">
                  {t("Voir tout", "Gade tout", "View All")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-gray-500" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.instructor}</p>
                          </div>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            <span>{course.completedLessons}/{course.totalLessons} {t("leçons", "leson yo", "lessons")}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {t("Progression", "Pwogre", "Progress")}: {course.progress}%
                            </span>
                            <span className="font-medium text-blue-600">
                              {t("Prochaine leçon", "Pwochen leson", "Next lesson")}: {course.nextLesson}
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <Button variant="outline" size="sm">
                            {t("Continuer", "Kontinye", "Continue")}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Live Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Sessions en direct", "Sesyon vivan yo", "Live Sessions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{session.title}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{session.instructor}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{session.startTime} ({session.duration})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{session.participants}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      variant={session.status === 'live' ? 'default' : 'outline'}
                    >
                      {session.status === 'live' 
                        ? t("Rejoindre", "Rantre", "Join")
                        : t("Programmer rappel", "Pwograme raple", "Set Reminder")
                      }
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Devoirs récents", "Devoir resan yo", "Recent Assignments")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{assignment.course}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {t("Échéance", "Delè", "Due")}: {assignment.dueDate}
                      </span>
                      {assignment.grade && (
                        <span className="font-medium text-green-600">
                          {assignment.grade}/100
                        </span>
                      )}
                    </div>
                    {assignment.status === 'pending' && (
                      <Button size="sm" className="w-full mt-3">
                        {t("Soumettre", "Soumèt", "Submit")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Actions rapides", "Aksyon rapid yo", "Quick Actions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("Emploi du temps", "Òrè yo", "Schedule")}
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  {t("Mes notes", "Nòt mwen yo", "My Grades")}
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t("Ressources", "Resous yo", "Resources")}
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("Certificats", "Sètifika yo", "Certificates")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}