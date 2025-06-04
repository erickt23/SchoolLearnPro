import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Search, Download, ChevronUp, ChevronDown, Users, Filter } from "lucide-react";
import { Link } from "wouter";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

type SortField = 'firstName' | 'lastName' | 'username' | 'role';
type SortDirection = 'asc' | 'desc';

export default function UsersTable() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from API
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  // Role translation function
  const translateRole = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return t("Administrateur", "Administratè", "Administrator");
      case 'teacher':
        return t("Enseignant", "Pwofesè", "Teacher");
      case 'student':
        return t("Élève", "Elèv", "Student");
      case 'parent':
        return t("Parent", "Paran", "Parent");
      default:
        return role;
    }
  };

  // Role badge color function
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'teacher':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'student':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'parent':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
      
      return matchesSearch && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      t("Prénom", "Non", "First Name"),
      t("Nom", "Sènom", "Last Name"),
      t("Nom d'utilisateur", "Non itilizatè", "Username"),
      t("Rôle", "Wòl", "Role"),
      t("Email", "Imèl", "Email"),
      t("Statut", "Estati", "Status")
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedUsers.map(user => [
        user.firstName,
        user.lastName,
        user.username,
        translateRole(user.role),
        user.email,
        user.isActive ? t("Actif", "Aktif", "Active") : t("Inactif", "Inaktif", "Inactive")
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            {t("Erreur lors du chargement des utilisateurs", "Erè nan chajman itilizatè yo", "Error loading users")}
          </div>
        </div>
      </div>
    );
  }

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
              {t("Gestion des utilisateurs", "Jesyon itilizatè yo", "User Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Gérer les utilisateurs du système", "Jere itilizatè sistèm nan", "Manage system users")}
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          {t("Exporter CSV", "Ekspòte CSV", "Export CSV")}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {t("Filtres et recherche", "Filtè ak rechèch", "Filters and Search")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("Rechercher par nom ou nom d'utilisateur...", "Chèche pa non oswa non itilizatè...", "Search by name or username...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("Filtrer par rôle", "Filtè pa wòl", "Filter by role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Tous les rôles", "Tout wòl yo", "All roles")}</SelectItem>
                <SelectItem value="admin">{t("Administrateur", "Administratè", "Administrator")}</SelectItem>
                <SelectItem value="teacher">{t("Enseignant", "Pwofesè", "Teacher")}</SelectItem>
                <SelectItem value="student">{t("Élève", "Elèv", "Student")}</SelectItem>
                <SelectItem value="parent">{t("Parent", "Paran", "Parent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t("Liste des utilisateurs", "Lis itilizatè yo", "User List")}
            </CardTitle>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t(`${filteredAndSortedUsers.length} utilisateur(s)`, `${filteredAndSortedUsers.length} itilizatè`, `${filteredAndSortedUsers.length} user(s)`)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {t("Aucun utilisateur trouvé", "Pa gen itilizatè yo jwenn", "No users found")}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleSort('firstName')}
                      >
                        <div className="flex items-center">
                          {t("Prénom", "Non", "First Name")}
                          <SortIcon field="firstName" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleSort('lastName')}
                      >
                        <div className="flex items-center">
                          {t("Nom", "Sènom", "Last Name")}
                          <SortIcon field="lastName" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleSort('username')}
                      >
                        <div className="flex items-center">
                          {t("Nom d'utilisateur", "Non itilizatè", "Username")}
                          <SortIcon field="username" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center">
                          {t("Rôle", "Wòl", "Role")}
                          <SortIcon field="role" />
                        </div>
                      </TableHead>
                      <TableHead>{t("Email", "Imèl", "Email")}</TableHead>
                      <TableHead>{t("Statut", "Estati", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{user.firstName}</TableCell>
                        <TableCell className="font-medium">{user.lastName}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{user.username}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {translateRole(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? t("Actif", "Aktif", "Active") : t("Inactif", "Inaktif", "Inactive")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t(
                      `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} sur ${filteredAndSortedUsers.length} résultats`,
                      `Ap montre ${(currentPage - 1) * itemsPerPage + 1} nan ${Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} sou ${filteredAndSortedUsers.length} rezilta`,
                      `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of ${filteredAndSortedUsers.length} results`
                    )}
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