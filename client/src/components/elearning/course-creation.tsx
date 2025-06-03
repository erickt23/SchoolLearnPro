import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Video, 
  FileText, 
  Image, 
  Plus, 
  X, 
  Play, 
  Clock, 
  Users,
  BookOpen,
  ChevronRight,
  Save,
  Eye
} from "lucide-react";

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: number;
  content?: string;
  videoUrl?: string;
  resources?: Array<{ name: string; url: string; type: string }>;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export default function CourseCreation() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("info");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    duration: "",
    price: "",
    thumbnail: "",
    language: "fr"
  });
  
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: "1",
      title: "",
      description: "",
      lessons: []
    }
  ]);
  
  const [currentModule, setCurrentModule] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addModule = () => {
    const newModule: CourseModule = {
      id: (modules.length + 1).toString(),
      title: "",
      description: "",
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson: CourseLesson = {
      id: Date.now().toString(),
      title: "",
      type: 'text',
      resources: []
    };
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    setModules(updatedModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(updatedModules);
  };

  const handleFileUpload = (type: string) => {
    // Simulation d'upload avec progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("Créer un nouveau cours", "Kreye yon nouvo kou", "Create New Course")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t(
                "Concevez et publiez votre cours interactif", 
                "Konsèy ak pibliye kou entèaktif ou an", 
                "Design and publish your interactive course"
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("Aperçu", "Aperçu", "Preview")}
            </Button>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {t("Sauvegarder", "Sove", "Save")}
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            {t("Informations de base", "Enfòmasyon de baz yo", "Basic Information")}
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            {t("Contenu du cours", "Kontni kou a", "Course Content")}
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            {t("Publication", "Piblise", "Publish")}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">
            {t("Informations", "Enfòmasyon", "Information")}
          </TabsTrigger>
          <TabsTrigger value="content">
            {t("Contenu", "Kontni", "Content")}
          </TabsTrigger>
          <TabsTrigger value="resources">
            {t("Ressources", "Resous yo", "Resources")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {t("Paramètres", "Paramèt yo", "Settings")}
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Détails du cours", "Detay kou a", "Course Details")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    {t("Titre du cours", "Tit kou a", "Course Title")}
                  </Label>
                  <Input
                    id="title"
                    placeholder={t("Ex: Introduction à Python", "Ex: Entwodiksyon nan Python", "Ex: Introduction to Python")}
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">
                    {t("Description", "Deskripsyon", "Description")}
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder={t("Décrivez votre cours...", "Dekri kou ou a...", "Describe your course...")}
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Catégorie", "Kategori", "Category")}</Label>
                    <Select value={courseData.category} onValueChange={(value) => setCourseData({...courseData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Sélectionner", "Chwazi", "Select")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">{t("Mathématiques", "Matematik", "Mathematics")}</SelectItem>
                        <SelectItem value="science">{t("Sciences", "Syans yo", "Science")}</SelectItem>
                        <SelectItem value="language">{t("Langues", "Lang yo", "Languages")}</SelectItem>
                        <SelectItem value="history">{t("Histoire", "Istwa", "History")}</SelectItem>
                        <SelectItem value="technology">{t("Technologie", "Teknoloji", "Technology")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{t("Niveau", "Nivo", "Level")}</Label>
                    <Select value={courseData.level} onValueChange={(value) => setCourseData({...courseData, level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Sélectionner", "Chwazi", "Select")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{t("Débutant", "Kòmanse", "Beginner")}</SelectItem>
                        <SelectItem value="intermediate">{t("Intermédiaire", "Entèmedyè", "Intermediate")}</SelectItem>
                        <SelectItem value="advanced">{t("Avancé", "Avanse", "Advanced")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Image de couverture", "Imaj kouvèti", "Cover Image")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <Button 
                    variant="outline" 
                    onClick={() => handleFileUpload('image')}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {t("Télécharger une image", "Telechaje yon imaj", "Upload Image")}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("JPG, PNG ou GIF jusqu'à 5MB", "JPG, PNG oswa GIF jiska 5MB", "JPG, PNG or GIF up to 5MB")}
                  </p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Progress value={uploadProgress} className="mt-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Course Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {t("Structure du cours", "Estrikti kou a", "Course Structure")}
            </h3>
            <Button onClick={addModule} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("Ajouter un module", "Ajoute yon modil", "Add Module")}
            </Button>
          </div>
          
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Input
                        placeholder={t("Titre du module", "Tit modil la", "Module Title")}
                        value={module.title}
                        onChange={(e) => {
                          const updatedModules = [...modules];
                          updatedModules[moduleIndex].title = e.target.value;
                          setModules(updatedModules);
                        }}
                        className="text-lg font-semibold"
                      />
                    </div>
                    <Badge variant="outline">
                      {t("Module", "Modil", "Module")} {moduleIndex + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={t("Description du module", "Deskripsyon modil la", "Module Description")}
                    value={module.description}
                    onChange={(e) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].description = e.target.value;
                      setModules(updatedModules);
                    }}
                    className="mb-4"
                  />
                  
                  {/* Lessons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {t("Leçons", "Leson yo", "Lessons")} ({module.lessons.length})
                      </h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addLesson(moduleIndex)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        {t("Ajouter une leçon", "Ajoute yon leson", "Add Lesson")}
                      </Button>
                    </div>
                    
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <Input
                              placeholder={t("Titre de la leçon", "Tit leson an", "Lesson Title")}
                              value={lesson.title}
                              onChange={(e) => {
                                const updatedModules = [...modules];
                                updatedModules[moduleIndex].lessons[lessonIndex].title = e.target.value;
                                setModules(updatedModules);
                              }}
                            />
                          </div>
                          <Select
                            value={lesson.type}
                            onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') => {
                              const updatedModules = [...modules];
                              updatedModules[moduleIndex].lessons[lessonIndex].type = value;
                              setModules(updatedModules);
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4" />
                                  {t("Vidéo", "Video", "Video")}
                                </div>
                              </SelectItem>
                              <SelectItem value="text">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  {t("Texte", "Tèks", "Text")}
                                </div>
                              </SelectItem>
                              <SelectItem value="quiz">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  {t("Quiz", "Quiz", "Quiz")}
                                </div>
                              </SelectItem>
                              <SelectItem value="assignment">
                                <div className="flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  {t("Devoir", "Devoir", "Assignment")}
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Content based on lesson type */}
                        {lesson.type === 'video' && (
                          <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleFileUpload('video')}
                              >
                                {t("Télécharger une vidéo", "Telechaje yon video", "Upload Video")}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {lesson.type === 'text' && (
                          <Textarea
                            placeholder={t("Contenu de la leçon...", "Kontni leson an...", "Lesson content...")}
                            rows={4}
                            value={lesson.content || ''}
                            onChange={(e) => {
                              const updatedModules = [...modules];
                              updatedModules[moduleIndex].lessons[lessonIndex].content = e.target.value;
                              setModules(updatedModules);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Ressources du cours", "Resous kou a", "Course Resources")}</CardTitle>
              <CardDescription>
                {t(
                  "Ajoutez des fichiers PDF, documents et autres ressources", 
                  "Ajoute fichye PDF yo, dokiman yo ak lòt resous yo", 
                  "Add PDF files, documents and other resources"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Button variant="outline" onClick={() => handleFileUpload('pdf')}>
                      {t("Télécharger des fichiers", "Telechaje fichye yo", "Upload Files")}
                    </Button>
                    <p className="text-sm text-gray-500">
                      {t("PDF, DOC, PPT, images jusqu'à 50MB par fichier", "PDF, DOC, PPT, imaj yo jiska 50MB pou chak fichye", "PDF, DOC, PPT, images up to 50MB per file")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Paramètres de publication", "Paramèt piblise yo", "Publishing Settings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Cours gratuit", "Kou gratis", "Free Course")}</Label>
                    <p className="text-sm text-gray-500">
                      {t("Rendre ce cours accessible gratuitement", "Fè kou sa a aksèsib gratis", "Make this course accessible for free")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("Gratuit", "Gratis", "Free")}
                  </Button>
                </div>
                
                <div>
                  <Label>{t("Langue du cours", "Lang kou a", "Course Language")}</Label>
                  <Select value={courseData.language} onValueChange={(value) => setCourseData({...courseData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ht">Kreyòl Ayisyen</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Statistiques", "Estatistik yo", "Statistics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("Total des modules", "Total modil yo", "Total Modules")}</span>
                    <Badge>{modules.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("Total des leçons", "Total leson yo", "Total Lessons")}</span>
                    <Badge>{modules.reduce((total, module) => total + module.lessons.length, 0)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("Durée estimée", "Dire estime", "Estimated Duration")}</span>
                    <Badge variant="outline">{t("2h 30min", "2è 30min", "2h 30min")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}