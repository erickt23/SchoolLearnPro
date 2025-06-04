import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Network, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building,
  Users,
  School,
  Calendar,
  Check,
  X,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import type { SchoolNetwork, InsertSchoolNetwork, School as SchoolType } from "@shared/schema";

interface NetworkFormData {
  name: string;
  description: string;
  adminUserId: number | null;
}

export default function SchoolNetworkManagement() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NetworkFormData>({
    name: "",
    description: "",
    adminUserId: null
  });

  // Fetch school networks
  const { data: networks = [], isLoading } = useQuery<SchoolNetwork[]>({
    queryKey: ['/api/school-networks'],
    queryFn: async () => {
      const response = await fetch('/api/school-networks');
      if (!response.ok) throw new Error('Failed to fetch networks');
      return response.json();
    },
  });

  // Fetch schools for statistics
  const { data: schools = [] } = useQuery<SchoolType[]>({
    queryKey: ['/api/schools'],
    queryFn: async () => {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      return response.json();
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: NetworkFormData) => {
      const url = isEditing ? `/api/school-networks/${editingId}` : '/api/school-networks';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/school-networks'] });
      resetForm();
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: isEditing 
          ? t("Réseau modifié avec succès", "Rezo a modifye ak siksè", "Network updated successfully")
          : t("Réseau créé avec succès", "Rezo a kreye ak siksè", "Network created successfully"),
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
      await apiRequest('DELETE', `/api/school-networks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/school-networks'] });
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: t("Réseau supprimé avec succès", "Rezo a efase ak siksè", "Network deleted successfully"),
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      adminUserId: null
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (network: SchoolNetwork) => {
    setFormData({
      name: network.name,
      description: network.description || "",
      adminUserId: network.adminUserId
    });
    setIsEditing(true);
    setEditingId(network.id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    const schoolsInNetwork = schools.filter(s => s.schoolNetworkId === id);
    if (schoolsInNetwork.length > 0) {
      toast({
        title: t("Impossible de supprimer", "Pa kapab efase", "Cannot delete"),
        description: t("Ce réseau contient des écoles. Veuillez d'abord les déplacer.", "Rezo sa a gen lekòl yo. Tanpri deplase yo anvan.", "This network contains schools. Please move them first."),
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(t("Êtes-vous sûr de vouloir supprimer ce réseau?", "Èske w sèten w vle efase rezo sa a?", "Are you sure you want to delete this network?"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: t("Erreur de validation", "Erè nan validasyon", "Validation error"),
        description: t("Le nom du réseau est requis", "Non rezo a obligatwa", "Network name is required"),
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const filteredNetworks = networks.filter(network => 
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (network.description && network.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSchoolCount = (networkId: number) => {
    return schools.filter(s => s.schoolNetworkId === networkId).length;
  };

  const getTotalCapacity = (networkId: number) => {
    return schools
      .filter(s => s.schoolNetworkId === networkId)
      .reduce((sum, s) => sum + (s.capacity || 0), 0);
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
              {t("Gestion des réseaux scolaires", "Jesyon rezo lekòl yo", "School Network Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Gérer les réseaux d'établissements", "Jere rezo etablisman yo", "Manage educational networks")}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("Nouveau réseau", "Nouvo rezo", "New Network")}
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("Liste des réseaux", "Lis rezo yo", "Network List")}</TabsTrigger>
          <TabsTrigger value="stats">{t("Statistiques", "Estatistik", "Statistics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("Rechercher un réseau...", "Chèche yon rezo...", "Search network...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Networks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNetworks.map((network) => (
              <Card key={network.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="h-5 w-5 text-blue-600" />
                      <span className="truncate">{network.name}</span>
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(network)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(network.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {network.description && (
                    <CardDescription className="text-sm">
                      {network.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-gray-500" />
                        {t("Écoles", "Lekòl yo", "Schools")}
                      </span>
                      <Badge variant="secondary">
                        {getSchoolCount(network.id)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        {t("Capacité", "Kapasite", "Capacity")}
                      </span>
                      <span className="font-medium">
                        {getTotalCapacity(network.id).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {t("Créé le", "Kreye nan", "Created")}
                      </span>
                      <span className="text-gray-500">
                        {new Date(network.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {network.isActive ? (
                      <Badge className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {t("Actif", "Aktif", "Active")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="w-full justify-center">
                        {t("Inactif", "Pa aktif", "Inactive")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNetworks.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm 
                    ? t("Aucun réseau trouvé", "Pa gen rezo yo jwenn", "No networks found")
                    : t("Aucun réseau scolaire", "Pa gen rezo lekòl", "No school networks")
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Total réseaux", "Total rezo", "Total Networks")}
                </CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{networks.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Réseaux actifs", "Rezo aktif yo", "Active Networks")}
                </CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {networks.filter(n => n.isActive).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Écoles en réseau", "Lekòl nan rezo", "Schools in Networks")}
                </CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schools.filter(s => s.schoolNetworkId).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Capacité totale", "Kapasite total", "Total Capacity")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schools.reduce((sum, s) => sum + (s.capacity || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Répartition par réseau", "Repartisyon pa rezo", "Distribution by Network")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Réseau", "Rezo", "Network")}</TableHead>
                    <TableHead>{t("Écoles", "Lekòl yo", "Schools")}</TableHead>
                    <TableHead>{t("Capacité", "Kapasite", "Capacity")}</TableHead>
                    <TableHead>{t("Statut", "Estati", "Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networks.map((network) => (
                    <TableRow key={network.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{network.name}</div>
                          {network.description && (
                            <div className="text-sm text-gray-500">{network.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSchoolCount(network.id)}</TableCell>
                      <TableCell>{getTotalCapacity(network.id).toLocaleString()}</TableCell>
                      <TableCell>
                        {network.isActive ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {t("Actif", "Aktif", "Active")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {t("Inactif", "Pa aktif", "Inactive")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isEditing 
                  ? t("Modifier le réseau", "Modifye rezo a", "Edit Network")
                  : t("Nouveau réseau", "Nouvo rezo", "New Network")
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("Nom du réseau", "Non rezo a", "Network Name")} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
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