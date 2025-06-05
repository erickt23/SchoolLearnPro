import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Target,
  AlertCircle,
  Timer,
  Flag,
  RotateCcw,
  BookOpen,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
  userAnswer?: string | number;
  isCorrect?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  attempts: number;
  maxAttempts: number;
  bestScore?: number;
  lastAttemptDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface QuizResult {
  score: number;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  completedAt: Date;
}

export default function InteractiveQuiz() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Mock quiz data
  useEffect(() => {
    const mockQuiz: Quiz = {
      id: "quiz-math-1",
      title: t("Quiz - Mathématiques de base", "Quiz - Matematik debaz", "Quiz - Basic Mathematics"),
      description: t("Évaluation des concepts fondamentaux d'algèbre", "Evalyasyon konsèp fondamantal aljèb yo", "Assessment of fundamental algebra concepts"),
      courseId: "math-course-1",
      courseName: t("Mathématiques Avancées", "Matematik Avanse", "Advanced Mathematics"),
      timeLimit: 30,
      passingScore: 70,
      attempts: 0,
      maxAttempts: 3,
      status: 'not_started',
      questions: [
        {
          id: "q1",
          question: t("Quelle est la solution de l'équation 2x + 8 = 20?", "Ki solisyon ekwasyon 2x + 8 = 20?", "What is the solution to the equation 2x + 8 = 20?"),
          type: 'multiple_choice',
          options: ["x = 4", "x = 6", "x = 8", "x = 10"],
          correctAnswer: 1,
          explanation: t("2x = 20 - 8 = 12, donc x = 6", "2x = 20 - 8 = 12, donk x = 6", "2x = 20 - 8 = 12, so x = 6"),
          points: 10
        },
        {
          id: "q2",
          question: t("Si y = 3x + 5 et x = 4, quelle est la valeur de y?", "Si y = 3x + 5 ak x = 4, ki valè y?", "If y = 3x + 5 and x = 4, what is the value of y?"),
          type: 'multiple_choice',
          options: ["y = 12", "y = 15", "y = 17", "y = 20"],
          correctAnswer: 2,
          explanation: t("y = 3(4) + 5 = 12 + 5 = 17", "y = 3(4) + 5 = 12 + 5 = 17", "y = 3(4) + 5 = 12 + 5 = 17"),
          points: 10
        },
        {
          id: "q3",
          question: t("L'équation x² - 9 = 0 a-t-elle des solutions réelles?", "Èske ekwasyon x² - 9 = 0 gen solisyon reyèl yo?", "Does the equation x² - 9 = 0 have real solutions?"),
          type: 'true_false',
          options: [t("Vrai", "Vre", "True"), t("Faux", "Fo", "False")],
          correctAnswer: 0,
          explanation: t("x² = 9, donc x = ±3. Il y a deux solutions réelles.", "x² = 9, donk x = ±3. Gen de solisyon reyèl.", "x² = 9, so x = ±3. There are two real solutions."),
          points: 15
        },
        {
          id: "q4",
          question: t("Expliquez brièvement la différence entre une équation et une inéquation.", "Eksplike rapidman diferans ant yon ekwasyon ak yon inekwasyon.", "Briefly explain the difference between an equation and an inequality."),
          type: 'text',
          correctAnswer: t("Une équation établit une égalité, une inéquation compare des expressions", "Yon ekwasyon etabli yon egalite, yon inekwasyon konpare ekspresyon yo", "An equation establishes equality, an inequality compares expressions"),
          points: 15
        },
        {
          id: "q5",
          question: t("Quelle est la forme générale d'une équation linéaire?", "Ki fòm jeneral yon ekwasyon lineè?", "What is the general form of a linear equation?"),
          type: 'multiple_choice',
          options: ["ax + b = 0", "ax² + bx + c = 0", "y = mx + b", t("Toutes les réponses", "Tout repons yo", "All answers")],
          correctAnswer: 0,
          explanation: t("La forme générale est ax + b = 0", "Fòm jeneral la se ax + b = 0", "The general form is ax + b = 0"),
          points: 10
        }
      ]
    };

    setQuiz(mockQuiz);
  }, [t]);

  // Timer countdown
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, timeRemaining]);

  const startQuiz = () => {
    if (!quiz) return;
    
    setQuizStarted(true);
    setStartTime(new Date());
    setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlaggedQuestions(new Set());
    
    toast({
      title: t("Quiz démarré", "Quiz kòmanse", "Quiz started"),
      description: t("Bonne chance!", "Bon chans!", "Good luck!"),
    });
  };

  const submitQuiz = () => {
    if (!quiz || !startTime) return;

    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // in minutes

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const gradedQuestions = quiz.questions.map(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer !== undefined && userAnswer.toString() === question.correctAnswer.toString();
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }

      return {
        ...question,
        userAnswer,
        isCorrect
      };
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    const quizResult: QuizResult = {
      score: earnedPoints,
      percentage,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      passed,
      completedAt: endTime
    };

    setResult(quizResult);
    setQuiz(prev => prev ? {
      ...prev,
      questions: gradedQuestions,
      attempts: prev.attempts + 1,
      bestScore: Math.max(prev.bestScore || 0, percentage),
      status: 'completed',
      lastAttemptDate: endTime
    } : null);

    setQuizCompleted(true);
    setShowResults(true);

    toast({
      title: passed ? t("Félicitations!", "Felisitasyon!", "Congratulations!") : t("Quiz terminé", "Quiz fini", "Quiz completed"),
      description: passed ? 
        t("Vous avez réussi le quiz!", "Ou reyisi nan quiz la!", "You passed the quiz!") :
        t("Continuez à étudier", "Kontinye etidye", "Keep studying"),
      variant: passed ? "default" : "destructive"
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = timeRemaining / (quiz?.timeLimit || 1) / 60;
    if (percentage > 0.5) return "text-green-600";
    if (percentage > 0.2) return "text-yellow-600";
    return "text-red-600";
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowResults(false);
    setResult(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setStartTime(null);
    setFlaggedQuestions(new Set());
  };

  if (!quiz) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">{t("Quiz non trouvé", "Quiz pa jwenn", "Quiz not found")}</h2>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && result) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                {result.passed ? (
                  <Trophy className="h-16 w-16 text-yellow-500" />
                ) : (
                  <Target className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              <CardTitle className="text-2xl text-foreground">
                {result.passed ? 
                  t("Félicitations!", "Felisitasyon!", "Congratulations!") :
                  t("Quiz terminé", "Quiz fini", "Quiz completed")
                }
              </CardTitle>
              <CardDescription>
                {quiz.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">{result.percentage}%</div>
                  <div className="text-sm text-muted-foreground">{t("Score", "Skò", "Score")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">{t("Correct", "Kòrèk", "Correct")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{result.timeSpent}min</div>
                  <div className="text-sm text-muted-foreground">{t("Temps", "Tan", "Time")}</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.passed ? t("Réussi", "Reyisi", "Passed") : t("Échoué", "Echwe", "Failed")}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("Statut", "Estati", "Status")}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("Score requis", "Skò ki mande", "Required score")}: {quiz.passingScore}%</span>
                  <span className="text-foreground">{result.percentage}%</span>
                </div>
                <Progress value={result.percentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t("Révision des questions", "Revizyon kesyon yo", "Question Review")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-foreground flex items-center">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs mr-2">
                          {index + 1}
                        </span>
                        {question.question}
                      </h4>
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    
                    {question.type === 'multiple_choice' || question.type === 'true_false' ? (
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className={`p-2 rounded border ${
                            optionIndex === question.correctAnswer ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                            optionIndex === question.userAnswer ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                            'bg-muted border-border'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-foreground">{option}</span>
                              <div className="flex items-center space-x-2">
                                {optionIndex === question.correctAnswer && (
                                  <Badge variant="default" className="text-xs">
                                    {t("Correct", "Kòrèk", "Correct")}
                                  </Badge>
                                )}
                                {optionIndex === question.userAnswer && optionIndex !== question.correctAnswer && (
                                  <Badge variant="destructive" className="text-xs">
                                    {t("Votre réponse", "Repons ou", "Your answer")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-muted border border-border">
                          <span className="text-sm text-muted-foreground">{t("Votre réponse", "Repons ou", "Your answer")}:</span>
                          <p className="text-foreground">{question.userAnswer || t("Pas de réponse", "Pa gen repons", "No answer")}</p>
                        </div>
                        <div className="p-2 rounded bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                          <span className="text-sm text-muted-foreground">{t("Réponse attendue", "Repons ki atann", "Expected answer")}:</span>
                          <p className="text-foreground">{question.correctAnswer}</p>
                        </div>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded dark:bg-blue-900/20 dark:border-blue-800">
                        <span className="text-sm font-medium text-foreground">{t("Explication", "Eksplikasyon", "Explanation")}:</span>
                        <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            {quiz.attempts < quiz.maxAttempts && !result.passed && (
              <Button onClick={restartQuiz}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("Recommencer", "Rekòmanse", "Retake Quiz")}
              </Button>
            )}
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Retour au cours", "Tounen nan kou a", "Back to Course")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  if (quizStarted && !quizCompleted) {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.courseName}</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${getTimeColor()}`} />
                    <span className={`font-mono text-lg ${getTimeColor()}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {currentQuestionIndex + 1} / {quiz.questions.length}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("Progression", "Pwogrè", "Progress")}</span>
                  <span className="text-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* Current Question */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {currentQuestionIndex + 1}
                    </span>
                    <Badge variant="outline">{currentQuestion.points} {t("pts", "pts", "pts")}</Badge>
                    {flaggedQuestions.has(currentQuestionIndex) && (
                      <Badge variant="destructive">
                        <Flag className="h-3 w-3 mr-1" />
                        {t("Marqué", "Make", "Flagged")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-foreground">{currentQuestion.question}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleFlag(currentQuestionIndex)}
                  className={flaggedQuestions.has(currentQuestionIndex) ? "bg-red-50 border-red-200 dark:bg-red-900/20" : ""}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false' ? (
                <RadioGroup 
                  value={answers[currentQuestion.id]?.toString() || ""} 
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="text-answer" className="text-foreground">
                    {t("Votre réponse", "Repons ou", "Your answer")}:
                  </Label>
                  <Textarea
                    id="text-answer"
                    value={answers[currentQuestion.id]?.toString() || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder={t("Tapez votre réponse ici...", "Ekri repons ou isit...", "Type your answer here...")}
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Précédent", "Anvan", "Previous")}
            </Button>
            
            <div className="flex items-center space-x-2">
              {/* Question navigator */}
              <div className="flex items-center space-x-1">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                      index === currentQuestionIndex 
                        ? "bg-primary text-primary-foreground" 
                        : answers[quiz.questions[index].id] !== undefined
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : flaggedQuestions.has(index)
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button onClick={submitQuiz}>
                <Trophy className="h-4 w-4 mr-2" />
                {t("Terminer", "Fini", "Finish")}
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                {t("Suivant", "Swivan", "Next")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz start view
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{quiz.questions.length}</div>
                  <div className="text-sm text-muted-foreground">{t("Questions", "Kesyon yo", "Questions")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{quiz.timeLimit}</div>
                  <div className="text-sm text-muted-foreground">{t("Minutes", "Minit yo", "Minutes")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{quiz.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">{t("Score requis", "Skò ki mande", "Passing score")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{quiz.maxAttempts - quiz.attempts}</div>
                  <div className="text-sm text-muted-foreground">{t("Tentatives restantes", "Tantativ ki rete", "Attempts left")}</div>
                </div>
              </div>
              
              {quiz.bestScore && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-foreground">
                    {t("Meilleur score", "Pi bon skò", "Best score")}: {quiz.bestScore}%
                  </div>
                </div>
              )}
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t("Vous pouvez naviguer entre les questions", "Ou ka navige ant kesyon yo", "You can navigate between questions")}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t("Vous pouvez marquer les questions pour révision", "Ou ka make kesyon yo pou revizyon", "You can flag questions for review")}
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  {t("Le quiz se soumettra automatiquement à la fin du temps", "Quiz la ap soumèt otomatikman nan fen tan an", "Quiz will auto-submit when time expires")}
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="px-8"
                  disabled={quiz.attempts >= quiz.maxAttempts}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {quiz.attempts >= quiz.maxAttempts 
                    ? t("Aucune tentative restante", "Pa gen tantativ ki rete", "No attempts remaining")
                    : t("Commencer le quiz", "Kòmanse quiz la", "Start Quiz")
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}