import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Wifi,
  Shield,
  Smartphone,
  Globe,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";

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
        "La fonctionnalité e-learning nous a permis de continuer les cours même pendant les périodes difficiles. Excellent outil !",
        "Fonksyon e-learning lan pèmèt nou kontinye kou yo menm nan moman ki difisil yo. Ekselan zouti !",
        "The e-learning functionality allowed us to continue classes even during difficult periods. Excellent tool!"
      ),
      rating: 5
    },
    {
      name: "Jean-Baptiste René",
      role: t("Administrateur, Institut Saint-Louis", "Administratè, Institut Saint-Louis"),
      content: t(
        "Interface intuitive et support excellent. L'équipe comprend vraiment les besoins des écoles haïtiennes.",
        "Entèfas ki fasil ak sètèn ekselan. Ekip la konprann vrèman bezwen lekòl ayisyen yo."
      ),
      rating: 5
    }
  ];

  const techSpecs = [
    {
      icon: Wifi,
      title: t("Faible Bande Passante", "Faible Bande Passante"),
      description: t(
        "Interface optimisée pour connexions 2G/3G avec compression avancée",
        "Entèfas optimize pou koneksyon 2G/3G ak konpresyon avanse"
      )
    },
    {
      icon: Globe,
      title: t("Bilinguisme", "Bilengis"),
      description: t(
        "Interface complète en français et créole haïtien avec basculement instantané",
        "Entèfas konplè nan fransè ak kreyòl ayisyen ak chanjman enstan"
      )
    },
    {
      icon: Smartphone,
      title: t("Mobile First", "Mobile First"),
      description: t(
        "Conception prioritaire pour smartphones avec interface tactile optimisée",
        "Konsèp priyoritè pou smartphone yo ak entèfas taktil optimize"
      )
    },
    {
      icon: Shield,
      title: t("Sécurité Locale", "Sekirite Lokal"),
      description: t(
        "Conformité aux normes haïtiennes de protection des données et chiffrement renforcé",
        "Konfòmite ak nòm ayisyen yo pou pwoteksyon done yo ak chifrement ranfòse"
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LanguageSwitcher />
      <Navigation />
      <HeroSection />
      
      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("Une plateforme, quatre perspectives", "Yon platfòm, kat pèspektiv")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "Chaque utilisateur dispose d'un tableau de bord adapté à ses besoins spécifiques.",
                "Chak itilizatè gen yon tablo de bò ki adapte ak bezwen yo."
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary text-white p-4 rounded-xl w-fit mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t("Administration", "Administrasyon")}
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>{t("Gestion des utilisateurs", "Jesyon itilizatè yo")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>{t("Rapports financiers", "Rapò finansye")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>{t("Configuration système", "Konfigirasyon sistèm")}</span>
                  </li>
                </ul>
                <Button variant="link" className="text-primary p-0">
                  {t("Voir les fonctionnalités →", "Gade karakteristik yo →")}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-green-600 text-white p-4 rounded-xl w-fit mb-6">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t("Enseignants", "Pwofesè yo")}
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>{t("Création de cours", "Kreye kou yo")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>{t("Notation en ligne", "Notasyon sou entènèt")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>{t("Suivi des présences", "Swiv prezans yo")}</span>
                  </li>
                </ul>
                <Button variant="link" className="text-green-600 p-0">
                  {t("Voir les fonctionnalités →", "Gade karakteristik yo →")}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-orange-600 text-white p-4 rounded-xl w-fit mb-6">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t("Élèves", "Elèv yo")}
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-orange-600 mt-1" />
                    <span>{t("Cours interactifs", "Kou entèraktif yo")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-orange-600 mt-1" />
                    <span>{t("Devoirs numériques", "Devwa dijital yo")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-orange-600 mt-1" />
                    <span>{t("Résultats instantanés", "Rezilta rapidman")}</span>
                  </li>
                </ul>
                <Button variant="link" className="text-orange-600 p-0">
                  {t("Voir les fonctionnalités →", "Gade karakteristik yo →")}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-purple-600 text-white p-4 rounded-xl w-fit mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t("Parents", "Paran yo")}
                </h3>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-1" />
                    <span>{t("Suivi des progrès", "Swiv pwogre yo")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-1" />
                    <span>{t("Communication directe", "Kominikasyon dirèk")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-1" />
                    <span>{t("Paiements en ligne", "Peye sou entènèt")}</span>
                  </li>
                </ul>
                <Button variant="link" className="text-purple-600 p-0">
                  {t("Voir les fonctionnalités →", "Gade karakteristik yo →")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("Optimisé pour Haïti", "Optimize pou Ayiti")}
            </h2>
            <p className="text-xl text-gray-600">
              {t(
                "Conçu spécifiquement pour les défis technologiques locaux",
                "Ki fèt sitèlman pou defi teknolojik lokal yo"
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techSpecs.map((spec, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <spec.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {spec.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("Ils nous font confiance", "Yo fè nou konfyans")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "Découvrez ce que disent nos utilisateurs à travers Haïti.",
                "Dekouvri sa itilizatè nou yo nan tout Ayiti ap di."
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t("Prêt à Moderniser Votre École?", "Pare pou Modènize Lekòl Ou a?")}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t(
              "Rejoignez les écoles haïtiennes qui ont déjà fait le choix de l'innovation pédagogique",
              "Vin jwenn lekòl ayisyen yo ki te deja fè chwa inovasyon pedagojik la"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-50"
              onClick={() => setLocation("/auth")}
            >
              {t("Commencer l'essai gratuit", "Kòmanse eseye gratis")}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              {t("Planifier une démonstration", "Planifye yon demonstrasyon")}
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            {t(
              "Essai gratuit de 30 jours • Aucune carte de crédit requise • Support en français et créole",
              "Eseye gratis 30 jou • Pa gen kat kredi obligatwa • Sipò nan fransè ak kreyòl"
            )}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold">EduHaïti</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {t(
                  "La plateforme de gestion scolaire conçue pour les écoles haïtiennes, alliant innovation technologique et réalités locales.",
                  "Platfòm jesyon lekòl ki fèt pou lekòl ayisyen yo, ki rasanble inovasyon teknolojik ak reyalite lokal yo."
                )}
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <i className="fab fa-facebook text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <i className="fab fa-twitter text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <i className="fab fa-linkedin text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <i className="fab fa-youtube text-xl"></i>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t("Produit", "Pwodwi")}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Fonctionnalités", "Fonksyonalite yo")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Tarifs", "Pri yo")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Sécurité", "Sekirite")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("API", "API")}</Button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t("Support", "Sipò")}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Documentation", "Dokiman")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Centre d'aide", "Sant èd")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Formation", "Fòmasyon")}</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">{t("Contact", "Kontak")}</Button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                {t(
                  "© 2024 Kalitek Solutions. Tous droits réservés.",
                  "© 2024 Kalitek Solutions. Tout dwa yo rezève."
                )}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                  {t("Politique de confidentialité", "Politik konfidansyalite")}
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                  {t("Conditions d'utilisation", "Kondisyon itilizasyon")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
