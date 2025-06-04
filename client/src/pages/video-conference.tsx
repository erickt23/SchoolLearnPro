import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Share, 
  Users, 
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Square,
  Monitor,
  MessageSquare,
  Settings
} from "lucide-react";

export default function VideoConference() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const mockClasses = [
    { id: 1, name: "Mathématiques - 3ème Année", participants: 25, status: "live" },
    { id: 2, name: "Sciences Naturelles - 2ème Année", participants: 18, status: "scheduled" },
    { id: 3, name: "Histoire d'Haïti - 1ère Année", participants: 22, status: "ended" }
  ];

  const mockParticipants = [
    { id: 1, name: "Jean Dupont", role: "student", isPresent: true },
    { id: 2, name: "Marie Claire", role: "student", isPresent: true },
    { id: 3, name: "Pierre Joseph", role: "student", isPresent: false },
    { id: 4, name: "Prof. Antoine", role: "teacher", isPresent: true }
  ];

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
              {t("Visioconférence", "Videokominikasyon", "Video Conference")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Cours en direct et réunions virtuelles", "Kou yo ki ap viv ak reyinyon vityèl", "Live classes and virtual meetings")}
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Video className="h-4 w-4 mr-2" />
          {t("Démarrer un cours", "Kòmanse yon kou", "Start Class")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("Cours en direct", "Kou k ap viv", "Live Class")}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={isRecording ? "destructive" : "secondary"}>
                    {isRecording ? t("Enregistrement", "Anrejistreman", "Recording") : t("Hors ligne", "Pa sou entènèt", "Offline")}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    24 {t("participants", "patisipan", "participants")}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Video Display Area */}
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">
                    {t("Zone vidéo principale", "Zòn videyo prensipal", "Main video area")}
                  </p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Class Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Informations du cours", "Enfòmasyon kou a", "Class Information")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("Matière", "Matye", "Subject")}</Label>
                  <p className="font-medium">Mathématiques Avancées</p>
                </div>
                <div>
                  <Label>{t("Classe", "Klas", "Class")}</Label>
                  <p className="font-medium">3ème Année Secondaire</p>
                </div>
                <div>
                  <Label>{t("Heure de début", "Lè kòmanseman", "Start Time")}</Label>
                  <p className="font-medium">14:00</p>
                </div>
                <div>
                  <Label>{t("Durée", "Dire", "Duration")}</Label>
                  <p className="font-medium">1h 30min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Participants", "Patisipan yo", "Participants")} ({mockParticipants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${participant.isPresent ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">{participant.name}</span>
                  </div>
                  <Badge variant={participant.role === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                    {participant.role === 'teacher' ? t("Prof", "Pwofesè", "Teacher") : t("Élève", "Elèv", "Student")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("Discussion", "Diskisyon", "Chat")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Jean:</span> Pouvez-vous répéter la formule?
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Marie:</span> Merci pour l'explication!
                </div>
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder={t("Tapez votre message...", "Ekri mesaj ou...", "Type your message...")}
                  className="text-sm"
                />
                <Button size="sm">
                  {t("Envoyer", "Voye", "Send")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("Prochains cours", "Pwochen kou yo", "Upcoming Classes")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockClasses.filter(c => c.status === 'scheduled').map((cls) => (
                <div key={cls.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm font-medium">{cls.name}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      15:30
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {cls.participants}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}