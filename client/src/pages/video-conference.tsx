import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  Users, 
  MessageSquare, 
  Settings,
  Camera,
  Calendar,
  Clock,
  Play,
  Square,
  Volume2,
  VolumeX,
  MoreVertical,
  UserPlus,
  Copy,
  Share2,
  Maximize,
  Minimize,
  Hand,
  User,
  GraduationCap
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface VideoSession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  hostId: string;
  hostName: string;
  participants: Participant[];
  status: 'scheduled' | 'live' | 'ended';
  recordingEnabled: boolean;
  isPublic: boolean;
  classId?: string;
  className?: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  isConnected: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  joinedAt?: Date;
}

export default function VideoConference() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [currentSession, setCurrentSession] = useState<VideoSession | null>(null);
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Form state for creating new sessions
  const [newSessionForm, setNewSessionForm] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: "60",
    isPublic: false,
    recordingEnabled: true,
    classId: ""
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: VideoSession[] = [
      {
        id: "1",
        title: t("Cours de Mathématiques - Algèbre", "Kou Matematik - Aljèb", "Mathematics Course - Algebra"),
        description: t("Introduction aux équations linéaires", "Entwodiksyon nan ekwasyon lineè yo", "Introduction to linear equations"),
        startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        endTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
        hostId: "teacher1",
        hostName: "Prof. Jean Baptiste",
        participants: [],
        status: 'scheduled',
        recordingEnabled: true,
        isPublic: false,
        classId: "math-6eme",
        className: "6ème Année"
      },
      {
        id: "2",
        title: t("Session de révision - Histoire", "Sesyon revizyon - Istwa", "Review Session - History"),
        description: t("Révision pour l'examen d'histoire", "Revizyon pou egzamen istwa a", "Review for history exam"),
        startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
        endTime: new Date(Date.now() + 45 * 60 * 1000), // Ends in 45 minutes
        hostId: "teacher2",
        hostName: "Prof. Marie Claire",
        participants: [
          { id: "1", name: "Jean Pierre", role: 'student', isConnected: true, hasVideo: true, hasAudio: true },
          { id: "2", name: "Marie Rose", role: 'student', isConnected: true, hasVideo: false, hasAudio: true },
        ],
        status: 'live',
        recordingEnabled: true,
        isPublic: false,
        classId: "hist-5eme",
        className: "5ème Année"
      }
    ];
    setSessions(mockSessions);
  }, [t]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const joinSession = async (session: VideoSession) => {
    setCurrentSession(session);
    setIsInCall(true);
    
    try {
      // In a real implementation, this would initialize WebRTC
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast({
        title: t("Connexion réussie", "Koneksyon reyisi", "Connected successfully"),
        description: t("Vous avez rejoint la session", "Ou rantre nan sesyon an", "You've joined the session"),
      });
    } catch (error) {
      toast({
        title: t("Erreur de connexion", "Erè koneksyon", "Connection error"),
        description: t("Impossible d'accéder à la caméra/micro", "Nou pa ka jwenn kamera/mikwo a", "Cannot access camera/microphone"),
        variant: "destructive"
      });
    }
  };

  const leaveSession = () => {
    setIsInCall(false);
    setCurrentSession(null);
    setIsScreenSharing(false);
    setIsRecording(false);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? 
        t("Caméra désactivée", "Kamera dèaktive", "Camera disabled") :
        t("Caméra activée", "Kamera aktive", "Camera enabled"),
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? 
        t("Micro désactivé", "Mikwo dèaktive", "Microphone disabled") :
        t("Micro activé", "Mikwo aktive", "Microphone enabled"),
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? 
        t("Partage d'écran arrêté", "Pataj ekran an rete", "Screen sharing stopped") :
        t("Partage d'écran démarré", "Pataj ekran an kòmanse", "Screen sharing started"),
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? 
        t("Enregistrement arrêté", "Anrejistreman an rete", "Recording stopped") :
        t("Enregistrement démarré", "Anrejistreman an kòmanse", "Recording started"),
    });
  };

  const createSession = () => {
    if (!newSessionForm.title.trim()) {
      toast({
        title: t("Erreur", "Erè", "Error"),
        description: t("Le titre est requis", "Tit la obligatwa", "Title is required"),
        variant: "destructive"
      });
      return;
    }

    const newSession: VideoSession = {
      id: Date.now().toString(),
      title: newSessionForm.title,
      description: newSessionForm.description,
      startTime: new Date(newSessionForm.startTime),
      endTime: new Date(new Date(newSessionForm.startTime).getTime() + parseInt(newSessionForm.duration) * 60 * 1000),
      hostId: user?.id.toString() || "",
      hostName: `${user?.firstName} ${user?.lastName}`,
      participants: [],
      status: 'scheduled',
      recordingEnabled: newSessionForm.recordingEnabled,
      isPublic: newSessionForm.isPublic,
      classId: newSessionForm.classId
    };

    setSessions(prev => [...prev, newSession]);
    setShowCreateDialog(false);
    setNewSessionForm({
      title: "",
      description: "",
      startTime: "",
      duration: "60",
      isPublic: false,
      recordingEnabled: true,
      classId: ""
    });

    toast({
      title: t("Session créée", "Sesyon kreye", "Session created"),
      description: t("Votre session a été programmée", "Sesyon ou an pwograme", "Your session has been scheduled"),
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      sender: `${user?.firstName} ${user?.lastName}`,
      message: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage("");
  };

  if (isInCall && currentSession) {
    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Top bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-foreground">{currentSession.title}</h1>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Square className="h-3 w-3 mr-1" />
                {t("REC", "ANR", "REC")}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {currentSession.participants.length + 1}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(new Date())}
            </Badge>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Video area */}
          <div className="flex-1 bg-black relative">
            {/* Main video */}
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              className="w-full h-full object-cover"
              style={{ display: isVideoEnabled ? 'block' : 'none' }}
            />
            {!isVideoEnabled && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <VideoOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white">{t("Caméra désactivée", "Kamera dèaktive", "Camera disabled")}</p>
                </div>
              </div>
            )}

            {/* Participants grid (smaller videos) */}
            <div className="absolute top-4 right-4 space-y-2">
              {currentSession.participants.map((participant) => (
                <div key={participant.id} className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                  {participant.hasVideo ? (
                    <div className="text-white text-xs">{participant.name}</div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="h-6 w-6 text-gray-400 mx-auto" />
                      <div className="text-white text-xs mt-1">{participant.name}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full p-4">
                <Button
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  className="rounded-full"
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  className="rounded-full"
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="lg"
                  onClick={toggleScreenShare}
                  className="rounded-full"
                >
                  <Monitor className="h-5 w-5" />
                </Button>

                {user?.role === 'teacher' && (
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="lg"
                    onClick={toggleRecording}
                    className="rounded-full"
                  >
                    {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowChat(!showChat)}
                  className="rounded-full"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={leaveSession}
                  className="rounded-full"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat panel */}
          {showChat && (
            <div className="w-80 bg-card border-l border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">{t("Chat", "Chat", "Chat")}</h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="text-xs text-muted-foreground">{msg.sender}</div>
                    <div className="text-sm text-foreground bg-muted p-2 rounded-lg">{msg.message}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("Tapez votre message...", "Ekri mesaj ou a...", "Type your message...")}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    {t("Envoyer", "Voye", "Send")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("Vidéoconférence", "Videokonferans", "Video Conference")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("Organisez et participez à des sessions en ligne", "Òganize ak patisipe nan sesyon sou entènèt yo", "Organize and participate in online sessions")}
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Video className="h-4 w-4 mr-2" />
                {t("Créer une session", "Kreye yon sesyon", "Create Session")}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle>{t("Nouvelle session vidéo", "Nouvo sesyon videyo", "New Video Session")}</DialogTitle>
                <DialogDescription>
                  {t("Planifiez une session de vidéoconférence", "Planifye yon sesyon videokonferans", "Schedule a video conference session")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("Titre", "Tit", "Title")}</Label>
                  <Input
                    id="title"
                    value={newSessionForm.title}
                    onChange={(e) => setNewSessionForm(prev => ({...prev, title: e.target.value}))}
                    placeholder={t("Ex: Cours de Mathématiques", "Ex: Kou Matematik", "Ex: Mathematics Course")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{t("Description", "Deskripsyon", "Description")}</Label>
                  <Textarea
                    id="description"
                    value={newSessionForm.description}
                    onChange={(e) => setNewSessionForm(prev => ({...prev, description: e.target.value}))}
                    placeholder={t("Décrivez le contenu de la session", "Dekri kisa k nan sesyon an", "Describe the session content")}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">{t("Heure de début", "Lè kòmansman", "Start Time")}</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newSessionForm.startTime}
                      onChange={(e) => setNewSessionForm(prev => ({...prev, startTime: e.target.value}))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">{t("Durée (minutes)", "Dire (minit)", "Duration (minutes)")}</Label>
                    <Select value={newSessionForm.duration} onValueChange={(value) => setNewSessionForm(prev => ({...prev, duration: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 {t("minutes", "minit", "minutes")}</SelectItem>
                        <SelectItem value="60">60 {t("minutes", "minit", "minutes")}</SelectItem>
                        <SelectItem value="90">90 {t("minutes", "minit", "minutes")}</SelectItem>
                        <SelectItem value="120">120 {t("minutes", "minit", "minutes")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recording"
                    checked={newSessionForm.recordingEnabled}
                    onCheckedChange={(checked) => setNewSessionForm(prev => ({...prev, recordingEnabled: checked}))}
                  />
                  <Label htmlFor="recording">{t("Enregistrer la session", "Anrejistre sesyon an", "Record session")}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newSessionForm.isPublic}
                    onCheckedChange={(checked) => setNewSessionForm(prev => ({...prev, isPublic: checked}))}
                  />
                  <Label htmlFor="public">{t("Session publique", "Sesyon piblik", "Public session")}</Label>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={createSession} className="flex-1">
                    {t("Créer", "Kreye", "Create")}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    {t("Annuler", "Anile", "Cancel")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sessions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{session.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{session.description}</CardDescription>
                </div>
                <Badge 
                  variant={session.status === 'live' ? 'destructive' : session.status === 'scheduled' ? 'default' : 'secondary'}
                >
                  {session.status === 'live' ? t("En direct", "Ap viv", "Live") : 
                   session.status === 'scheduled' ? t("Programmé", "Pwograme", "Scheduled") : 
                   t("Terminé", "Fini", "Ended")}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(session.startTime)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {session.participants.length} {t("participants", "patisipan", "participants")}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {session.hostName}
                </div>
                
                {session.className && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {session.className}
                  </div>
                )}
                
                <div className="pt-4">
                  {session.status === 'live' ? (
                    <Button onClick={() => joinSession(session)} className="w-full bg-primary text-primary-foreground">
                      <Video className="h-4 w-4 mr-2" />
                      {t("Rejoindre", "Rantre", "Join")}
                    </Button>
                  ) : session.status === 'scheduled' ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("Démarrera bientôt", "Pral kòmanse byento", "Starting soon")}
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      {t("Session terminée", "Sesyon an fini", "Session ended")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t("Aucune session disponible", "Pa gen sesyon disponib", "No sessions available")}
          </h3>
          <p className="text-muted-foreground">
            {user?.role === 'teacher' 
              ? t("Créez votre première session de vidéoconférence", "Kreye premye sesyon videokonferans ou a", "Create your first video conference session")
              : t("Les sessions apparaîtront ici quand elles seront disponibles", "Sesyon yo ap parèt isit lè yo disponib", "Sessions will appear here when available")
            }
          </p>
        </div>
      )}
    </div>
  );
}