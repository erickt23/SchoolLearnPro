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
import LanguageSwitcher from "@/components/language-switcher";
import { GraduationCap, Users, BookOpen, Shield, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("login");

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

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-blue-50">
      <LanguageSwitcher />
      
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Forms */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <GraduationCap className="h-10 w-10 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">EduHaïti</h1>
              </div>
              <h2 className="text-xl text-gray-600">
                {t("Connectez-vous à votre espace", "Konekte nan espas ou a")}
              </h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  {t("Connexion", "Koneksyon")}
                </TabsTrigger>
                <TabsTrigger value="register">
                  {t("Inscription", "Enskripsyon")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Se connecter", "Konekte")}</CardTitle>
                    <CardDescription>
                      {t(
                        "Entrez vos identifiants pour accéder à votre compte",
                        "Antre kòdèntité ou yo pou ou ka antre nan kont ou a"
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
                              <FormLabel>{t("Nom d'utilisateur", "Non itilizatè")}</FormLabel>
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
                              <FormLabel>{t("Mot de passe", "Modpas")}</FormLabel>
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
                              {t("Connexion...", "Ap konekte...")}
                            </>
                          ) : (
                            t("Se connecter", "Konekte")
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Créer un compte", "Kreye yon kont")}</CardTitle>
                    <CardDescription>
                      {t(
                        "Remplissez le formulaire pour créer votre compte",
                        "Ranpli fòm nan pou ou ka kreye kont ou a"
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
                                <FormLabel>{t("Prénom", "Non")}</FormLabel>
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
                                <FormLabel>{t("Nom", "Siyè")}</FormLabel>
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
                              <FormLabel>{t("Nom d'utilisateur", "Non itilizatè")}</FormLabel>
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
                              <FormLabel>{t("Email", "Imèl")}</FormLabel>
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
                              <FormLabel>{t("Rôle", "Wòl")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("Sélectionnez votre rôle", "Chwazi wòl ou")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="student">{t("Élève", "Elèv")}</SelectItem>
                                  <SelectItem value="teacher">{t("Enseignant", "Pwofesè")}</SelectItem>
                                  <SelectItem value="parent">{t("Parent", "Paran")}</SelectItem>
                                  <SelectItem value="admin">{t("Administrateur", "Administratè")}</SelectItem>
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
                              <FormLabel>{t("Mot de passe", "Modpas")}</FormLabel>
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
                              <FormLabel>{t("Confirmer le mot de passe", "Konfime modpas")}</FormLabel>
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
                              {t("Création...", "Ap kreye...")}
                            </>
                          ) : (
                            t("Créer le compte", "Kreye kont lan")
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-8 flex items-center justify-center">
          <div className="max-w-lg text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {t("Bienvenue sur EduHaïti", "Byenveni nan EduHaïti")}
              </h1>
              <p className="text-xl text-blue-100">
                {t(
                  "La plateforme de gestion scolaire conçue pour les écoles haïtiennes",
                  "Platfòm jesyon lekòl ki fèt pou lekòl ayisyen yo"
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1">500+</h3>
                <p className="text-sm text-blue-100">{t("Écoles", "Lekòl")}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1">50k+</h3>
                <p className="text-sm text-blue-100">{t("Élèves", "Elèv")}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1">2k+</h3>
                <p className="text-sm text-blue-100">{t("Enseignants", "Pwofesè")}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1">99.9%</h3>
                <p className="text-sm text-blue-100">{t("Sécurisé", "Sekirize")}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-3">
                {t("Pourquoi choisir EduHaïti ?", "Poukisa chwazi EduHaïti ?")}
              </h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>✓ {t("Interface bilingue français-créole", "Entèfas bileng fransè-kreyòl")}</li>
                <li>✓ {t("Optimisé pour connexions lentes", "Optimize pou koneksyon dousman")}</li>
                <li>✓ {t("Support local en Haïti", "Sipò lokal nan Ayiti")}</li>
                <li>✓ {t("Formation et accompagnement", "Fòmasyon ak akonpayèman")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
