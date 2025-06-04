import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Smartphone, 
  Download, 
  Settings,
  Users,
  Bell,
  ArrowLeft,
  QrCode,
  Wifi,
  WifiOff,
  RefreshCw,
  Shield,
  Eye,
  Calendar,
  BookOpen,
  MessageSquare
} from "lucide-react";

export default function MobileApp() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [offlineMode, setOfflineMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const mockAppStats = {
    totalDownloads: 1250,
    activeUsers: 892,
    offlineUsers: 45,
    lastUpdate: "2025-01-15"
  };

  const mockDevices = [
    {
      id: 1,
      user: "Jean Dupont",
      device: "iPhone 14",
      os: "iOS 17.2",
      version: "1.2.1",
      lastSync: "2025-01-15 09:30",
      status: "online"
    },
    {
      id: 2,
      user: "Marie Claire",
      device: "Samsung Galaxy S23",
      os: "Android 14",
      version: "1.2.1", 
      lastSync: "2025-01-15 08:45",
      status: "offline"
    },
    {
      id: 3,
      user: "Pierre Joseph",
      device: "iPhone 13",
      os: "iOS 16.7",
      version: "1.1.9",
      lastSync: "2025-01-14 16:20",
      status: "outdated"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Wifi className="h-3 w-3 mr-1" />
          {t("En ligne", "Sou entènèt", "Online")}
        </Badge>;
      case "offline":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <WifiOff className="h-3 w-3 mr-1" />
          {t("Hors ligne", "Pa sou entènèt", "Offline")}
        </Badge>;
      case "outdated":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <Download className="h-3 w-3 mr-1" />
          {t("Obsolète", "Ansyen", "Outdated")}
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Retour", "Tounen", "Back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("Application Mobile", "Aplikasyon mobil", "Mobile Application")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Gestion de l'app mobile native", "Jesyon app mobil natif la", "Native mobile app management")}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            {t("Code QR", "Kòd QR", "QR Code")}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            {t("Publier", "Pibliye", "Publish")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("Vue d'ensemble", "Akèylan", "Overview")}</TabsTrigger>
          <TabsTrigger value="devices">{t("Appareils", "Aparèy yo", "Devices")}</TabsTrigger>
          <TabsTrigger value="features">{t("Fonctionnalités", "Fonksyonalite", "Features")}</TabsTrigger>
          <TabsTrigger value="settings">{t("Paramètres", "Paramèt yo", "Settings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Téléchargements", "Telechajman yo", "Downloads")}
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAppStats.totalDownloads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +15% {t("ce mois-ci", "mwa sa a", "this month")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Utilisateurs actifs", "Itilizatè aktif yo", "Active Users")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAppStats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {t("Connectés aujourd'hui", "Konekte jodi a", "Connected today")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Mode hors ligne", "Mòd pa sou entènèt", "Offline Mode")}
                </CardTitle>
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAppStats.offlineUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {t("Utilisateurs hors ligne", "Itilizatè pa sou entènèt", "Offline users")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Dernière MAJ", "Dènye MAJ", "Last Update")}
                </CardTitle>
                <Sync className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">v1.2.1</div>
                <p className="text-xs text-muted-foreground">
                  {mockAppStats.lastUpdate}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* App Store Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>iOS App Store</span>
                </CardTitle>
                <CardDescription>
                  {t("Version disponible pour iPhone et iPad", "Vèsyon disponib pou iPhone ak iPad", "Available for iPhone and iPad")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{t("Version actuelle", "Vèsyon kounye a", "Current version")}:</span>
                  <span className="font-medium">1.2.1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Téléchargements", "Telechajman yo", "Downloads")}:</span>
                  <span className="font-medium">650</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Note moyenne", "Nòt mwayèn", "Average rating")}:</span>
                  <span className="font-medium">4.8 ⭐</span>
                </div>
                <Button className="w-full">
                  {t("Voir sur l'App Store", "Gade sou App Store", "View on App Store")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Google Play Store</span>
                </CardTitle>
                <CardDescription>
                  {t("Version disponible pour Android", "Vèsyon disponib pou Android", "Available for Android")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{t("Version actuelle", "Vèsyon kounye a", "Current version")}:</span>
                  <span className="font-medium">1.2.1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Téléchargements", "Telechajman yo", "Downloads")}:</span>
                  <span className="font-medium">600</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Note moyenne", "Nòt mwayèn", "Average rating")}:</span>
                  <span className="font-medium">4.7 ⭐</span>
                </div>
                <Button className="w-full">
                  {t("Voir sur Play Store", "Gade sou Play Store", "View on Play Store")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          {/* Device Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Appareils connectés", "Aparèy ki konekte", "Connected Devices")}</CardTitle>
              <CardDescription>
                {t("Gérer les appareils des utilisateurs", "Jere aparèy itilizatè yo", "Manage user devices")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{device.user}</p>
                        <p className="text-sm text-gray-500">{device.device} • {device.os}</p>
                        <p className="text-xs text-gray-400">
                          {t("Dernière sync", "Dènye sync", "Last sync")}: {device.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">v{device.version}</p>
                      {getStatusBadge(device.status)}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Sync className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          {/* Mobile Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t("Calendrier", "Kalandye", "Calendar")}</span>
                </CardTitle>
                <CardDescription>
                  {t("Emploi du temps et événements", "Anvwa tan ak evenman yo", "Schedule and events")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• {t("Synchronisation automatique", "Sichronizasyon otomatik", "Auto sync")}</p>
                  <p>• {t("Notifications de cours", "Notifikasyon kou yo", "Class notifications")}</p>
                  <p>• {t("Mode hors ligne", "Mòd pa sou entènèt", "Offline mode")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{t("Cours", "Kou yo", "Courses")}</span>
                </CardTitle>
                <CardDescription>
                  {t("Contenu pédagogique", "Kontni pedagojik", "Educational content")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• {t("Téléchargement de cours", "Telechajman kou yo", "Course downloads")}</p>
                  <p>• {t("Vidéos et documents", "Video ak dokiman yo", "Videos and documents")}</p>
                  <p>• {t("Progress tracking", "Swivi pwogrè", "Progress tracking")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>{t("Messages", "Mesaj yo", "Messages")}</span>
                </CardTitle>
                <CardDescription>
                  {t("Communication instantanée", "Kominikasyon enstantane", "Instant messaging")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• {t("Chat en temps réel", "Chat nan tan reyèl", "Real-time chat")}</p>
                  <p>• {t("Messages hors ligne", "Mesaj pa sou entènèt", "Offline messages")}</p>
                  <p>• {t("Pièces jointes", "Fichye yo jwenn", "Attachments")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>{t("Sécurité", "Sekirite", "Security")}</span>
                </CardTitle>
                <CardDescription>
                  {t("Protection des données", "Pwoteksyon done yo", "Data protection")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• {t("Authentification biométrique", "Otantifikasyon byometrik", "Biometric auth")}</p>
                  <p>• {t("Chiffrement des données", "Chifman done yo", "Data encryption")}</p>
                  <p>• {t("Gestion des sessions", "Jesyon sesyon yo", "Session management")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Paramètres de l'application", "Paramèt aplikasyon an", "App Settings")}</CardTitle>
              <CardDescription>
                {t("Configuration globale de l'app mobile", "Konfigirasyon global app mobil la", "Global mobile app configuration")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("Mode hors ligne", "Mòd pa sou entènèt", "Offline Mode")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("Permettre l'utilisation sans connexion", "Pèmèt itilizasyon san koneksyon", "Allow usage without connection")}
                  </p>
                </div>
                <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("Notifications push", "Notifikasyon push", "Push Notifications")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("Envoyer des notifications en temps réel", "Voye notifikasyon nan tan reyèl", "Send real-time notifications")}
                  </p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("Synchronisation automatique", "Sichronizasyon otomatik", "Auto Sync")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("Synchroniser automatiquement les données", "Sichronize otomatikman done yo", "Automatically sync data")}
                  </p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-interval">{t("Intervalle de synchronisation", "Entèval sichronizasyon", "Sync Interval")}</Label>
                <Input 
                  id="sync-interval" 
                  placeholder="15"
                  type="number"
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  {t("Minutes entre chaque synchronisation", "Minit ant chak sichronizasyon", "Minutes between each sync")}
                </p>
              </div>

              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {t("Sauvegarder les paramètres", "Konsève paramèt yo", "Save Settings")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}