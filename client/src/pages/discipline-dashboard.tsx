import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  GraduationCap,
  BookOpen,
  TrendingUp,
  BarChart3,
  Target,
  Flag,
  Shield,
  UserCheck,
  UserX,
  TimerIcon,
  MessageCircle,
  Bell,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivalTime?: string;
  departureTime?: string;
  reason?: string;
  notes?: string;
  markedBy: string;
  parentNotified: boolean;
}

interface Infraction {
  id: string;
  studentId: string;
  studentName: string;
  className?: string;
  type: 'behavioral' | 'academic' | 'uniform' | 'tardiness' | 'other';
  severity: 'minor' | 'major' | 'severe';
  title: string;
  description: string;
  location?: string;
  dateOccurred: Date;
  reportedBy: string;
  witnesses?: string;
  actionTaken?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  parentContacted: boolean;
  parentContactDate?: Date;
  parentContactMethod?: string;
  resolution?: string;
  status: 'open' | 'resolved' | 'escalated';
}

interface DisciplineAction {
  id: string;
  infractionId: string;
  actionType: 'warning' | 'detention' | 'suspension' | 'expulsion' | 'counseling' | 'community_service';
  duration?: string;
  startDate?: Date;
  endDate?: Date;
  assignedBy: string;
  description?: string;
  completed: boolean;
  completedDate?: Date;
  notes?: string;
}

interface Student {
  id: string;
  name: string;
  className: string;
  parentContact: string;
  totalInfractions: number;
  attendanceRate: number;
  lastIncident?: Date;
}

