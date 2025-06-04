import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  BookOpen, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Clock,
  Users,
  Calendar,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  Filter,
  FileText,
  Video
} from "lucide-react";
import type { Course, InsertCourse, Class, Teacher } from "@shared/schema";

interface CourseFormData {
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
  classId: number | null;
  teacherId: number | null;
  category: string;
  objectives: string;
  prerequisites: string;
}

export default function CourseManagement() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    content: "",
    duration: 60,
    difficulty: "beginner",
    isActive: true,
    classId: null,
    teacherId: null,
    category: "",
    objectives: "",
    prerequisites: ""
  });

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  // Fetch classes
  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    },
  });

  // Fetch teachers
  const { data: teachers = [] } = useQuery<Teacher[]>({
    queryKey: ['/api/teachers'],
    queryFn: async () => {
      const response = await fetch('/api/teachers');
      if (!response.ok) throw new Error('Failed to fetch teachers');
      return response.json();
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const url = isEditing ? `/api/courses/${editingId}` : '/api/courses';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      resetForm();
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: isEditing 
          ? t("Cours modifié avec succès", "Kou a modifye ak siksè", "Course updated successfully")
          : t("Cours créé avec succès", "Kou a kreye ak siksè", "Course created successfully"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("Erreur", "Erè", "Error"),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: t("Cours supprimé avec succès", "Kou a efase ak siksè", "Course deleted successfully"),
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      duration: 60,
      difficulty: "beginner",
      isActive: true,
      classId: null,
      teacherId: null,
      category: "",
      objectives: "",
      prerequisites: ""
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description || "",
      content: typeof course.content === 'string' ? course.content : "",
      duration: 60, // Default duration since not in schema
      difficulty: "beginner", // Default difficulty since not in schema
      isActive: course.isPublished, // Using isPublished as isActive
      classId: course.classId,
      teacherId: course.teacherId,
      category: "", // Default category since not in schema
      objectives: "", // Default objectives since not in schema
      prerequisites: "" // Default prerequisites since not in schema
    });
    setIsEditing(true);
    setEditingId(course.id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("Êtes-vous sûr de vouloir supprimer ce cours?", "Èske w sèten w vle efase kou sa a?", "Are you sure you want to delete this course?"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: t("Erreur de validation", "Erè nan validasyon", "Validation error"),
        description: t("Le titre du cours est requis", "Tit kou a obligatwa", "Course title is required"),
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass === "all" || 
                        (selectedClass === "none" && !course.classId) ||
                        course.classId?.toString() === selectedClass;
    const matchesDifficulty = selectedDifficulty === "all"; // Always true since difficulty not in schema
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && course.isPublished) ||
                         (selectedStatus === "inactive" && !course.isPublished);
    return matchesSearch && matchesClass && matchesDifficulty && matchesStatus;
  });

  const getClassName = (classId: number | null) => {
    if (!classId) return t("Tous niveaux", "Tout nivo yo", "All levels");
    const classItem = classes.find(c => c.id === classId);
    return classItem?.name || t("Classe inconnue", "Klas enkoni", "Unknown class");
  };

  const getTeacherName = (teacherId: number | null) => {
    if (!teacherId) return t("Non assigné", "Pa asiyen", "Unassigned");
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `Teacher ${teacher.id}` : t("Enseignant inconnu", "Pwofesè enkoni", "Unknown teacher");
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    
    const labels = {
      beginner: t("Débutant", "Kòmanse", "Beginner"),
      intermediate: t("Intermédiaire", "Mwayen", "Intermediate"),
      advanced: t("Avancé", "Avanse", "Advanced")
    };

    return (
      <Badge className={variants[difficulty as keyof typeof variants] || variants.beginner}>
        {labels[difficulty as keyof typeof labels] || difficulty}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">
            {t("Chargement...", "Ap chaje...", "Loading...")}
          </div>
        </div>
      </div>
    );
  }

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
              {t("Gestion des cours", "Jesyon kou yo", "Course Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Créer et gérer les contenus de cours", "Kreye ak jere kontni kou yo", "Create and manage course content")}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("Nouveau cours", "Nouvo kou", "New Course")}
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("Liste des cours", "Lis kou yo", "Course List")}</TabsTrigger>
          <TabsTrigger value="stats">{t("Statistiques", "Estatistik", "Statistics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {t("Filtres", "Filt yo", "Filters")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">{t("Rechercher", "Chèche", "Search")}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder={t("Titre du cours...", "Tit kou a...", "Course title...")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>{t("Classe", "Klas", "Class")}</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Toutes les classes", "Tout klas yo", "All classes")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("Toutes les classes", "Tout klas yo", "All classes")}</SelectItem>
                      <SelectItem value="none">{t("Tous niveaux", "Tout nivo yo", "All levels")}</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("Difficulté", "Difikilte", "Difficulty")}</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Toutes difficultés", "Tout difikilte yo", "All difficulties")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("Toutes difficultés", "Tout difikilte yo", "All difficulties")}</SelectItem>
                      <SelectItem value="beginner">{t("Débutant", "Kòmanse", "Beginner")}</SelectItem>
                      <SelectItem value="intermediate">{t("Intermédiaire", "Mwayen", "Intermediate")}</SelectItem>
                      <SelectItem value="advanced">{t("Avancé", "Avanse", "Advanced")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("Statut", "Estati", "Status")}</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Tous statuts", "Tout estati yo", "All statuses")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("Tous statuts", "Tout estati yo", "All statuses")}</SelectItem>
                      <SelectItem value="active">{t("Actif", "Aktif", "Active")}</SelectItem>
                      <SelectItem value="inactive">{t("Inactif", "Pa aktif", "Inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("Cours", "Kou yo", "Courses")} ({filteredCourses.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Cours", "Kou", "Course")}</TableHead>
                    <TableHead>{t("Classe", "Klas", "Class")}</TableHead>
                    <TableHead>{t("Enseignant", "Pwofesè", "Teacher")}</TableHead>
                    <TableHead>{t("Difficulté", "Difikilte", "Difficulty")}</TableHead>
                    <TableHead>{t("Durée", "Dire", "Duration")}</TableHead>
                    <TableHead>{t("Statut", "Estati", "Status")}</TableHead>
                    <TableHead>{t("Actions", "Aksyon yo", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                            {course.title}
                          </div>
                          {course.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {course.description.length > 100 
                                ? `${course.description.substring(0, 100)}...` 
                                : course.description
                              }
                            </div>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {t("Cours", "Kou", "Course")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getClassName(course.classId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getTeacherName(course.teacherId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDifficultyBadge("beginner")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          60 min
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.isPublished ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t("Actif", "Aktif", "Active")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Pause className="h-3 w-3 mr-1" />
                            {t("Inactif", "Pa aktif", "Inactive")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Total cours", "Total kou", "Total Courses")}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Cours actifs", "Kou aktif yo", "Active Courses")}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courses.filter(c => c.isPublished).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Durée moyenne", "Dire mwayèn", "Average Duration")}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  60 min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Enseignants actifs", "Pwofesè aktif yo", "Active Teachers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(courses.filter(c => c.teacherId).map(c => c.teacherId)).size}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isEditing 
                  ? t("Modifier le cours", "Modifye kou a", "Edit Course")
                  : t("Nouveau cours", "Nouvo kou", "New Course")
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">{t("Titre du cours", "Tit kou a", "Course Title")} *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t("Catégorie", "Kategori", "Category")}</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder={t("Ex: Mathématiques", "Egz: Matematik", "Ex: Mathematics")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t("Description", "Deskripsyon", "Description")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="classId">{t("Classe", "Klas", "Class")}</Label>
                    <Select 
                      value={formData.classId?.toString() || "none"} 
                      onValueChange={(value) => setFormData({ ...formData, classId: value === "none" ? null : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Sélectionner une classe", "Chwazi yon klas", "Select a class")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t("Tous niveaux", "Tout nivo yo", "All levels")}</SelectItem>
                        {classes.map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id.toString()}>
                            {classItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="teacherId">{t("Enseignant", "Pwofesè", "Teacher")}</Label>
                    <Select 
                      value={formData.teacherId?.toString() || "none"} 
                      onValueChange={(value) => setFormData({ ...formData, teacherId: value === "none" ? null : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Sélectionner un enseignant", "Chwazi yon pwofesè", "Select a teacher")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t("Non assigné", "Pa asiyen", "Unassigned")}</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            Teacher {teacher.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">{t("Difficulté", "Difikilte", "Difficulty")}</Label>
                    <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{t("Débutant", "Kòmanse", "Beginner")}</SelectItem>
                        <SelectItem value="intermediate">{t("Intermédiaire", "Mwayen", "Intermediate")}</SelectItem>
                        <SelectItem value="advanced">{t("Avancé", "Avanse", "Advanced")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">{t("Durée (minutes)", "Dire (minit)", "Duration (minutes)")}</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="isActive">{t("Statut", "Estati", "Status")}</Label>
                    <Select value={formData.isActive.toString()} onValueChange={(value) => setFormData({ ...formData, isActive: value === "true" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{t("Actif", "Aktif", "Active")}</SelectItem>
                        <SelectItem value="false">{t("Inactif", "Pa aktif", "Inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="objectives">{t("Objectifs pédagogiques", "Objektif pedagojik yo", "Learning Objectives")}</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    rows={3}
                    placeholder={t("Décrivez les objectifs d'apprentissage...", "Dekri objektif yo...", "Describe learning objectives...")}
                  />
                </div>

                <div>
                  <Label htmlFor="prerequisites">{t("Prérequis", "Kondisyon yo", "Prerequisites")}</Label>
                  <Textarea
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    rows={2}
                    placeholder={t("Connaissances requises...", "Konesans ki nesesè yo...", "Required knowledge...")}
                  />
                </div>

                <div>
                  <Label htmlFor="content">{t("Contenu du cours", "Kontni kou a", "Course Content")}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    placeholder={t("Rédigez le contenu détaillé du cours...", "Ekri kontni detaye kou a...", "Write detailed course content...")}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    {t("Annuler", "Anile", "Cancel")}
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    <Check className="h-4 w-4 mr-2" />
                    {saveMutation.isPending 
                      ? t("Sauvegarde...", "Ap konsève...", "Saving...") 
                      : t("Sauvegarder", "Konsève", "Save")
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}