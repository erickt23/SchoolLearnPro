import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Star, Wifi, Globe, Download, GraduationCap, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher-new";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const testimonials = [
    {
      name: "Marie-Claire Joseph",
      role: t("Directrice, École Sainte-Marie", "Direktè, Lekòl Sainte-Marie", "Principal, Sainte-Marie School"),
      content: t(
        "EduHaïti a transformé notre gestion scolaire. Les parents peuvent maintenant suivre les progrès de leurs enfants en temps réel.",
        "EduHaïti chanje jesyon lekòl nou an. Paran yo kap gade pwogre pitit yo nan moman yo ye a.",
        "EduHaiti has transformed our school management. Parents can now track their children's progress in real time."
      ),
      rating: 5
    },
    {
      name: "Prof. Nadège Pierre",
      role: t("Enseignante, Collège Moderne", "Pwofesè, Collège Moderne", "Teacher, Modern College"),
      content: t(
        "L'interface trilingue facilite énormément mon travail. Je peux communiquer avec tous mes élèves dans leur langue préférée.",
        "Entèfas twa lang lan fasil travay mwen anpil. Mwen ka kominike ak tout elèv mwen yo nan lang yo pi renmen an.",
        "The trilingual interface makes my work much easier. I can communicate with all my students in their preferred language."
      ),
      rating: 5
    },
    {
      name: "Jean-Baptiste Moïse",
      role: t("Administrateur, Institut Saint-Louis", "Administratè, Institut Saint-Louis", "Administrator, Saint-Louis Institute"),
      content: t(
        "Enfin une solution adaptée à la réalité haïtienne ! Le support hors ligne est indispensable dans notre contexte.",
        "Finalman yon solisyon ki adapte ak reyalite ayisyen an! Sipò san entènèt la trè enpòtan nan kontèks nou an.",
        "Finally a solution adapted to the Haitian reality! Offline support is essential in our context."
      ),
      rating: 5
    }
  ];

  const features = [
    {
      icon: Wifi,
      title: t("Faible Bande Passante", "Ti Koneksyon", "Low Bandwidth"),
      description: t(
        "Interface optimisée pour connexions 2G/3G avec compression avancée",
        "Entèfas optimize pou koneksyon 2G/3G ak konpresyon avanse",
        "Interface optimized for 2G/3G connections with advanced compression"
      )
    },
    {
      icon: Globe,
      title: t("Support Multilingue", "Sipò Plizyè Lang", "Multilingual Support"),
      description: t(
        "Français, Créole et Anglais intégrés avec traduction automatique",
        "Fransè, Kreyòl ak Angle entegre ak tradiksyon otomatik",
        "French, Creole and English integrated with automatic translation"
      )
    },
    {
      icon: Download,
      title: t("Accès Hors Ligne", "Aksè San Entènèt", "Offline Access"),
      description: t(
        "Synchronisation automatique des données dès connexion rétablie",
        "Senkronizasyon otomatik done yo depi koneksyon an retabli",
        "Automatic data synchronization once connection is restored"
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LanguageSwitcher />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <GraduationCap className="h-16 w-16 text-yellow-300 mr-4" />
              <h1 className="text-4xl sm:text-6xl font-bold">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  EduHaïti
                </span>
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t(
                "La première plateforme éducative conçue spécialement pour Haïti",
                "Premye platfòm edikasyon an ki fèt espesyalman pou Ayiti",
                "The first educational platform designed specifically for Haiti"
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-3"
                onClick={() => setLocation("/auth")}
              >
                {t("Commencer Gratuitement", "Kòmanse Gratis", "Start Free")}
              </Button>
              
              <div className="flex items-center gap-2 text-blue-100">
                <Users className="h-5 w-5" />
                <span>{t("Déjà utilisé par 50+ écoles", "Deja itilize pa 50+ lekòl yo", "Already used by 50+ schools")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("Fonctionnalités Complètes", "Fonksyon Konplè yo", "Complete Features")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "Une solution tout-en-un pour la gestion scolaire moderne",
                "Yon solisyon tout-nan-youn pou jesyon lekòl modèn",
                "An all-in-one solution for modern school management"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("Gestion des Élèves", "Jesyon Elèv yo", "Student Management")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "Suivi complet des inscriptions, notes et présences",
                    "Swiv konplè enskripsyon yo, nòt yo ak prezans yo",
                    "Complete tracking of enrollments, grades and attendance"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("E-Learning Intégré", "E-Learning Entegre", "Integrated E-Learning")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "Cours en ligne, devoirs et évaluations numériques",
                    "Kou sou entènèt, devoir ak evalyasyon dijital yo",
                    "Online courses, assignments and digital assessments"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("Communication Parents", "Kominikasyon Paran yo", "Parent Communication")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "Messagerie instantanée et notifications automatiques",
                    "Mesaj enstantane ak notifikasyon otomatik yo",
                    "Instant messaging and automatic notifications"
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("Témoignages", "Temwayaj yo", "Testimonials")}
            </h2>
            <p className="text-xl text-gray-600">
              {t(
                "Ce que disent nos utilisateurs",
                "Sa itilizatè nou yo ap di",
                "What our users are saying"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t(
              "Prêt à transformer votre école ?",
              "Pare pou transfòme lekòl ou a?",
              "Ready to transform your school?"
            )}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t(
              "Rejoignez les centaines d'écoles qui font confiance à EduHaïti",
              "Vin ak santèn lekòl ki fè konfyans ak EduHaïti",
              "Join the hundreds of schools that trust EduHaiti"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              onClick={() => setLocation("/auth")}
            >
              {t("Commencer Maintenant", "Kòmanse Kounye a", "Start Now")}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              {t("Demander une Démo", "Mande yon Demo", "Request Demo")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}