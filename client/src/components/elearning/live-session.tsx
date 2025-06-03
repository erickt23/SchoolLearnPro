import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  Users, 
  MessageSquare, 
  Hand, 
  Settings, 
  Share, 
  Record,
  MoreVertical,
  Send,
  Clock,
  Calendar,
  Volume2,
  VolumeX
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: 'instructor' | 'student';
  isVideoOn: boolean;
  isAudioOn: boolean;
  isHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system';
}

export default function LiveSession() {
  const { t } = useLanguage();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);

  const [participants] = useState<Participant[]>([
    {
      id: "1",
      name: "Prof. Jean Pierre",
      role: "instructor",
      isVideoOn: true,
      isAudioOn: true,
      isHandRaised: false
    },
    {
      id: "2",
      name: "Marie Claire",
      role: "student",
      isVideoOn: true,
      isAudioOn: false,
      isHandRaised: false
    },
    {
      id: "3",
      name: "Claude Michel",
      role: "student",
      isVideoOn: false,
      isAudioOn: true,
      isHandRaised: true
    },
    {
      id: "4",
      name: "Sophie Laurent",
      role: "student",
      isVideoOn: true,
      isAudioOn: true,
      isHandRaised: false
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Prof. Jean Pierre",
      message: t("Bienvenue dans le cours de mathématiques!", "Byenveni nan kou matematik la!", "Welcome to the mathematics class!"),
      timestamp: "14:00",
      type: "text"
    },
    {
      id: "2",
      sender: "Système",
      message: t("Marie Claire a rejoint la session", "Marie Claire rantre nan sesyon an", "Marie Claire joined the session"),
      timestamp: "14:01",
      type: "system"
    },
    {
      id: "3",
      sender: "Marie Claire",
      message: t("Bonjour professeur!", "Bonjou pwofesè!", "Hello professor!"),
      timestamp: "14:01",
      type: "text"
    }
  ]);

  // Timer for session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "Vous",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {t("Révision Mathématiques - Équations", "Revizyon Matematik - Ekwasyon yo", "Mathematics Review - Equations")}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(sessionTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{participants.length} {t("participants", "patisipan yo", "participants")}</span>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1 text-red-400">
                    <Record className="h-4 w-4 animate-pulse" />
                    <span>{t("Enregistrement", "Anrejistre", "Recording")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-white border-gray-600">
              <Share className="h-4 w-4 mr-2" />
              {t("Partager", "Pataje", "Share")}
            </Button>
            <Button variant="outline" size="sm" className="text-white border-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              {t("Paramètres", "Paramèt yo", "Settings")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Speaker Video */}
          <div className="flex-1 bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 mx-auto">
                  JP
                </div>
                <h3 className="text-xl font-semibold">Prof. Jean Pierre</h3>
                <Badge className="mt-2">{t("Présentateur", "Prezante", "Presenter")}</Badge>
              </div>
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 bg-gray-800 bg-opacity-80 rounded-lg px-4 py-2">
                <Button
                  size="sm"
                  variant={isAudioOn ? "default" : "destructive"}
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant={isVideoOn ? "default" : "destructive"}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant={isHandRaised ? "secondary" : "outline"}
                  onClick={() => setIsHandRaised(!isHandRaised)}
                  className="text-white border-gray-600"
                >
                  <Hand className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={() => setIsRecording(!isRecording)}
                  className="text-white border-gray-600"
                >
                  <Record className="h-4 w-4" />
                </Button>
                
                <Button size="sm" variant="destructive">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Participants Grid */}
          <div className="h-32 bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex gap-4 overflow-x-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex-shrink-0">
                  <div className="relative w-24 h-20 bg-gray-700 rounded-lg overflow-hidden">
                    {participant.isVideoOn ? (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <VideoOff className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status indicators */}
                    <div className="absolute bottom-1 left-1 flex gap-1">
                      {!participant.isAudioOn && (
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <MicOff className="h-2 w-2 text-white" />
                        </div>
                      )}
                      {participant.isHandRaised && (
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Hand className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {participant.role === 'instructor' && (
                      <div className="absolute top-1 right-1">
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {t("Prof", "Prof", "Prof")}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-1 text-center truncate w-24">
                    {participant.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-300" />
              <h3 className="font-semibold text-white">
                {t("Chat de la session", "Chat sesyon an", "Session Chat")}
              </h3>
              <Badge variant="outline" className="ml-auto">
                {chatMessages.length}
              </Badge>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`${message.type === 'system' ? 'text-center' : ''}`}>
                  {message.type === 'system' ? (
                    <div className="text-xs text-gray-400 bg-gray-700 rounded px-2 py-1 inline-block">
                      {message.message}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-400">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 bg-gray-700 rounded px-3 py-2">
                        {message.message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                placeholder={t("Tapez votre message...", "Tape mesaj ou a...", "Type your message...")}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}