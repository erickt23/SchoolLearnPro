import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  Calculator,
  FileText,
  RotateCcw,
  Send
} from "lucide-react";

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  timeLimit?: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: QuizQuestion[];
  attempts: number;
  passingScore: number;
}

export default function QuizInterface() {
  const { t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const quizData: QuizData = {
    id: "1",
    title: t("Quiz - Équations du Second Degré", "Quiz - Ekwasyon Dezyèm Degre yo", "Quiz - Quadratic Equations"),
    description: t("Testez vos connaissances sur les équations du second degré", "Teste konesans ou sou ekwasyon dezyèm degre yo", "Test your knowledge on quadratic equations"),
    duration: 60,
    totalPoints: 100,
    attempts: 3,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: t(
          "Quelle est la forme générale d'une équation du second degré ?",
          "Ki fòm jeneral yon ekwasyon dezyèm degre ?",
          "What is the general form of a quadratic equation?"
        ),
        options: [
          "ax + b = 0",
          "ax² + bx + c = 0",
          "ax³ + bx² + cx + d = 0",
          "ax² + b = 0"
        ],
        correctAnswer: "ax² + bx + c = 0",
        points: 10,
        explanation: t(
          "La forme générale est ax² + bx + c = 0 où a ≠ 0",
          "Fòm jeneral la se ax² + bx + c = 0 kote a ≠ 0",
          "The general form is ax² + bx + c = 0 where a ≠ 0"
        )
      },
      {
        id: "q2",
        type: "multiple-select",
        question: t(
          "Quelles sont les méthodes pour résoudre une équation du second degré ? (Sélectionnez toutes les bonnes réponses)",
          "Ki metòd yo pou rezoud yon ekwasyon dezyèm degre ? (Chwazi tout bon repons yo)",
          "What are the methods to solve a quadratic equation? (Select all correct answers)"
        ),
        options: [
          t("Factorisation", "Faktorisasyon", "Factorization"),
          t("Formule quadratique", "Fòmil kwadratik", "Quadratic formula"),
          t("Complétion du carré", "Konplè kare a", "Completing the square"),
          t("Méthode graphique", "Metòd grafik", "Graphical method"),
          t("Substitution simple", "Substitisyon senp", "Simple substitution")
        ],
        correctAnswer: [
          t("Factorisation", "Faktorisasyon", "Factorization"),
          t("Formule quadratique", "Fòmil kwadratik", "Quadratic formula"),
          t("Complétion du carré", "Konplè kare a", "Completing the square"),
          t("Méthode graphique", "Metòd grafik", "Graphical method")
        ],
        points: 15
      },
      {
        id: "q3",
        type: "true-false",
        question: t(
          "Une équation du second degré peut avoir au maximum 2 solutions réelles.",
          "Yon ekwasyon dezyèm degre ka gen omaksimòm 2 solisyon reyèl.",
          "A quadratic equation can have at most 2 real solutions."
        ),
        correctAnswer: "true",
        points: 10
      },
      {
        id: "q4",
        type: "short-answer",
        question: t(
          "Résolvez l'équation : x² - 5x + 6 = 0",
          "Rezoud ekwasyon an : x² - 5x + 6 = 0",
          "Solve the equation: x² - 5x + 6 = 0"
        ),
        correctAnswer: "x = 2, x = 3",
        points: 20
      },
      {
        id: "q5",
        type: "essay",
        question: t(
          "Expliquez la méthode de complétion du carré avec un exemple.",
          "Eksplike metòd konplè kare a ak yon egzanp.",
          "Explain the completing the square method with an example."
        ),
        points: 45
      }
    ]
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];

  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 1800) return "text-green-600"; // > 30 min
    if (timeRemaining > 600) return "text-yellow-600"; // > 10 min
    return "text-red-600"; // < 10 min
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getQuestionStatus = (questionId: string) => {
    if (answers[questionId] !== undefined) {
      return 'answered';
    }
    if (flaggedQuestions.has(questionId)) {
      return 'flagged';
    }
    return 'unanswered';
  };

  const getProgress = () => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / quizData.questions.length) * 100;
  };

  const submitQuiz = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id] || ""} 
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded border hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple-select':
        const selectedAnswers = answers[currentQuestion.id] || [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded border hover:bg-gray-50">
                <Checkbox
                  id={`option-${index}`}
                  checked={selectedAnswers.includes(option)}
                  onCheckedChange={(checked) => {
                    const newAnswers = checked 
                      ? [...selectedAnswers, option]
                      : selectedAnswers.filter((a: string) => a !== option);
                    handleAnswer(currentQuestion.id, newAnswers);
                  }}
                />
                <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id] || ""} 
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
          >
            <div className="flex items-center space-x-2 p-3 rounded border hover:bg-gray-50">
              <RadioGroupItem value="true" id="true" />
              <label htmlFor="true" className="flex-1 cursor-pointer">
                {t("Vrai", "Vre", "True")}
              </label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded border hover:bg-gray-50">
              <RadioGroupItem value="false" id="false" />
              <label htmlFor="false" className="flex-1 cursor-pointer">
                {t("Faux", "Fo", "False")}
              </label>
            </div>
          </RadioGroup>
        );

      case 'short-answer':
        return (
          <Textarea
            placeholder={t("Tapez votre réponse ici...", "Tape repons ou a isit la...", "Type your answer here...")}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            rows={3}
          />
        );

      case 'essay':
        return (
          <Textarea
            placeholder={t("Développez votre réponse...", "Devlope repons ou a...", "Develop your answer...")}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            rows={8}
          />
        );

      default:
        return null;
    }
  };

  if (showResults) {
    const score = 75; // Mock score
    const passed = score >= quizData.passingScore;
    
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              {passed ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              ) : (
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed 
                ? t("Félicitations ! Vous avez réussi", "Felisitasyon! Ou reyisi", "Congratulations! You passed")
                : t("Vous n'avez pas atteint le score minimum", "Ou pa rive jwenn nòt minimòm nan", "You didn't reach the minimum score")
              }
            </CardTitle>
            <CardDescription>
              {t("Votre score final", "Nòt final ou a", "Your final score")}: {score}/{quizData.totalPoints}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-gray-600">{t("Score obtenu", "Nòt ou jwenn", "Score obtained")}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Object.keys(answers).length}</div>
                <div className="text-sm text-gray-600">{t("Questions répondues", "Kesyon yo reponn", "Questions answered")}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{formatTime(3600 - timeRemaining)}</div>
                <div className="text-sm text-gray-600">{t("Temps utilisé", "Tan yo itilize", "Time used")}</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline">
                {t("Voir les corrections", "Gade koreksyon yo", "View corrections")}
              </Button>
              {!passed && (
                <Button>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t("Reprendre le quiz", "Reprann quiz la", "Retake quiz")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
          <p className="text-gray-600">{quizData.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${getTimeColor()}`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
          </div>
          <Badge variant="outline">
            {t("Points totaux", "Total pwen yo", "Total points")}: {quizData.totalPoints}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Navigation", "Navigasyon", "Navigation")}
              </CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("Progression", "Pwogre", "Progress")}</span>
                  <span>{Math.round(getProgress())}%</span>
                </div>
                <Progress value={getProgress()} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quizData.questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <Button
                      key={question.id}
                      size="sm"
                      variant={index === currentQuestionIndex ? "default" : "outline"}
                      className={`relative ${
                        status === 'answered' ? 'bg-green-50 border-green-200' :
                        status === 'flagged' ? 'bg-yellow-50 border-yellow-200' : ''
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                      {flaggedQuestions.has(question.id) && (
                        <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                      )}
                    </Button>
                  );
                })}
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                  <span>{t("Répondu", "Reponn", "Answered")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span>{t("Marqué", "Make", "Flagged")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>{t("Non répondu", "Pa reponn", "Unanswered")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {t("Question", "Kesyon", "Question")} {currentQuestionIndex + 1} / {quizData.questions.length}
                  </Badge>
                  <CardTitle className="text-lg">
                    {currentQuestion.question}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{currentQuestion.points} {t("points", "pwen", "points")}</span>
                    <Badge variant={currentQuestion.type === 'essay' ? 'secondary' : 'outline'}>
                      {currentQuestion.type === 'multiple-choice' && t("Choix unique", "Yon sèl chwa", "Single choice")}
                      {currentQuestion.type === 'multiple-select' && t("Choix multiple", "Plizyè chwa", "Multiple choice")}
                      {currentQuestion.type === 'true-false' && t("Vrai/Faux", "Vre/Fo", "True/False")}
                      {currentQuestion.type === 'short-answer' && t("Réponse courte", "Repons kout", "Short answer")}
                      {currentQuestion.type === 'essay' && t("Dissertation", "Disètasyon", "Essay")}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={flaggedQuestions.has(currentQuestion.id) ? "text-yellow-600" : ""}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestion()}
              
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t("Précédent", "Anvan an", "Previous")}
                </Button>
                
                <div className="flex gap-2">
                  {currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay' ? (
                    <Button variant="outline" size="sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      {t("Calculatrice", "Kalkilatè", "Calculator")}
                    </Button>
                  ) : null}
                </div>

                {currentQuestionIndex === quizData.questions.length - 1 ? (
                  <Button onClick={submitQuiz} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-2" />
                    {t("Soumettre le quiz", "Soumèt quiz la", "Submit quiz")}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(quizData.questions.length - 1, prev + 1))}
                  >
                    {t("Suivant", "Swivan", "Next")}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}