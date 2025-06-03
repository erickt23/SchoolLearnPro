import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  MessageSquare,
  Plus,
  Calendar,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface TeacherDashboardProps {
  data: any;
}

export default function TeacherDashboard({ data }: TeacherDashboardProps) {
  const { t } = useLanguage();

  const stats = [
    {
      title: t("Mes Classes", "Klas Mwen yo"),
      value: data?.classes?.length || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: t("Cours Créés", "Kou Kreye yo"),
      value: data?.courses?.length || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: t("Devoirs Actifs", "Devwa Aktif yo"),
      value: data?.assignments?.length || 0,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: t("Messages", "Mesaj yo"),
      value: 5,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: t("Prendre Présences", "Pran Prezans yo"),
      description: t("Marquer les présences du jour", "Make prezans jou a"),
      icon: CheckSquare,
      color: "bg-blue-600"
    },
    {
      title: t("Nouveau Cours", "Nouvo Kou"),
      description: t("Créer un nouveau cours", "Kreye yon nouvo kou"),
      icon: Plus,
      color: "bg-green-600"
    },
    {
      title: t("Saisir Notes", "Antre Nòt yo"),
      description: t("Entrer les notes des élèves", "Antre nòt elèv yo"),
      icon: FileText,
      color: "bg-orange-600"
    },
    {
      title: t("Planifier Cours", "Planifye Kou"),
      description: t("Organiser l'emploi du temps", "Òganize emploi du temps"),
      icon: Calendar,
      color: "bg-purple-600"
    }
  ];

  const recentActivities = [
    {
      type: "submission",
      title: t("Devoir soumis", "Devwa soumèt"),
      description: t("Jean Baptiste - Mathématiques", "Jean Baptiste - Matematik"),
      time: t("il y a 2h", "depi 2h"),
      icon: FileText,
      color: "text-green-600"
    },
    {
      type: "message",
      title: t("Nouveau message", "Nouvo mesaj"),
      description: t("Mme Pierre - Absence de Marie", "Mme Pierre - Absan Marie"),
      time: t("il y a 3h", "depi 3h"),
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      type: "reminder",
      title: t("Rappel", "Raple"),
      description: t("Examen Français - Mercredi", "Egzamen Fransè - Mèkredi"),
      time: t("demain", "demen"),
      icon: AlertCircle,
      color: "text-orange-600"
    }
  ];

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
              <TrendingUp className="h-5 w-5 mr-2" />
              {t("Actions Rapides", "Aksyon Rapid yo")}
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

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {t("Activités Récentes", "Aktivite Resan yo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      {data?.classes && data.classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t("Mes Classes", "Klas Mwen yo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.classes.map((cls: any) => (
                <div key={cls.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{cls.name}</h3>
                    <Badge variant="outline">{cls.level}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t("Année", "Ane")}: {cls.academicYear}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{t("Élèves", "Elèv yo")}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      {t("Voir", "Gade")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Assignments */}
      {data?.assignments && data.assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t("Devoirs à Corriger", "Devwa pou Korije")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.assignments.slice(0, 5).map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{assignment.title}</h4>
                    <p className="text-xs text-gray-500">
                      {t("Échéance", "Delè")}: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : t("Aucune", "Okenn")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {t("En attente", "Ap tann")}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {t("Corriger", "Korije")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
