import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/use-language";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  DollarSign
} from "lucide-react";

interface ParentDashboardProps {
  data: any;
}

export default function ParentDashboard({ data }: ParentDashboardProps) {
  const { t } = useLanguage();

  // Mock data for demonstration - in real app this would come from data prop
  const children = [
    {
      id: 1,
      name: "Marie Dupont",
      class: "5ème année A",
      school: "École Saint-Joseph",
      averageGrade: 16.5,
      attendance: 95,
      lastActivity: t("Devoir de mathématiques soumis", "Devwa matematik soumèt")
    },
    {
      id: 2,
      name: "Jean Dupont",
      class: "3ème année B",
      school: "École Saint-Joseph",
      averageGrade: 14.2,
      attendance: 88,
      lastActivity: t("Absent aujourd'hui", "Absan jodi a")
    }
  ];

  const stats = [
    {
      title: t("Enfants Scolarisés", "Timoun nan Lekòl"),
      value: children.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: t("Moyenne Générale", "Mwayèn Jeneral"),
      value: "15.4/20",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: t("Messages Non Lus", "Mesaj pa Li yo"),
      value: 3,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: t("Factures en Attente", "Faktè nan Tann"),
      value: "25,000 HTG",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: t("Contacter École", "Kontakte Lekòl"),
      description: t("Envoyer un message", "Voye yon mesaj"),
      icon: MessageSquare,
      color: "bg-blue-600"
    },
    {
      title: t("Voir Bulletins", "Gade Bilten yo"),
      description: t("Consulter les notes", "Gade nòt yo"),
      icon: Award,
      color: "bg-green-600"
    },
    {
      title: t("Paiements", "Peyman yo"),
      description: t("Régler les frais", "Peye frè yo"),
      icon: DollarSign,
      color: "bg-purple-600"
    },
    {
      title: t("Calendrier", "Kalandriye"),
      description: t("Événements scolaires", "Evènman lekòl yo"),
      icon: Calendar,
      color: "bg-orange-600"
    }
  ];

  const recentAlerts = [
    {
      type: "attendance",
      title: t("Absence signalée", "Absan rapòte"),
      description: t("Jean - Absent ce matin", "Jean - Absan maten an"),
      time: t("il y a 2h", "depi 2h"),
      severity: "warning"
    },
    {
      type: "grade",
      title: t("Nouvelle note", "Nouvo nòt"),
      description: t("Marie - Mathématiques: 18/20", "Marie - Matematik: 18/20"),
      time: t("hier", "yè"),
      severity: "success"
    },
    {
      type: "payment",
      title: t("Facture échue", "Faktè ki depase"),
      description: t("Frais de scolarité - 15,000 HTG", "Frè lekòl - 15,000 HTG"),
      time: t("il y a 3 jours", "depi 3 jou"),
      severity: "error"
    }
  ];

  const upcomingEvents = [
    {
      title: t("Réunion parents-enseignants", "Reyinyon paran-pwofesè"),
      date: "25 Jan 2024",
      time: "14:00",
      location: t("Salle de conférence", "Sal konferans")
    },
    {
      title: t("Examen de mi-semestre", "Egzamen mitan semèn"),
      date: "30 Jan 2024",
      time: "08:00",
      location: t("Classes respectives", "Klas respektif yo")
    },
    {
      title: t("Sortie éducative", "Sòti edikatif"),
      date: "5 Fév 2024",
      time: "09:00",
      location: t("Musée National", "Mize Nasyonal")
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "text-red-600 bg-red-100";
      case "warning": return "text-orange-600 bg-orange-100";
      case "success": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return AlertTriangle;
      case "warning": return Clock;
      case "success": return CheckCircle;
      default: return Clock;
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
              <BookOpen className="h-5 w-5 mr-2" />
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

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t("Alertes Récentes", "Alèt Resan yo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => {
                const IconComponent = getSeverityIcon(alert.severity);
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {alert.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t("Mes Enfants", "Timoun Mwen yo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {children.map((child) => (
              <div key={child.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg">{child.name}</h3>
                  <Badge variant="outline">{child.class}</Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{child.school}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{t("Moyenne", "Mwayèn")}</span>
                      <span className="font-medium">{child.averageGrade}/20</span>
                    </div>
                    <Progress value={(child.averageGrade / 20) * 100} className="w-full" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{t("Assiduité", "Asiduité")}</span>
                      <span className="font-medium">{child.attendance}%</span>
                    </div>
                    <Progress value={child.attendance} className="w-full" />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>{t("Dernière activité", "Dènye aktivite")}:</strong> {child.lastActivity}
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      {t("Voir Détails", "Gade Detay yo")}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t("Contacter", "Kontakte")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {t("Événements à Venir", "Evènman k ap Vini yo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-500">
                    {event.date} à {event.time} - {event.location}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  {t("Détails", "Detay yo")}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
