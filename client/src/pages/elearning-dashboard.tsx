import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  AlertCircle,
  Upload,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Settings,
  FullscreenIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CourseContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'quiz' | 'assignment';
  duration?: number; // in minutes
  content: string; // URL for videos/PDFs, text content for text
  description: string;
  order: number;
  isCompleted?: boolean;
  completionDate?: Date;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: number; // in minutes
  totalLessons: number;
  enrolledStudents: number;
  rating: number;
  progress?: number; // percentage for students
  contents: CourseContent[];
  isEnrolled?: boolean;
  enrollmentDate?: Date;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  maxScore: number;
  submissionType: 'file' | 'text' | 'both';
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submissionDate?: Date;
  submissionContent?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  attempts: number;
  maxAttempts: number;
  bestScore?: number;
  lastAttemptDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  progress: number;
  lastAccessed: Date;
  timeSpent: number; // in minutes
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  assignments: {
    completed: number;
    total: number;
  };
  quizzes: {
    completed: number;
    total: number;
  };
}

export default function ELearningDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentContent, setCurrentContent] = useState<CourseContent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
        description: t("Cours complet d'algèbre et de géométrie", "Kou konplè aljèb ak jewometri", "Complete course in algebra and geometry"),
        instructor: "Prof. Jean Baptiste",
        thumbnail: "/api/placeholder/400/250",
        category: t("Mathématiques", "Matematik", "Mathematics"),
        level: 'intermediate',
        totalDuration: 480, // 8 hours
        totalLessons: 12,
        enrolledStudents: 45,
        rating: 4.8,
        progress: user?.role === 'student' ? 65 : undefined,
        isEnrolled: user?.role === 'student',
        contents: [
          {
            id: "1-1",
            title: t("Introduction à l'algèbre", "Entwodiksyon nan aljèb", "Introduction to Algebra"),
            type: 'video',
            duration: 45,
            content: "/videos/algebra-intro.mp4",
            description: t("Concepts de base", "Konsèp debaz yo", "Basic concepts"),
            order: 1,
            isCompleted: true,
            completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: "1-2",
            title: t("Équations linéaires", "Ekwasyon lineè yo", "Linear Equations"),
            type: 'text',
            content: "Contenu détaillé sur les équations linéaires...",
            description: t("Résolution d'équations", "Rezolisyon ekwasyon", "Solving equations"),
            order: 2,
            isCompleted: true
          },
          {
            id: "1-3",
            title: t("Exercices pratiques", "Egzèsis pratik yo", "Practice Exercises"),
            type: 'pdf',
            content: "/documents/algebra-exercises.pdf",
            description: t("Exercices à télécharger", "Egzèsis pou telechaje", "Downloadable exercises"),
            order: 3,
            isCompleted: false
          },
          {
            id: "1-4",
            title: t("Quiz - Algèbre de base", "Quiz - Aljèb debaz", "Quiz - Basic Algebra"),
            type: 'quiz',
            content: "quiz-1",
            description: t("Évaluation des connaissances", "Evalyasyon konesans", "Knowledge assessment"),
            order: 4,
            isCompleted: false
          }
        ]
      },
      {
        id: "2",
        title: t("Histoire d'Haïti", "Istwa Ayiti", "History of Haiti"),
        description: t("De l'indépendance à nos jours", "Depi endepandans nan jouk kounye a", "From independence to present day"),
        instructor: "Prof. Marie Claire",
        thumbnail: "/api/placeholder/400/250",
        category: t("Histoire", "Istwa", "History"),
        level: 'beginner',
        totalDuration: 360, // 6 hours
        totalLessons: 8,
        enrolledStudents: 67,
        rating: 4.9,
        progress: user?.role === 'student' ? 30 : undefined,
        isEnrolled: user?.role === 'student',
        contents: [
          {
            id: "2-1",
            title: t("La révolution haïtienne", "Revolisyon ayisyen an", "The Haitian Revolution"),
            type: 'video',
            duration: 60,
            content: "/videos/haiti-revolution.mp4",
            description: t("Les événements clés", "Evenman kle yo", "Key events"),
            order: 1,
            isCompleted: false
          }
        ]
      }
    ];

    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: t("Devoir d'algèbre", "Devoir aljèb", "Algebra Assignment"),
        description: t("Résoudre 10 équations linéaires", "Rezoud 10 ekwasyon lineè", "Solve 10 linear equations"),
        courseId: "1",
        courseName: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxScore: 100,
        submissionType: 'file',
        status: 'pending'
      },
      {
        id: "2",
        title: t("Essai sur l'indépendance", "Esè sou endepandans", "Essay on Independence"),
        description: t("Analyse des causes de la révolution", "Analiz kòz revolisyon an", "Analysis of revolution causes"),
        courseId: "2",
        courseName: t("Histoire d'Haïti", "Istwa Ayiti", "History of Haiti"),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxScore: 100,
        submissionType: 'text',
        status: 'submitted',
        score: 85,
        feedback: t("Très bon travail", "Trè bon travay", "Very good work"),
        submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockQuizzes: Quiz[] = [
      {
        id: "quiz-1",
        title: t("Quiz - Algèbre de base", "Quiz - Aljèb debaz", "Quiz - Basic Algebra"),
        description: t("Test sur les concepts fondamentaux", "Tès sou konsèp fondamantal yo", "Test on fundamental concepts"),
        courseId: "1",
        courseName: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
        timeLimit: 30,
        attempts: 1,
        maxAttempts: 3,
        bestScore: 78,
        status: 'completed',
        questions: [
          {
            id: "q1",
            question: t("Quelle est la solution de 2x + 5 = 15?", "Ki solisyon 2x + 5 = 15?", "What is the solution to 2x + 5 = 15?"),
            type: 'multiple_choice',
            options: ["x = 5", "x = 10", "x = 15", "x = 20"],
            correctAnswer: 0,
            explanation: t("2x = 15 - 5 = 10, donc x = 5", "2x = 15 - 5 = 10, donk x = 5", "2x = 15 - 5 = 10, so x = 5"),
            points: 10
          }
        ]
      }
    ];

    const mockProgress: StudentProgress[] = user?.role === 'teacher' ? [
      {
        studentId: "1",
        studentName: "Jean Pierre",
        courseId: "1",
        courseName: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
        progress: 65,
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        timeSpent: 180,
        completedLessons: 8,
        totalLessons: 12,
        averageScore: 82,
        assignments: { completed: 2, total: 3 },
        quizzes: { completed: 3, total: 4 }
      },
      {
        studentId: "2",
        studentName: "Marie Rose",
        courseId: "1",
        courseName: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
        progress: 45,
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSpent: 120,
        completedLessons: 5,
        totalLessons: 12,
        averageScore: 75,
        assignments: { completed: 1, total: 3 },
        quizzes: { completed: 2, total: 4 }
      }
    ] : [];

    setCourses(mockCourses);
    setAssignments(mockAssignments);
    setQuizzes(mockQuizzes);
    setStudentProgress(mockProgress);
  }, [user?.role, t]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const enrollInCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, enrollmentDate: new Date(), progress: 0 }
        : course
    ));
    
    toast({
      title: t("Inscription réussie", "Enskripsyon reyisi", "Enrollment successful"),
      description: t("Vous êtes maintenant inscrit au cours", "Ou kounye a enskriwi nan kou a", "You are now enrolled in the course"),
    });
  };

  const markContentAsCompleted = (courseId: string, contentId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedContents = course.contents.map(content =>
          content.id === contentId 
            ? { ...content, isCompleted: true, completionDate: new Date() }
            : content
        );
        
        const completedCount = updatedContents.filter(c => c.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedContents.length) * 100);
        
        return { ...course, contents: updatedContents, progress: newProgress };
      }
      return course;
    }));

    toast({
      title: t("Contenu terminé", "Kontni fini", "Content completed"),
      description: t("Votre progression a été mise à jour", "Pwogrè ou a mete ajou", "Your progress has been updated"),
    });
  };

  const submitAssignment = (assignmentId: string, content: string) => {
    setAssignments(prev => prev.map(assignment =>
      assignment.id === assignmentId
        ? { 
            ...assignment, 
            status: 'submitted' as const,
            submissionContent: content,
            submissionDate: new Date()
          }
        : assignment
    ));

    toast({
      title: t("Devoir soumis", "Devoir soumèt", "Assignment submitted"),
      description: t("Votre devoir a été envoyé pour correction", "Devoir ou an voye pou koreksyon", "Your assignment has been sent for grading"),
    });
  };

  // Filter courses based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(courses.map(course => course.category)));

  if (selectedCourse && currentContent) {
    return <CourseContentViewer 
      course={selectedCourse}
      content={currentContent}
      onBack={() => {
        setCurrentContent(null);
        setSelectedCourse(null);
      }}
      onComplete={(contentId) => markContentAsCompleted(selectedCourse.id, contentId)}
    />;
  }

  if (selectedCourse) {
    return <CourseDetailView 
      course={selectedCourse}
      onBack={() => setSelectedCourse(null)}
      onContentSelect={setCurrentContent}
      onEnroll={() => enrollInCourse(selectedCourse.id)}
    />;
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("Plateforme E-Learning", "Platfòm E-Learning", "E-Learning Platform")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'student' 
              ? t("Continuez votre apprentissage", "Kontinye aprann ou an", "Continue your learning journey")
              : t("Gérez vos cours et suivez les progrès", "Jere kou ou yo ak swiv pwogrè yo", "Manage your courses and track progress")
            }
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <Button className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            {t("Créer un cours", "Kreye yon kou", "Create Course")}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">{t("Cours", "Kou yo", "Courses")}</TabsTrigger>
          <TabsTrigger value="assignments">{t("Devoirs", "Devoir yo", "Assignments")}</TabsTrigger>
          <TabsTrigger value="quizzes">{t("Quiz", "Quiz yo", "Quizzes")}</TabsTrigger>
          {user?.role === 'teacher' && (
            <TabsTrigger value="progress">{t("Progrès", "Pwogrè", "Progress")}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("Rechercher un cours...", "Chèche yon kou...", "Search for a course...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("Catégorie", "Kategori", "Category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Toutes catégories", "Tout kategori yo", "All categories")}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCourse(course)}>
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-primary" />
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-2 mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                    <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}>
                      {course.level === 'beginner' ? t("Débutant", "Kòmanse", "Beginner") :
                       course.level === 'intermediate' ? t("Intermédiaire", "Entèmedyè", "Intermediate") :
                       t("Avancé", "Avanse", "Advanced")}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.instructor}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {course.rating}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(course.totalDuration)}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {course.totalLessons} {t("leçons", "leson yo", "lessons")}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrolledStudents} {t("étudiants", "elèv yo", "students")}
                      </div>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    {course.isEnrolled && course.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("Progression", "Pwogrè", "Progress")}</span>
                          <span className="font-medium text-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {course.isEnrolled ? (
                        <Button className="w-full" variant="default">
                          {t("Continuer", "Kontinye", "Continue")}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollInCourse(course.id);
                          }}
                        >
                          {t("S'inscrire", "Enskri", "Enroll")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground">{assignment.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{assignment.courseName}</CardDescription>
                    </div>
                    <Badge 
                      variant={assignment.status === 'pending' ? 'destructive' : 
                              assignment.status === 'submitted' ? 'secondary' : 'default'}
                    >
                      {assignment.status === 'pending' ? t("En attente", "K ap tann", "Pending") :
                       assignment.status === 'submitted' ? t("Soumis", "Soumèt", "Submitted") :
                       t("Noté", "Note", "Graded")}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{assignment.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t("Date limite", "Dat limit", "Due date")}: </span>
                        <span className="text-foreground">{assignment.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("Note max", "Nòt maksimòm", "Max score")}: </span>
                        <span className="text-foreground">{assignment.maxScore}</span>
                      </div>
                      {assignment.score && (
                        <>
                          <div>
                            <span className="text-muted-foreground">{t("Votre note", "Nòt ou", "Your score")}: </span>
                            <span className="text-foreground font-semibold">{assignment.score}/{assignment.maxScore}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t("Soumis le", "Soumèt nan", "Submitted")}: </span>
                            <span className="text-foreground">{assignment.submissionDate?.toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {assignment.feedback && (
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">{t("Commentaires", "Kòmentè yo", "Feedback")}</h4>
                        <p className="text-muted-foreground text-sm">{assignment.feedback}</p>
                      </div>
                    )}
                    
                    {assignment.status === 'pending' && (
                      <AssignmentSubmissionDialog 
                        assignment={assignment}
                        onSubmit={(content) => submitAssignment(assignment.id, content)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground">{quiz.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{quiz.courseName}</CardDescription>
                    </div>
                    <Badge 
                      variant={quiz.status === 'not_started' ? 'outline' : 
                              quiz.status === 'in_progress' ? 'secondary' : 'default'}
                    >
                      {quiz.status === 'not_started' ? t("Non commencé", "Pa kòmanse", "Not started") :
                       quiz.status === 'in_progress' ? t("En cours", "K ap fèt", "In progress") :
                       t("Terminé", "Fini", "Completed")}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{quiz.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t("Temps limite", "Tan limit", "Time limit")}: </span>
                        <span className="text-foreground">{quiz.timeLimit} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("Questions", "Kesyon yo", "Questions")}: </span>
                        <span className="text-foreground">{quiz.questions.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("Tentatives", "Tantativ yo", "Attempts")}: </span>
                        <span className="text-foreground">{quiz.attempts}/{quiz.maxAttempts}</span>
                      </div>
                      {quiz.bestScore && (
                        <div>
                          <span className="text-muted-foreground">{t("Meilleur score", "Pi bon skò", "Best score")}: </span>
                          <span className="text-foreground font-semibold">{quiz.bestScore}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      {quiz.status === 'completed' ? (
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          {t("Voir les résultats", "Gade rezilta yo", "View Results")}
                        </Button>
                      ) : quiz.attempts < quiz.maxAttempts ? (
                        <Button className="w-full">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          {quiz.status === 'not_started' ? t("Commencer", "Kòmanse", "Start") : t("Continuer", "Kontinye", "Continue")}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          {t("Aucune tentative restante", "Pa gen tantativ ki rete", "No attempts remaining")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {user?.role === 'teacher' && (
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-4">
              {studentProgress.map((progress) => (
                <Card key={`${progress.studentId}-${progress.courseId}`} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{progress.studentName}</CardTitle>
                        <CardDescription className="text-muted-foreground">{progress.courseName}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {progress.progress}% {t("terminé", "fini", "complete")}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("Progression du cours", "Pwogrè kou a", "Course Progress")}</span>
                          <span className="font-medium text-foreground">{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t("Temps passé", "Tan pase", "Time spent")}</span>
                          <p className="font-medium text-foreground">{formatDuration(progress.timeSpent)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("Dernière visite", "Dènye vizit", "Last accessed")}</span>
                          <p className="font-medium text-foreground">{progress.lastAccessed.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("Leçons", "Leson yo", "Lessons")}</span>
                          <p className="font-medium text-foreground">{progress.completedLessons}/{progress.totalLessons}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("Score moyen", "Skò mwayèn", "Average score")}</span>
                          <p className="font-medium text-foreground">{progress.averageScore}%</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("Devoirs", "Devoir yo", "Assignments")}</span>
                            <Badge variant="outline">
                              {progress.assignments.completed}/{progress.assignments.total}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("Quiz", "Quiz yo", "Quizzes")}</span>
                            <Badge variant="outline">
                              {progress.quizzes.completed}/{progress.quizzes.total}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Component for assignment submission
function AssignmentSubmissionDialog({ assignment, onSubmit }: { 
  assignment: Assignment; 
  onSubmit: (content: string) => void;
}) {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setIsOpen(false);
      setContent("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          {t("Soumettre le devoir", "Soumèt devoir la", "Submit Assignment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{t("Soumettre le devoir", "Soumèt devoir la", "Submit Assignment")}</DialogTitle>
          <DialogDescription>
            {assignment.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="submission">{t("Votre réponse", "Repons ou", "Your response")}</Label>
            <Textarea
              id="submission"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("Tapez votre réponse ici...", "Ekri repons ou isit...", "Type your response here...")}
              rows={6}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleSubmit} className="flex-1" disabled={!content.trim()}>
              {t("Soumettre", "Soumèt", "Submit")}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("Annuler", "Anile", "Cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Course Detail View Component
function CourseDetailView({ course, onBack, onContentSelect, onEnroll }: {
  course: Course;
  onBack: () => void;
  onContentSelect: (content: CourseContent) => void;
  onEnroll: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
          {t("Retour", "Tounen", "Back")}
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Contenu du cours", "Kontni kou a", "Course Content")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.contents.map((content, index) => (
                  <div 
                    key={content.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => onContentSelect(content)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {content.type === 'video' && <Video className="h-4 w-4 text-primary" />}
                        {content.type === 'text' && <FileText className="h-4 w-4 text-primary" />}
                        {content.type === 'pdf' && <Download className="h-4 w-4 text-primary" />}
                        {content.type === 'quiz' && <Target className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">{content.description}</p>
                        {content.duration && (
                          <p className="text-xs text-muted-foreground">{content.duration} min</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {content.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Informations", "Enfòmasyon", "Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground">{t("Instructeur", "Enstriktè", "Instructor")}</span>
                <p className="font-medium text-foreground">{course.instructor}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("Durée totale", "Dire total", "Total duration")}</span>
                <p className="font-medium text-foreground">{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}min</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("Niveau", "Nivo", "Level")}</span>
                <p className="font-medium text-foreground capitalize">{course.level}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("Étudiants inscrits", "Elèv enskriwi yo", "Enrolled students")}</span>
                <p className="font-medium text-foreground">{course.enrolledStudents}</p>
              </div>
              
              {course.progress !== undefined && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">{t("Votre progression", "Pwogrè ou", "Your progress")}</span>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-sm font-medium text-foreground">{course.progress}%</p>
                </div>
              )}
              
              {!course.isEnrolled && (
                <Button onClick={onEnroll} className="w-full">
                  {t("S'inscrire au cours", "Enskri nan kou a", "Enroll in Course")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Course Content Viewer Component
function CourseContentViewer({ course, content, onBack, onComplete }: {
  course: Course;
  content: CourseContent;
  onBack: () => void;
  onComplete: (contentId: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            {t("Retour", "Tounen", "Back")}
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{content.title}</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
        
        {!content.isCompleted && (
          <Button onClick={() => onComplete(content.id)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {t("Marquer comme terminé", "Make kòm fini", "Mark as Completed")}
          </Button>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {content.type === 'video' && (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <PlayCircle className="h-16 w-16 mx-auto mb-4" />
                <p>{t("Lecteur vidéo", "Lektè videyo", "Video Player")}</p>
                <p className="text-sm opacity-75">{content.title}</p>
              </div>
            </div>
          )}
          
          {content.type === 'text' && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h2>{content.title}</h2>
              <p>{content.content}</p>
            </div>
          )}
          
          {content.type === 'pdf' && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">{content.title}</h3>
              <p className="text-muted-foreground mb-4">{content.description}</p>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                {t("Télécharger le PDF", "Telechaje PDF la", "Download PDF")}
              </Button>
            </div>
          )}
          
          {content.type === 'quiz' && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium text-foreground mb-2">{content.title}</h3>
              <p className="text-muted-foreground mb-4">{content.description}</p>
              <Button>
                <PlayCircle className="h-4 w-4 mr-2" />
                {t("Commencer le quiz", "Kòmanse quiz la", "Start Quiz")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}