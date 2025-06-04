import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { User, GraduationCap, Users, Search, Plus, Download } from "lucide-react";
import StudentDetails from "@/components/user-management/student-details";
import TeacherDetails from "@/components/user-management/teacher-details";
import ParentDetails from "@/components/user-management/parent-details";

export default function UserManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  // Sample data - in real implementation, this would come from API
  const sampleStudent = {
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@exemple.com",
    studentId: "STU001",
    emergencyContact: "Pierre Dupont",
    phone: "+509 1234-5678",
    classGroup: "5eme",
    room: "A101",
    age: 15,
  };

  const sampleTeacher = {
    firstName: "Jean",
    lastName: "Martin",
    staffId: "STAFF001",
    emergencyContact: "Claire Martin",
    phone: "+509 2345-6789",
    email: "jean.martin@exemple.com",
    courses: ["math", "physics"],
  };

  const sampleParent = {
    firstName: "Sophie",
    lastName: "Bernard",
    parentId: "PAR001",
    phone: "+509 3456-7890",
    email: "sophie.bernard@exemple.com",
    students: ["student1", "student2"],
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsCreating(true);
  };

  const handleUserSelect = (userType: string) => {
    setIsCreating(false);
    switch (userType) {
      case "student":
        setSelectedUser(sampleStudent);
        break;
      case "teacher":
        setSelectedUser(sampleTeacher);
        break;
      case "parent":
        setSelectedUser(sampleParent);
        break;
    }
  };

  const handleSave = (data: any) => {
    console.log("Saving user data:", data);
    setIsCreating(false);
  };

  const handleEdit = () => {
    setIsCreating(true);
  };

  const handleDelete = () => {
    console.log("Deleting user");
    setSelectedUser(null);
    setIsCreating(false);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`);
  };

  const renderUsersList = (userType: string) => {
    const users = [
      { id: 1, name: "Marie Dupont", email: "marie.dupont@exemple.com", status: "active" },
      { id: 2, name: "Jean Baptiste", email: "jean.baptiste@exemple.com", status: "active" },
      { id: 3, name: "Sophie Laurent", email: "sophie.laurent@exemple.com", status: "inactive" },
    ];

    return (
      <div className="space-y-2">
        {users
          .filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((user) => (
            <Card 
              key={user.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleUserSelect(userType)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" 
                      ? t("Actif", "Aktif", "Active")
                      : t("Inactif", "Inaktif", "Inactive")
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t("Gestion des utilisateurs", "Jesyon itilizatè yo", "User Management")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - User Lists */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("Utilisateurs", "Itilizatè yo", "Users")}
                <Button size="sm" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Nouveau", "Nouvo", "New")}
                </Button>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("Rechercher...", "Chèche...", "Search...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="students" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    {t("Étudiants", "Elèv yo", "Students")}
                  </TabsTrigger>
                  <TabsTrigger value="teachers" className="text-xs">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {t("Enseignants", "Pwofesè yo", "Teachers")}
                  </TabsTrigger>
                  <TabsTrigger value="parents" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {t("Parents", "Paran yo", "Parents")}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="students" className="mt-4">
                  {renderUsersList("student")}
                </TabsContent>
                
                <TabsContent value="teachers" className="mt-4">
                  {renderUsersList("teacher")}
                </TabsContent>
                
                <TabsContent value="parents" className="mt-4">
                  {renderUsersList("parent")}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - User Details */}
        <div className="lg:col-span-2">
          {selectedUser || isCreating ? (
            <div>
              {activeTab === "students" && (
                <StudentDetails
                  student={isCreating ? undefined : selectedUser}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={isCreating}
                />
              )}
              {activeTab === "teachers" && (
                <TeacherDetails
                  teacher={isCreating ? undefined : selectedUser}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={isCreating}
                />
              )}
              {activeTab === "parents" && (
                <ParentDetails
                  parent={isCreating ? undefined : selectedUser}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={isCreating}
                />
              )}
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-gray-400 mb-4">
                  <User className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("Sélectionnez un utilisateur", "Chwazi yon itilizatè", "Select a user")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "Choisissez un utilisateur dans la liste pour voir ses détails",
                    "Chwazi yon itilizatè nan lis la pou wè detay li yo",
                    "Choose a user from the list to view their details"
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}