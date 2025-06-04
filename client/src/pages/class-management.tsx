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
import { School, Plus, Edit, Trash2, Save, X, ArrowLeft, ChevronUp, ChevronDown, Filter, Download } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Class {
  id: number;
  label: string;
  shortName: string;
  previousClass: string | null;
  cycle: string;
  level: string;
  passingGrade: number;
  createdAt: string;
}

interface ClassFormData {
  label: string;
  shortName: string;
  previousClass: string;
  cycle: string;
  level: string;
  passingGrade: number;
}

type SortField = 'label' | 'shortName' | 'cycle' | 'level' | 'passingGrade';
type SortDirection = 'asc' | 'desc';

export default function ClassManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ClassFormData>({
    label: '',
    shortName: '',
    previousClass: '',
    cycle: '',
    level: '',
    passingGrade: 50
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('label');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCycle, setFilterCycle] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch classes
  const { data: classes = [], isLoading } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
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
        description: error.message,
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
      label: '',
      shortName: '',
      previousClass: '',
      cycle: '',
      level: '',
      passingGrade: 50
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (classItem: Class) => {
    setFormData({
      label: classItem.label,
      shortName: classItem.shortName,
      previousClass: classItem.previousClass || '',
      cycle: classItem.cycle,
      level: classItem.level,
      passingGrade: classItem.passingGrade
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
    
    // Validation
    if (!formData.label || !formData.shortName || !formData.cycle || !formData.level) {
      toast({
        title: t("Erreur de validation", "Erè nan validasyon", "Validation error"),
        description: t("Veuillez remplir tous les champs requis", "Tanpri ranpli tout jaden ki obligatwa yo", "Please fill all required fields"),
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  // Sorting and filtering
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedClasses = classes
    .filter(classItem => {
      const matchesSearch = classItem.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.shortName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = filterLevel === 'all' || classItem.level === filterLevel;
      const matchesCycle = filterCycle === 'all' || classItem.cycle === filterCycle;
      return matchesSearch && matchesLevel && matchesCycle;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedClasses.length / itemsPerPage);
  const paginatedClasses = filteredAndSortedClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = [
      t("Libellé de classe", "Etikèt klas", "Class Label"),
      t("Nom court", "Non kout", "Short Name"),
      t("Classe précédente", "Klas anvan an", "Previous Class"),
      t("Cycle", "Sik", "Cycle"),
      t("Niveau", "Nivo", "Level"),
      t("Note de passage", "Nòt pou pase", "Passing Grade")
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedClasses.map(classItem => [
        classItem.label,
        classItem.shortName,
        classItem.previousClass || 'N/A',
        classItem.cycle,
        classItem.level,
        classItem.passingGrade
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'classes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Retour au tableau de bord", "Tounen nan tablo jesyon", "Back to Dashboard")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("Gestion des classes", "Jesyon klas yo", "Class Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Créer et gérer les classes académiques", "Kreye ak jere klas ak akademik yo", "Create and manage academic classes")}
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t("Exporter CSV", "Ekspòte CSV", "Export CSV")}
        </Button>
      </div>

      {/* Class Creation Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="h-5 w-5 mr-2" />
            {isEditing 
              ? t("Modifier la classe", "Modifye klas la", "Edit Class")
              : t("Créer une nouvelle classe", "Kreye yon nouvo klas", "Create New Class")
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="label">
                  {t("Libellé de classe", "Etikèt klas", "Class Label")} *
                </Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder={t("Ex: Sixième Année", "Egz: Sizyèm Ane", "Ex: Sixth Grade")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortName">
                  {t("Nom court", "Non kout", "Short Name")} *
                </Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={(e) => setFormData({...formData, shortName: e.target.value})}
                  placeholder={t("Ex: 6ème AF", "Egz: 6èm AF", "Ex: 6th AF")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="previousClass">
                  {t("Classe précédente", "Klas anvan an", "Previous Class")}
                </Label>
                <Select value={formData.previousClass} onValueChange={(value) => setFormData({...formData, previousClass: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Choisir classe précédente", "Chwazi klas anvan an", "Choose previous class")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("PAS DE CLASSE PRÉCÉDENTE", "PA GEN KLAS ANVAN", "NO PREVIOUS CLASS")}</SelectItem>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.label}>
                        {classItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cycle">
                  {t("Cycle", "Sik", "Cycle")} *
                </Label>
                <Select value={formData.cycle} onValueChange={(value) => setFormData({...formData, cycle: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Choisir un cycle", "Chwazi yon sik", "Choose a cycle")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1er Cycle">{t("1er Cycle", "1ye Sik", "1st Cycle")}</SelectItem>
                    <SelectItem value="2ème Cycle">{t("2ème Cycle", "2èm Sik", "2nd Cycle")}</SelectItem>
                    <SelectItem value="3ème Cycle">{t("3ème Cycle", "3èm Sik", "3rd Cycle")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">
                  {t("Niveau", "Nivo", "Level")} *
                </Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Choisir un niveau", "Chwazi yon nivo", "Choose a level")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Préscolaire">{t("Préscolaire", "Preskolè", "Preschool")}</SelectItem>
                    <SelectItem value="Fondamental">{t("Fondamental", "Fondamantal", "Elementary")}</SelectItem>
                    <SelectItem value="Secondaire">{t("Secondaire", "Segondè", "Secondary")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passingGrade">
                  {t("Note de passage", "Nòt pou pase", "Passing Grade")} *
                </Label>
                <Input
                  id="passingGrade"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingGrade}
                  onChange={(e) => setFormData({...formData, passingGrade: parseInt(e.target.value) || 50})}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending 
                  ? t("Enregistrement...", "Kap anrejistre...", "Saving...") 
                  : (isEditing ? t("Modifier", "Modifye", "Update") : t("Créer", "Kreye", "Create"))
                }
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  {t("Annuler", "Anile", "Cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {t("Filtres et recherche", "Filtè ak rechèch", "Filters and Search")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={t("Rechercher par libellé...", "Chèche pa etikèt...", "Search by label...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder={t("Filtrer par niveau", "Filtè pa nivo", "Filter by level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Tous les niveaux", "Tout nivo yo", "All levels")}</SelectItem>
                <SelectItem value="Préscolaire">{t("Préscolaire", "Preskolè", "Preschool")}</SelectItem>
                <SelectItem value="Fondamental">{t("Fondamental", "Fondamantal", "Elementary")}</SelectItem>
                <SelectItem value="Secondaire">{t("Secondaire", "Segondè", "Secondary")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCycle} onValueChange={setFilterCycle}>
              <SelectTrigger>
                <SelectValue placeholder={t("Filtrer par cycle", "Filtè pa sik", "Filter by cycle")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Tous les cycles", "Tout sik yo", "All cycles")}</SelectItem>
                <SelectItem value="1er Cycle">{t("1er Cycle", "1ye Sik", "1st Cycle")}</SelectItem>
                <SelectItem value="2ème Cycle">{t("2èm Cycle", "2èm Sik", "2nd Cycle")}</SelectItem>
                <SelectItem value="3ème Cycle">{t("3èm Cycle", "3èm Sik", "3rd Cycle")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t("Liste des classes", "Lis klas yo", "Class List")}
            </CardTitle>
            <div className="text-sm text-gray-600">
              {t(`Afficher ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(currentPage * itemsPerPage, filteredAndSortedClasses.length)} (total de ${filteredAndSortedClasses.length})`, 
                 `Montre ${(currentPage - 1) * itemsPerPage + 1} nan ${Math.min(currentPage * itemsPerPage, filteredAndSortedClasses.length)} (total ${filteredAndSortedClasses.length})`,
                 `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredAndSortedClasses.length)} (total ${filteredAndSortedClasses.length})`)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              {t("Chargement...", "Ap chaje...", "Loading...")}
            </div>
          ) : filteredAndSortedClasses.length === 0 ? (
            <div className="text-center py-8">
              <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {t("Aucune classe trouvée", "Pa gen klas yo jwenn", "No classes found")}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('label')}
                      >
                        <div className="flex items-center">
                          {t("Libellé", "Etikèt", "Label")}
                          <SortIcon field="label" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('shortName')}
                      >
                        <div className="flex items-center">
                          {t("Nom court", "Non kout", "Short Name")}
                          <SortIcon field="shortName" />
                        </div>
                      </TableHead>
                      <TableHead>{t("Classe précédente", "Klas anvan an", "Previous Class")}</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('cycle')}
                      >
                        <div className="flex items-center">
                          {t("Cycle", "Sik", "Cycle")}
                          <SortIcon field="cycle" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('level')}
                      >
                        <div className="flex items-center">
                          {t("Niveau", "Nivo", "Level")}
                          <SortIcon field="level" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('passingGrade')}
                      >
                        <div className="flex items-center">
                          {t("Note de passage", "Nòt pou pase", "Passing Grade")}
                          <SortIcon field="passingGrade" />
                        </div>
                      </TableHead>
                      <TableHead>{t("Actions", "Aksyon yo", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClasses.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.label}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{classItem.shortName}</Badge>
                        </TableCell>
                        <TableCell>{classItem.previousClass || t("Aucune", "Okenn", "None")}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{classItem.cycle}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{classItem.level}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{classItem.passingGrade}%</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(classItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(classItem.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {t(`Page ${currentPage} sur ${totalPages}`, `Paj ${currentPage} sou ${totalPages}`, `Page ${currentPage} of ${totalPages}`)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      {t("Précédent", "Anvan", "Previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      {t("Suivant", "Apre", "Next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}