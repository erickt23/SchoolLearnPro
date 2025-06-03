import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Plus,
  Settings,
  FileText,
  DollarSign
} from "lucide-react";

interface AdminDashboardProps {
  data: any;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const { t } = useLanguage();

  const stats = [
    {
      title: t("Classes Actives", "Klas Aktif yo"),
      value: data?.stats?.totalClasses || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: t("Matières", "Matièr yo"),
      value: data?.stats?.totalSubjects || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: t("Utilisateurs", "Itilizatè yo"),
      value: data?.stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: t("Revenus Mois", "Revni Mwa"),
      value: "45,000 HTG",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const quickActions = [
    {
      title: t("Nouvelle Classe", "Nouvo Klas"),
      description: t("Créer une nouvelle classe", "Kreye yon nouvo klas"),
      icon: Plus,
      color: "bg-blue-600"
    },
    {
      title: t("Gestion Utilisateurs", "Jesyon Itilizatè"),
      description: t("Gérer les comptes utilisateurs", "Jesyon kont itilizatè yo"),
      icon: Users,
      color: "bg-green-600"
    },
    {
      title: t("Rapports", "Rapò yo"),
      description: t("Consulter les rapports", "Gade rapò yo"),
      icon: FileText,
      color: "bg-purple-600"
    },
    {
      title: t("Configuration", "Konfigirasyon"),
      description: t("Paramètres système", "Paramèt sistèm"),
      icon: Settings,
      color: "bg-orange-600"
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
            <CardTitle>{t("Actions Rapides", "Aksyon Rapid yo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center space-y-2"
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Activité Récente", "Aktivite Resan")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("Nouveau enseignant inscrit", "Nouvo pwofesè enskrip")}
                  </p>
                  <p className="text-xs text-gray-500">Marie Dubois - il y a 2h</p>
                </div>
                <Badge variant="secondary">Nouveau</Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("Classe créée", "Klas kreye")}
                  </p>
                  <p className="text-xs text-gray-500">5ème année A - il y a 4h</p>
                </div>
                <Badge variant="outline">Système</Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("Paiement reçu", "Peyman resevwa")}
                  </p>
                  <p className="text-xs text-gray-500">École St-Joseph - 15,000 HTG</p>
                </div>
                <Badge variant="secondary">Finance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      {data?.classes && data.classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Aperçu des Classes", "Apèsi Klas yo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.classes.slice(0, 6).map((cls: any) => (
                <div key={cls.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{cls.name}</h3>
                    <Badge variant="outline">{cls.level}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("Année académique", "Ane akademik")}: {cls.academicYear}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("32 élèves", "32 elèv")}
                    </span>
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
