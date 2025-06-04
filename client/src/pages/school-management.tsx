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
  School as SchoolIcon, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Check,
  X
} from "lucide-react";
import type { School, InsertSchool, SchoolNetwork } from "@shared/schema";

interface SchoolFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  schoolNetworkId: number | null;
  principalName: string;
  establishedYear: number;
  capacity: number;
  description: string;
}

export default function SchoolManagement() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    schoolNetworkId: null,
    principalName: "",
    establishedYear: new Date().getFullYear(),
    capacity: 0,
    description: ""
  });

  // Fetch schools
  const { data: schools = [], isLoading } = useQuery<School[]>({
    queryKey: ['/api/schools'],
    queryFn: async () => {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      return response.json();
    },
  });

  // Fetch school networks
  const { data: networks = [] } = useQuery<SchoolNetwork[]>({
    queryKey: ['/api/school-networks'],
    queryFn: async () => {
      const response = await fetch('/api/school-networks');
      if (!response.ok) throw new Error('Failed to fetch networks');
      return response.json();
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: SchoolFormData) => {
      const url = isEditing ? `/api/schools/${editingId}` : '/api/schools';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schools'] });
      resetForm();
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: isEditing 
          ? t("École modifiée avec succès", "Lekòl la modifye ak siksè", "School updated successfully")
          : t("École créée avec succès", "Lekòl la kreye ak siksè", "School created successfully"),
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
      await apiRequest('DELETE', `/api/schools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schools'] });
      toast({
        title: t("Succès", "Siksè", "Success"),
        description: t("École supprimée avec succès", "Lekòl la efase ak siksè", "School deleted successfully"),
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      website: "",
      schoolNetworkId: null,
      principalName: "",
      establishedYear: new Date().getFullYear(),
      capacity: 0,
      description: ""
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (school: School) => {
    setFormData({
      name: school.name,
      address: school.address || "",
      city: school.city || "",
      phone: school.phone || "",
      email: school.email || "",
      website: school.website || "",
      schoolNetworkId: school.schoolNetworkId,
      principalName: school.principalName || "",
      establishedYear: school.establishedYear || new Date().getFullYear(),
      capacity: school.capacity || 0,
      description: school.description || ""
    });
    setIsEditing(true);
    setEditingId(school.id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("Êtes-vous sûr de vouloir supprimer cette école?", "Èske w sèten w vle efase lekòl sa a?", "Are you sure you want to delete this school?"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: t("Erreur de validation", "Erè nan validasyon", "Validation error"),
        description: t("Le nom de l'école est requis", "Non lekòl la obligatwa", "School name is required"),
        variant: "destructive"
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesNetwork = selectedNetwork === "all" || 
                          (selectedNetwork === "none" && !school.schoolNetworkId) ||
                          school.schoolNetworkId?.toString() === selectedNetwork;
    return matchesSearch && matchesNetwork;
  });

  const getNetworkName = (networkId: number | null) => {
    if (!networkId) return t("Indépendante", "Endepandan", "Independent");
    const network = networks.find(n => n.id === networkId);
    return network?.name || t("Réseau inconnu", "Rezo enkoni", "Unknown network");
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
              {t("Gestion des écoles", "Jesyon lekòl yo", "School Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Gérer les établissements scolaires", "Jere etablisman lekòl yo", "Manage educational institutions")}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("Nouvelle école", "Nouvo lekòl", "New School")}
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("Liste des écoles", "Lis lekòl yo", "School List")}</TabsTrigger>
          <TabsTrigger value="stats">{t("Statistiques", "Estatistik", "Statistics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("Filtres", "Filt yo", "Filters")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="search">{t("Rechercher", "Chèche", "Search")}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder={t("Nom de l'école ou ville...", "Non lekòl oswa vil...", "School name or city...")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>{t("Réseau scolaire", "Rezo lekòl", "School Network")}</Label>
                  <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Tous les réseaux", "Tout rezo yo", "All networks")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("Tous les réseaux", "Tout rezo yo", "All networks")}</SelectItem>
                      <SelectItem value="none">{t("Écoles indépendantes", "Lekòl endepandan yo", "Independent schools")}</SelectItem>
                      {networks.map((network) => (
                        <SelectItem key={network.id} value={network.id.toString()}>
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schools Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("Écoles", "Lekòl yo", "Schools")} ({filteredSchools.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("École", "Lekòl", "School")}</TableHead>
                    <TableHead>{t("Réseau", "Rezo", "Network")}</TableHead>
                    <TableHead>{t("Localisation", "Kote", "Location")}</TableHead>
                    <TableHead>{t("Contact", "Kontak", "Contact")}</TableHead>
                    <TableHead>{t("Capacité", "Kapasite", "Capacity")}</TableHead>
                    <TableHead>{t("Actions", "Aksyon yo", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{school.name}</div>
                          {school.principalName && (
                            <div className="text-sm text-gray-500">
                              {t("Directeur", "Direktè", "Principal")}: {school.principalName}
                            </div>
                          )}
                          {school.establishedYear && (
                            <div className="text-xs text-gray-400">
                              {t("Fondée en", "Etabli nan", "Est.")}: {school.establishedYear}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={school.schoolNetworkId ? "default" : "secondary"}>
                          {getNetworkName(school.schoolNetworkId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {school.address && (
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              {school.address}
                            </div>
                          )}
                          {school.city && (
                            <div className="text-sm text-gray-500">{school.city}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {school.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {school.phone}
                            </div>
                          )}
                          {school.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {school.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {school.capacity ? `${school.capacity} ${t("élèves", "elèv", "students")}` : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(school)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(school.id)}>
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
                  {t("Total écoles", "Total lekòl", "Total Schools")}
                </CardTitle>
                <SchoolIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schools.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Écoles en réseau", "Lekòl nan rezo", "Network Schools")}
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
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
                  {t("Écoles indépendantes", "Lekòl endepandan", "Independent Schools")}
                </CardTitle>
                <SchoolIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schools.filter(s => !s.schoolNetworkId).length}
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
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isEditing 
                  ? t("Modifier l'école", "Modifye lekòl la", "Edit School")
                  : t("Nouvelle école", "Nouvo lekòl", "New School")
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("Nom de l'école", "Non lekòl la", "School Name")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="principalName">{t("Nom du directeur", "Non direktè a", "Principal Name")}</Label>
                    <Input
                      id="principalName"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">{t("Adresse", "Adrès", "Address")}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{t("Ville", "Vil", "City")}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t("Téléphone", "Telefòn", "Phone")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("Email", "Imèl", "Email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="website">{t("Site web", "Sit entènèt", "Website")}</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="establishedYear">{t("Année de fondation", "Ane etablisman", "Established Year")}</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">{t("Capacité", "Kapasite", "Capacity")}</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="schoolNetworkId">{t("Réseau scolaire", "Rezo lekòl", "School Network")}</Label>
                  <Select 
                    value={formData.schoolNetworkId?.toString() || ""} 
                    onValueChange={(value) => setFormData({ ...formData, schoolNetworkId: value ? parseInt(value) : null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Sélectionner un réseau", "Chwazi yon rezo", "Select a network")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("École indépendante", "Lekòl endepandan", "Independent school")}</SelectItem>
                      {networks.map((network) => (
                        <SelectItem key={network.id} value={network.id.toString()}>
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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