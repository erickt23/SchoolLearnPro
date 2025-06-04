import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";
import { School, Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Class {
  id: number;
  name: string;
  level: string;
  schoolId: number | null;
  teacherId: number | null;
  academicYear: string;
  isActive: boolean;
}

interface ClassFormData {
  name: string;
  level: string;
  schoolId: number | null;
  teacherId: number | null;
  academicYear: string;
  isActive: boolean;
}

export default function ClassManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    level: '',
    schoolId: null,
    teacherId: null,
    academicYear: '2024-2025',
    isActive: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch classes
  const { data: classes = [], isLoading, error } = useQuery({
    queryKey: ['/api/classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    },
  });

  // Fetch schools for dropdown
  const { data: schools = [] } = useQuery({
    queryKey: ['/api/schools'],
    queryFn: async () => {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      return response.json();
    },
  });

  // Fetch users for teacher dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      const url = isEditing ? `/api/classes/${editingId}` : '/api/classes';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classes'] });
      resetForm();
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: isEditing 
          ? t("Classe modifiée avec succès", "Klas la modifye ak siksè", "Class updated successfully")
          : t("Classe créée avec succès", "Klas la kreye ak siksè", "Class created successfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("Erreur", "Erè", "Error"),
        description: error.message || t("Une erreur est survenue", "Gen yon erè ki fèt", "An error occurred"),
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classes'] });
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: t("Classe supprimée avec succès", "Klas la efase ak siksè", "Class deleted successfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("Erreur", "Erè", "Error"),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      schoolId: null,
      teacherId: null,
      academicYear: '2024-2025',
      isActive: true
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (classItem: Class) => {
    setFormData({
      name: classItem.name,
      level: classItem.level,
      schoolId: classItem.schoolId,
      teacherId: classItem.teacherId,
      academicYear: classItem.academicYear,
      isActive: classItem.isActive
    });
    setIsEditing(true);
    setEditingId(classItem.id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("Êtes-vous sûr de vouloir supprimer cette classe?", "Èske w sèten w vle efase klas sa a?", "Are you sure you want to delete this class?"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.level.trim()) {
      toast({
        title: t("Erreur", "Erè", "Error"),
        description: t("Veuillez remplir tous les champs obligatoires", "Tanpri ranpli tout chan yo ki obligatwa", "Please fill in all required fields"),
        variant: "destructive"
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isLoading) return <div>{t("Chargement...", "Y ap chaje...", "Loading...")}</div>;
  if (error) return <div>{t("Erreur de chargement", "Erè nan chajman", "Loading error")}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Retour", "Tounen", "Back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{t("Gestion des Classes", "Jesyon Klas yo", "Class Management")}</h1>
            <p className="text-muted-foreground">
              {t("Gérez les classes de votre établissement", "Jere klas yo nan enstitisyon w lan", "Manage your institution's classes")}
            </p>
          </div>
        </div>
        <School className="w-8 h-8 text-primary" />
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing 
              ? t("Modifier la Classe", "Modifye Klas la", "Edit Class")
              : t("Ajouter une Nouvelle Classe", "Ajoute yon Nouvo Klas", "Add New Class")
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("Nom de la classe", "Non klas la", "Class name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("Ex: 6ème A", "Ex: 6yèm A", "Ex: 6th Grade A")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">{t("Niveau", "Nivo", "Level")} *</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sélectionner un niveau", "Chwazi yon nivo", "Select a level")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Préscolaire">{t("Préscolaire", "Preeskòlè", "Preschool")}</SelectItem>
                    <SelectItem value="Primaire">{t("Primaire", "Primè", "Primary")}</SelectItem>
                    <SelectItem value="Secondaire">{t("Secondaire", "Segondè", "Secondary")}</SelectItem>
                    <SelectItem value="Supérieur">{t("Supérieur", "Siperyè", "Higher")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolId">{t("École", "Lekòl", "School")}</Label>
                <Select 
                  value={formData.schoolId?.toString() || "none"} 
                  onValueChange={(value) => setFormData({ ...formData, schoolId: value === "none" ? null : parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sélectionner une école", "Chwazi yon lekòl", "Select a school")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("Aucune école", "Pa gen lekòl", "No school")}</SelectItem>
                    {schools.map((school: any) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacherId">{t("Enseignant principal", "Pwofesè prensipal", "Main teacher")}</Label>
                <Select 
                  value={formData.teacherId?.toString() || "none"} 
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value === "none" ? null : parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sélectionner un enseignant", "Chwazi yon pwofesè", "Select a teacher")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("Aucun enseignant", "Pa gen pwofesè", "No teacher")}</SelectItem>
                    {users.filter((user: any) => user.role === 'teacher').map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="academicYear">{t("Année académique", "Ane akademik", "Academic year")} *</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2024-2025"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending 
                  ? t("Enregistrement...", "Y ap anrejistre...", "Saving...")
                  : isEditing 
                    ? t("Modifier", "Modifye", "Update")
                    : t("Ajouter", "Ajoute", "Add")
                }
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  {t("Annuler", "Anile", "Cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Classes List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Liste des Classes", "Lis Klas yo", "Classes List")}</CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <Alert>
              <AlertDescription>
                {t("Aucune classe trouvée", "Pa gen klas yo jwenn", "No classes found")}
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Nom", "Non", "Name")}</TableHead>
                  <TableHead>{t("Niveau", "Nivo", "Level")}</TableHead>
                  <TableHead>{t("Année académique", "Ane akademik", "Academic Year")}</TableHead>
                  <TableHead>{t("Statut", "Estatik", "Status")}</TableHead>
                  <TableHead>{t("Actions", "Aksyon", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem: Class) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>{classItem.level}</TableCell>
                    <TableCell>{classItem.academicYear}</TableCell>
                    <TableCell>
                      <Badge variant={classItem.isActive ? "default" : "secondary"}>
                        {classItem.isActive 
                          ? t("Actif", "Aktif", "Active")
                          : t("Inactif", "Inaktif", "Inactive")
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(classItem)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(classItem.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}