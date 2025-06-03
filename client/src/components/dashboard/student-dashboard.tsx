import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/use-language";
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  PlayCircle
} from "lucide-react";

interface StudentDashboardProps {
  data: any;
}

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const { t } = useLanguage();

  const stats = [
    {
      title: t("Cours Disponibles", "Kou Disponib yo"),
      value: data?.courses?.length || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: t("Devoirs en Cours", "Devwa nan Kou"),
      value: data?.assignments?.length || 0,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: t("Devoirs Soumis", "Devwa Soumèt yo"),
      value: data?.submissions?.length || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: t("Moyenne Générale", "Mwayèn Jeneral"),
      value: "15.5/20",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: t("Mes Cours", "Kou Mwen yo"),
      description: t("Accéder aux cours en ligne", "Antre nan kou sou entènèt yo"),
      icon: PlayCircle,
      color: "bg-blue-600"
    },
    {
      title: t("Devoirs", "Devwa yo"),
      description: t("Voir les devoirs à faire", "Gade devwa yo pou fè"),
      icon: FileText,
      color: "bg-orange-600"
    },
    {
      title: t("Notes", "Nòt yo"),
      description: t("Consulter mes notes", "Gade nòt mwen yo"),
      icon: Award,
      color: "bg-green-600"
    },
    {
      title: t("Calendrier", "Kalandriye"),
      description: t("Voir l'emploi du temps", "Gade emploi du temps"),
      icon: Calendar,
      color: "bg-purple-600"
    }
  ];

  const recentGrades = [
    {
      subject: t("Mathématiques", "Matematik"),
      grade: "16/20",
      type: t("Examen", "Egzamen"),
      date: "15 Jan 2024",
      color: "text-green-600"
    },
    {
      subject: t("Français", "Fransè"),
      grade: "14/20",
      type: t("Devoir", "Devwa"),
      date: "12 Jan 2024",
      color: "text-blue-600"
    },
    {
      subject: t("Sciences", "Syans"),
      grade: "18/20",
      type: t("Quiz", "Quiz"),
      date: "10 Jan 2024",
      color: "text-green-600"
    }
  ];

  const upcomingAssignments = [
    {
      title: t("Dissertation Français", "Disètasyon Fransè"),
      subject: t("Français", "Fransè"),
      dueDate: "20 Jan 2024",
      status: "pending",
      priority: "high"
    },
    {
      title: t("Exercices Mathématiques", "Egzèsis Matematik"),
      subject: t("Mathématiques", "Matematik"),
      dueDate: "22 Jan 2024",
      status: "in-progress",
      priority: "medium"
    },
    {
      title: t("Rapport Sciences", "Rapò Syans"),
      subject: t("Sciences", "Syans"),
      dueDate: "25 Jan 2024",
      status: "pending",
      priority: "low"
    }
  ];

  const courseProgress = [
    {
      title: t("Mathématiques", "Matematik"),
      progress: 85,
      lessons: 12,
      completed: 10
    },
    {
      title: t("Français", "Fransè"),
      progress: 72,
      lessons: 15,
      completed: 11
    },
    {
      title: t("Sciences", "Syans"),
      progress: 45,
      lessons: 20,
      completed: 9
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return t("Urgent", "Prèse");
      case "medium": return t("Moyen", "Mwayèn");
      case "low": return t("Faible", "Fèb");
      default: return priority;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {t("Accès Rapide", "Aksè Rapid")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              {t("Notes Récentes", "Nòt Resan yo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{grade.subject}</h4>
                    <p className="text-xs text-gray-500">
                      {grade.type} - {grade.date}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${grade.color}`}>
                    {grade.grade}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {t("Progression des Cours", "Pwogresyon Kou yo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{course.title}</h4>
                  <span className="text-sm text-gray-500">
                    {course.completed}/{course.lessons} {t("leçons", "leson yo")}
                  </span>
                </div>
                <Progress value={course.progress} className="w-full" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.progress}% {t("complété", "fini")}</span>
                  <Button size="sm" variant="ghost">
                    {t("Continuer", "Kontinye")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t("Devoirs à Rendre", "Devwa pou Rann")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{assignment.title}</h4>
                    <Badge className={getPriorityColor(assignment.priority)}>
                      {getPriorityLabel(assignment.priority)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {assignment.subject} - {t("Échéance", "Delè")}: {assignment.dueDate}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {assignment.status === "pending" ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                  <Button size="sm" variant="outline">
                    {assignment.status === "pending" ? t("Commencer", "Kòmanse") : t("Continuer", "Kontinye")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
