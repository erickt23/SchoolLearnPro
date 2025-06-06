import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Link, useLocation } from "wouter";
import type { InsertUser } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Users,
  BookOpen,
  Calendar,
  Award,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Bell,
  User,
  LogIn,
  UserPlus,
  Home,
  Newspaper,
  FileText,
  Contact
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  publishedAt: Date;
  author: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'academic' | 'cultural' | 'sports' | 'administrative';
}

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta?: {
    text: string;
    link: string;
  };
}

export default function PortalPage() {
  const { user, loginMutation } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ 
    username: "", 
    password: "" 
  });

  // Mock data for demonstration
  const slides: Slide[] = [
    {
      id: "1",
      title: t("Excellence Académique", "Ekselans Akademik", "Academic Excellence"),
      subtitle: t("Formation de Qualité", "Fòmasyon Kalite", "Quality Education"),
      description: t("Nous offrons une éducation de qualité supérieure pour préparer nos étudiants au succès.", "Nou bay yon edikasyon kalite segondè pou prepare etidyan nou yo pou siksè.", "We provide superior quality education to prepare our students for success."),
      image: "/api/placeholder/1200/600",
      cta: {
        text: t("En savoir plus", "Konnen plis", "Learn More"),
        link: "/about"
      }
    },
    {
      id: "2",
      title: t("Technologie Moderne", "Teknoloji Modèn", "Modern Technology"),
      subtitle: t("Apprentissage Numérique", "Aprantisaj Dijital", "Digital Learning"),
      description: t("Nos plateformes e-learning modernes facilitent l'apprentissage à distance et l'interaction.", "Platfòm e-learning modèn nou yo fasilite aprantisaj adistans ak entèraksyon.", "Our modern e-learning platforms facilitate distance learning and interaction."),
      image: "/api/placeholder/1200/600",
      cta: {
        text: t("Découvrir", "Dekouvri", "Discover"),
        link: "/elearning"
      }
    },
    {
      id: "3",
      title: t("Communauté Scolaire", "Kominote Lekòl", "School Community"),
      subtitle: t("Ensemble vers l'Excellence", "Ansanm vè Ekselans", "Together Towards Excellence"),
      description: t("Une communauté unie d'étudiants, enseignants et parents travaillant ensemble.", "Yon kominote ini etidyan yo, pwofesè yo ak paran yo k ap travay ansanm.", "A united community of students, teachers and parents working together."),
      image: "/api/placeholder/1200/600",
      cta: {
        text: t("Rejoindre", "Rantre", "Join Us"),
        link: "/admission"
      }
    }
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: t("Rentrée Scolaire 2024-2025", "Kòmansman Lekòl 2024-2025", "School Year 2024-2025 Opening"),
      excerpt: t("Informations importantes sur la nouvelle année scolaire", "Enfòmasyon enpòtan sou nouvo ane lekòl la", "Important information about the new school year"),
      content: "...",
      publishedAt: new Date("2024-08-15"),
      author: "Direction"
    },
    {
      id: "2",
      title: t("Nouveau Programme E-learning", "Nouvo Pwogram E-learning", "New E-learning Program"),
      excerpt: t("Lancement de notre plateforme d'apprentissage en ligne", "Lansè platfòm aprantisaj sou entènèt nou an", "Launch of our online learning platform"),
      content: "...",
      publishedAt: new Date("2024-08-10"),
      author: "Équipe Technologie"
    },
    {
      id: "3",
      title: t("Concours National de Sciences", "Konkou Nasyonal Syans", "National Science Competition"),
      excerpt: t("Nos étudiants remportent le premier prix", "Etidyan nou yo gen premye pri a", "Our students win first prize"),
      content: "...",
      publishedAt: new Date("2024-08-05"),
      author: "Département Sciences"
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: t("Réunion Parents-Professeurs", "Reyinyon Paran-Pwofesè", "Parent-Teacher Meeting"),
      description: t("Rencontre trimestrielle avec les familles", "Rankont tou twa mwa ak fanmi yo", "Quarterly meeting with families"),
      date: new Date("2024-09-15"),
      location: t("Salle de Conférence", "Sal Konferans", "Conference Hall"),
      type: "administrative"
    },
    {
      id: "2",
      title: t("Festival Culturel", "Festival Kiltirèl", "Cultural Festival"),
      description: t("Célébration de la diversité culturelle", "Selebrasyon divèsite kiltirèl la", "Celebration of cultural diversity"),
      date: new Date("2024-09-22"),
      location: t("Cour de l'École", "Lakou Lekòl la", "School Courtyard"),
      type: "cultural"
    },
    {
      id: "3",
      title: t("Compétition Sportive", "Konpetisyon Espò", "Sports Competition"),
      description: t("Tournoi inter-classes de football", "Tounwa nan mitan klas yo pou foutbòl", "Inter-class football tournament"),
      date: new Date("2024-09-29"),
      location: t("Terrain de Sport", "Teren Espò", "Sports Field"),
      type: "sports"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({
        username: loginData.username,
        password: loginData.password
      } as any);
      setShowLoginForm(false);
      setLocation("/dashboard");
      toast({
        title: t("Connexion réussie", "Koneksyon rèsi", "Login successful"),
        description: t("Bienvenue !", "Byenveni !", "Welcome!"),
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'academic': return 'bg-blue-500';
      case 'cultural': return 'bg-purple-500';
      case 'sports': return 'bg-green-500';
      case 'administrative': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(t('fr-FR', 'ht-HT', 'en-US'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-card shadow-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and School Info */}
            <div className="flex items-center space-x-4">
              <Link href="/portal">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-xl font-bold text-primary">EduPro</h1>
                    <p className="text-xs text-muted-foreground">
                      {t("Excellence • Innovation • Réussite", "Ekselans • Inovasyon • Siksè", "Excellence • Innovation • Success")}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/portal">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Home className="h-4 w-4 mr-2" />
                  {t("Accueil", "Akèy", "Home")}
                </Button>
              </Link>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <FileText className="h-4 w-4 mr-2" />
                {t("À Propos", "Konsènan", "About")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Newspaper className="h-4 w-4 mr-2" />
                {t("Actualités", "Nouvel", "News")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                {t("Admission", "Admisyon", "Admission")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Contact className="h-4 w-4 mr-2" />
                {t("Contact", "Kontak", "Contact")}
              </Button>
            </div>

            {/* Login Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t("Se connecter", "Konekte", "Login")}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
                <Link href="/portal">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2" />
                    {t("Accueil", "Akèy", "Home")}
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("À Propos", "Konsènan", "About")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Newspaper className="h-4 w-4 mr-2" />
                  {t("Actualités", "Nouvel", "News")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("Admission", "Admisyon", "Admission")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Contact className="h-4 w-4 mr-2" />
                  {t("Contact", "Kontak", "Contact")}
                </Button>
                <div className="pt-2">
                  <Button 
                    onClick={() => setShowLoginForm(true)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("Se connecter", "Konekte", "Login")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="h-full bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                  backgroundColor: '#1e293b' // fallback color
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl mb-6 text-gray-200">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                    {slide.cta && (
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        {slide.cta.text}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* News and Articles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="h-5 w-5 mr-2" />
                  {t("Actualités & Annonces", "Nouvel ak Anonse", "News & Announcements")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {newsArticles.map((article) => (
                    <div key={article.id} className="border-b border-border pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{article.author}</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    {t("Voir toutes les actualités", "Gade tout nouvel yo", "View All News")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("EduPro en Chiffres", "EduPro nan Chif", "EduPro in Numbers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,250+</div>
                    <div className="text-sm text-muted-foreground">
                      {t("Étudiants", "Etidyan", "Students")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">75+</div>
                    <div className="text-sm text-muted-foreground">
                      {t("Enseignants", "Pwofesè", "Teachers")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">25+</div>
                    <div className="text-sm text-muted-foreground">
                      {t("Classes", "Klas", "Classes")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">
                      {t("Réussite", "Siksè", "Success Rate")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {t("Événements à Venir", "Evènman k ap Vini", "Upcoming Events")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getEventTypeColor(event.type)} text-white`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    {t("Voir le calendrier complet", "Gade kalandriye konplè a", "View Full Calendar")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("Liens Rapides", "Lyen Rapid", "Quick Links")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t("Plateforme E-learning", "Platfòm E-learning", "E-learning Platform")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    {t("Admission en Ligne", "Admisyon sou Entènèt", "Online Admission")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    {t("Résultats & Notes", "Rezilta ak Nòt", "Results & Grades")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("Calendrier Scolaire", "Kalandriye Lekòl", "School Calendar")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* School Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold text-primary">EduPro</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Système de Gestion Scolaire", "Sistèm Jesyon Lekòl", "School Management System")}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {t(
                  "Une plateforme complète de gestion scolaire conçue pour l'excellence éducative en Haïti.",
                  "Yon platfòm konplè jesyon lekòl ki fèt pou ekselans edikasyon an nan Ayiti.",
                  "A comprehensive school management platform designed for educational excellence in Haiti."
                )}
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">
                {t("Liens Utiles", "Lyen Itil", "Useful Links")}
              </h4>
              <div className="space-y-2">
                <Link href="/portal">
                  <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                    {t("Accueil", "Akèy", "Home")}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {t("À Propos", "Konsènan", "About")}
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {t("Admission", "Admisyon", "Admission")}
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {t("Contact", "Kontak", "Contact")}
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">
                {t("Contact", "Kontak", "Contact")}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+509 1234-5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@edupro.ht</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{t("Port-au-Prince, Haïti", "Pòtoprens, Ayiti", "Port-au-Prince, Haiti")}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 EduPro. {t("Tous droits réservés.", "Tout dwa yo rezève.", "All rights reserved.")}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-xs">
                {t("Politique de Confidentialité", "Politik Konfidansyalite", "Privacy Policy")}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                {t("Conditions d'Utilisation", "Kondisyon Itilizasyon", "Terms of Use")}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  {t("Connexion", "Koneksyon", "Login")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {t("Connectez-vous à votre compte", "Konekte nan kont ou", "Sign in to your account")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">
                    {t("Nom d'utilisateur", "Non itilizatè", "Username")}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    {t("Mot de passe", "Modpas", "Password")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    t("Connexion...", "K ap konekte...", "Signing in...")
                  ) : (
                    t("Se connecter", "Konekte", "Sign In")
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Button variant="link" size="sm">
                  {t("Mot de passe oublié ?", "Bliye modpas?", "Forgot password?")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}