export default function DisciplineDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [disciplineActions, setDisciplineActions] = useState<DisciplineAction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for demonstration
  useEffect(() => {
    const mockAttendance: AttendanceRecord[] = [
      {
        id: "1",
        studentId: "1",
        studentName: "Jean Pierre",
        className: "Philo",
        date: new Date(),
        status: 'late',
        arrivalTime: "08:15",
        reason: "Transport en retard",
        markedBy: "Prof. Marie",
        parentNotified: false,
        notes: "Troisième retard cette semaine"
      },
      {
        id: "2",
        studentId: "2",
        studentName: "Marie Rose",
        className: "Rheto",
        date: new Date(),
        status: 'absent',
        reason: "Maladie",
        markedBy: "Prof. Jean",
        parentNotified: true,
        notes: "Certificat médical fourni"
      },
      {
        id: "3",
        studentId: "3",
        studentName: "Paul Michel",
        className: "Seconde",
        date: new Date(),
        status: 'present',
        markedBy: "Prof. Claire",
        parentNotified: false
      }
    ];

    const mockInfractions: Infraction[] = [
      {
        id: "1",
        studentId: "1",
        studentName: "Jean Pierre",
        className: "Philo",
        type: 'behavioral',
        severity: 'minor',
        title: "Perturbation en classe",
        description: "L'élève a parlé de manière répétée sans autorisation pendant le cours de mathématiques",
        location: "Salle 203",
        dateOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        reportedBy: "Prof. Dupont",
        witnesses: "Élèves de la classe",
        actionTaken: "Avertissement verbal",
        followUpRequired: false,
        parentContacted: true,
        parentContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        parentContactMethod: "Téléphone",
        status: 'resolved'
      },
      {
        id: "2",
        studentId: "2",
        studentName: "Marie Rose",
        className: "Rheto",
        type: 'uniform',
        severity: 'minor',
        title: "Uniforme non conforme",
        description: "Chaussures non réglementaires",
        location: "Cour de récréation",
        dateOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reportedBy: "Surveillant Martin",
        followUpRequired: false,
        parentContacted: false,
        status: 'open'
      },
      {
        id: "3",
        studentId: "4",
        studentName: "Luc Toussaint",
        className: "Première",
        type: 'behavioral',
        severity: 'major',
        title: "Comportement agressif",
        description: "Dispute physique avec un autre élève",
        location: "Cantine",
        dateOccurred: new Date(),
        reportedBy: "Surveillant Julie",
        witnesses: "Plusieurs élèves",
        followUpRequired: true,
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        parentContacted: false,
        status: 'escalated'
      }
    ];

    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Jean Pierre",
        className: "Philo",
        parentContact: "8194567890",
        totalInfractions: 3,
        attendanceRate: 92,
        lastIncident: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: "2",
        name: "Marie Rose",
        className: "Rheto",
        parentContact: "8195678901",
        totalInfractions: 1,
        attendanceRate: 98,
        lastIncident: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: "3",
        name: "Paul Michel",
        className: "Seconde",
        parentContact: "8196789012",
        totalInfractions: 0,
        attendanceRate: 100
      },
      {
        id: "4",
        name: "Luc Toussaint",
        className: "Première",
        parentContact: "8197890123",
        totalInfractions: 2,
        attendanceRate: 85,
        lastIncident: new Date()
      }
    ];

    setAttendanceRecords(mockAttendance);
    setInfractions(mockInfractions);
    setStudents(mockStudents);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      case 'excused': return 'bg-blue-500';
      case 'open': return 'bg-red-500';
      case 'resolved': return 'bg-green-500';
      case 'escalated': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-500';
      case 'major': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredInfractions = infractions.filter(infraction => {
    const matchesSearch = infraction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infraction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || infraction.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || infraction.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const filteredAttendance = attendanceRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date.toDateString() === new Date(selectedDate).toDateString();
    return matchesSearch && matchesDate;
  });

  // Statistics calculations
  const todayAttendance = attendanceRecords.filter(record => 
    record.date.toDateString() === new Date().toDateString()
  );
  const presentCount = todayAttendance.filter(record => record.status === 'present').length;
  const absentCount = todayAttendance.filter(record => record.status === 'absent').length;
  const lateCount = todayAttendance.filter(record => record.status === 'late').length;
  
  const openInfractions = infractions.filter(inf => inf.status === 'open').length;
  const escalatedInfractions = infractions.filter(inf => inf.status === 'escalated').length;
  const totalInfractions = infractions.length;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("Gestion Disciplinaire", "Jesyon Disiplin", "Discipline Management")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("Suivi des présences et infractions", "Swiv prezans ak enfraksyon yo", "Attendance and infractions tracking")}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            {t("Nouvelle infraction", "Nouvo enfraksyon", "New Infraction")}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("Présences aujourd'hui", "Prezans jodi a", "Today's Attendance")}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {absentCount} {t("absents", "absan", "absent")}, {lateCount} {t("retards", "an reta", "late")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("Infractions ouvertes", "Enfraksyon ouvè", "Open Infractions")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{openInfractions}</div>
            <p className="text-xs text-muted-foreground">
              {escalatedInfractions} {t("escaladées", "eskale", "escalated")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("Total infractions", "Total enfraksyon", "Total Infractions")}
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalInfractions}</div>
            <p className="text-xs text-muted-foreground">
              {t("Ce mois", "Mwa sa a", "This month")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("Élèves à risque", "Elèv nan danje", "At-Risk Students")}
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {students.filter(s => s.totalInfractions >= 3 || s.attendanceRate < 90).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Nécessitent attention", "Bezwen atansyon", "Need attention")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("Aperçu", "Apèsi", "Overview")}</TabsTrigger>
          <TabsTrigger value="attendance">{t("Présences", "Prezans", "Attendance")}</TabsTrigger>
          <TabsTrigger value="infractions">{t("Infractions", "Enfraksyon", "Infractions")}</TabsTrigger>
          <TabsTrigger value="students">{t("Élèves", "Elèv yo", "Students")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Infractions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t("Infractions récentes", "Enfraksyon resan yo", "Recent Infractions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {infractions.slice(0, 5).map((infraction) => (
                    <div key={infraction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{infraction.studentName}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-white ${getSeverityColor(infraction.severity)}`}
                          >
                            {infraction.severity}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-white ${getStatusColor(infraction.status)}`}
                          >
                            {infraction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{infraction.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {infraction.dateOccurred.toLocaleDateString()} - {infraction.location}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t("Résumé présences", "Rezime prezans", "Attendance Summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAttendance.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{record.studentName}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-white ${getStatusColor(record.status)}`}
                          >
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.className}</p>
                        {record.arrivalTime && (
                          <p className="text-xs text-muted-foreground">
                            {t("Arrivée", "Rive", "Arrival")}: {record.arrivalTime}
                          </p>
                        )}
                        {record.reason && (
                          <p className="text-xs text-muted-foreground">
                            {record.reason}
                          </p>
                        )}
                      </div>
                      {!record.parentNotified && record.status !== 'present' && (
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("Rechercher un élève...", "Chèche yon elèv...", "Search student...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
          </div>

          {/* Attendance Records */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {t("Registre des présences", "Rejis prezans", "Attendance Records")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{record.studentName}</span>
                            <Badge variant="outline">{record.className}</Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-white ${getStatusColor(record.status)}`}
                            >
                              {record.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {record.arrivalTime && (
                              <span className="mr-4">
                                {t("Arrivée", "Rive", "Arrival")}: {record.arrivalTime}
                              </span>
                            )}
                            {record.departureTime && (
                              <span className="mr-4">
                                {t("Départ", "Ale", "Departure")}: {record.departureTime}
                              </span>
                            )}
                            <span>{t("Par", "Pa", "By")}: {record.markedBy}</span>
                          </div>
                          {record.reason && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <strong>{t("Raison", "Rezon", "Reason")}:</strong> {record.reason}
                            </p>
                          )}
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <strong>{t("Notes", "Nòt yo", "Notes")}:</strong> {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!record.parentNotified && record.status !== 'present' && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {t("Contacter parent", "Kontakte paran", "Contact Parent")}
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infractions" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("Rechercher infractions...", "Chèche enfraksyon...", "Search infractions...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("Statut", "Estati", "Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Tous", "Tout", "All")}</SelectItem>
                <SelectItem value="open">{t("Ouvertes", "Ouvè", "Open")}</SelectItem>
                <SelectItem value="resolved">{t("Résolues", "Rezoud", "Resolved")}</SelectItem>
                <SelectItem value="escalated">{t("Escaladées", "Eskale", "Escalated")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("Gravité", "Gravite", "Severity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Toutes", "Tout", "All")}</SelectItem>
                <SelectItem value="minor">{t("Mineur", "Minè", "Minor")}</SelectItem>
                <SelectItem value="major">{t("Majeur", "Majè", "Major")}</SelectItem>
                <SelectItem value="severe">{t("Grave", "Grav", "Severe")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Infractions List */}
          <div className="space-y-4">
            {filteredInfractions.map((infraction) => (
              <Card key={infraction.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <CardTitle className="text-lg text-foreground">{infraction.title}</CardTitle>
                        <CardDescription>
                          {infraction.studentName} - {infraction.className} - {infraction.dateOccurred.toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-white ${getSeverityColor(infraction.severity)}`}
                      >
                        {infraction.severity}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-white ${getStatusColor(infraction.status)}`}
                      >
                        {infraction.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <strong>{t("Type", "Tip", "Type")}:</strong> {infraction.type} | 
                        <strong className="ml-2">{t("Lieu", "Kote", "Location")}:</strong> {infraction.location} | 
                        <strong className="ml-2">{t("Rapporté par", "Rapòte pa", "Reported by")}:</strong> {infraction.reportedBy}
                      </p>
                      <p className="text-foreground mt-2">{infraction.description}</p>
                    </div>
                    
                    {infraction.witnesses && (
                      <div>
                        <span className="text-sm font-medium text-foreground">{t("Témoins", "Temwen yo", "Witnesses")}:</span>
                        <p className="text-sm text-muted-foreground">{infraction.witnesses}</p>
                      </div>
                    )}
                    
                    {infraction.actionTaken && (
                      <div>
                        <span className="text-sm font-medium text-foreground">{t("Action prise", "Aksyon ki pran", "Action taken")}:</span>
                        <p className="text-sm text-muted-foreground">{infraction.actionTaken}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {infraction.parentContacted ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-muted-foreground">{t("Parent contacté", "Paran kontakte", "Parent contacted")}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-muted-foreground">{t("Parent non contacté", "Paran pa kontakte", "Parent not contacted")}</span>
                            </>
                          )}
                        </div>
                        {infraction.followUpRequired && (
                          <div className="flex items-center space-x-1">
                            <Flag className="h-4 w-4 text-orange-600" />
                            <span className="text-muted-foreground">{t("Suivi requis", "Swiv obligatwa", "Follow-up required")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!infraction.parentContacted && (
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            {t("Contacter", "Kontakte", "Contact")}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t("Détails", "Detay yo", "Details")}
                        </Button>
                        {infraction.status === 'open' && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t("Résoudre", "Rezoud", "Resolve")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Students at Risk */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Élèves sous surveillance", "Elèv yo k ap sivèy", "Students Under Watch")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{student.name}</span>
                            <Badge variant="outline">{student.className}</Badge>
                            {student.totalInfractions >= 3 && (
                              <Badge variant="destructive">{t("À risque", "Nan danje", "At Risk")}</Badge>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            <span className="mr-4">
                              {t("Infractions", "Enfraksyon", "Infractions")}: {student.totalInfractions}
                            </span>
                            <span className="mr-4">
                              {t("Assiduité", "Asiduité", "Attendance")}: {student.attendanceRate}%
                            </span>
                            <span>{t("Contact", "Kontak", "Contact")}: {student.parentContact}</span>
                          </div>
                          {student.lastIncident && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("Dernier incident", "Dènye ensidan", "Last incident")}: {student.lastIncident.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {t("Appeler", "Rele", "Call")}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {t("Dossier", "Dosye", "Profile")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}