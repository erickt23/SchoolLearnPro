import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher-new";
import { GraduationCap, Users, BookOpen, Shield, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "student",
    },
  });

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LanguageSwitcher />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left side - Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">EduHaïti</h1>
              </div>
              <p className="text-gray-600">
                {t(
                  "Connectez-vous à votre espace éducatif",
                  "Konekte nan espas edikasyon ou an",
                  "Connect to your educational space"
                )}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  {t("Connexion", "Koneksyon", "Login")}
                </TabsTrigger>
                <TabsTrigger value="register">
                  {t("Inscription", "Enskripsyon", "Register")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("Se connecter", "Konekte", "Sign In")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "Accédez à votre compte EduHaïti",
                        "Antre nan kont EduHaïti ou an",
                        "Access your EduHaiti account"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Nom d'utilisateur", "Non itilizatè", "Username")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Mot de passe", "Modpas", "Password")}
                              </FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("Connexion...", "Kap konekte...", "Signing in...")}
                            </>
                          ) : (
                            t("Se connecter", "Konekte", "Sign In")
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("Créer un compte", "Kreye yon kont", "Create Account")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "Rejoignez la communauté EduHaïti",
                        "Vin nan kominote EduHaïti an",
                        "Join the EduHaiti community"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("Prénom", "Premye non", "First Name")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("Nom", "Dezyèm non", "Last Name")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Nom d'utilisateur", "Non itilizatè", "Username")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Rôle", "Wòl", "Role")}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="student">
                                    {t("Élève", "Elèv", "Student")}
                                  </SelectItem>
                                  <SelectItem value="teacher">
                                    {t("Enseignant", "Pwofesè", "Teacher")}
                                  </SelectItem>
                                  <SelectItem value="parent">
                                    {t("Parent", "Paran", "Parent")}
                                  </SelectItem>
                                  <SelectItem value="admin">
                                    {t("Administrateur", "Administratè", "Administrator")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Mot de passe", "Modpas", "Password")}
                              </FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Confirmer le mot de passe", "Konfime modpas la", "Confirm Password")}
                              </FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("Création...", "Kap kreye...", "Creating...")}
                            </>
                          ) : (
                            t("Créer le compte", "Kreye kont lan", "Create Account")
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Hero Section */}
          <div className="hidden lg:block">
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {t(
                    "Transformez l'éducation en Haïti",
                    "Transfòme edikasyon nan Ayiti",
                    "Transform education in Haiti"
                  )}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {t(
                    "Une plateforme complète pour la gestion scolaire moderne",
                    "Yon platfòm konplè pou jesyon lekòl modèn",
                    "A complete platform for modern school management"
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                  <Users className="h-12 w-12 text-blue-600" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("Gestion des utilisateurs", "Jesyon itilizatè yo", "User Management")}
                    </h3>
                    <p className="text-gray-600">
                      {t(
                        "Élèves, enseignants, parents et administrateurs",
                        "Elèv yo, pwofesè yo, paran yo ak administratè yo",
                        "Students, teachers, parents and administrators"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                  <BookOpen className="h-12 w-12 text-green-600" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("E-learning intégré", "E-learning entegre", "Integrated E-learning")}
                    </h3>
                    <p className="text-gray-600">
                      {t(
                        "Cours en ligne et ressources éducatives",
                        "Kou sou entènèt ak resous edikasyon yo",
                        "Online courses and educational resources"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                  <Shield className="h-12 w-12 text-purple-600" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("Sécurisé et fiable", "Sekirite ak konfyans", "Secure and Reliable")}
                    </h3>
                    <p className="text-gray-600">
                      {t(
                        "Protection des données et accès contrôlé",
                        "Pwoteksyon done yo ak aksè kontwole",
                        "Data protection and controlled access"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}