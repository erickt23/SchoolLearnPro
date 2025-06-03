import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <section className="bg-gradient-to-br from-primary/5 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="block">
                    {t("Modernisez votre", "Modènize")}
                  </span>
                  <span className="text-primary">
                    {t("gestion scolaire", "jesyon lekòl")}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t(
                    "Plateforme tout-en-un adaptée aux réalités haïtiennes : gestion administrative, e-learning, et communication parents-école.",
                    "Platfòm konplè ki adapte ak reyalite ayisyen yo: jesyon administratif, aprann sou entènèt, ak kominikasyon paran-lekòl."
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => setLocation("/auth")}
                >
                  <span className="mr-2">
                    {t("Essai gratuit 30 jours", "Eseye gratis 30 jou")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  {t("Voir la démo", "Gade demo a")}
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-600">{t("Écoles", "Lekòl")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50k+</div>
                  <div className="text-sm text-gray-600">{t("Élèves", "Elèv")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">99.9%</div>
                  <div className="text-sm text-gray-600">{t("Disponibilité", "Disponibilite")}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t("Optimisé pour connexions lentes", "Optimize pou koneksyon ki rete yo")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t("Interface bilingue", "Entèfas de lang")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-lg mb-4">
                <h3 className="font-semibold">
                  {t("Tableau de Bord Enseignant", "Tablo Jesyon Pwofesè")}
                </h3>
                <p className="text-sm opacity-90">Prof. Marie Dupont</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">32</div>
                  <div className="text-sm text-gray-600">{t("Élèves", "Elèv yo")}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-gray-600">{t("Présents", "Prezan yo")}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{t("Devoir de Mathématiques", "Devwa Matematik")}</span>
                  <Badge variant="secondary">24</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{t("Cours Français", "Kou Fransè")}</span>
                  <Badge variant="secondary">18</Badge>
                </div>
              </div>
            </div>

            {/* Floating cards for visual enhancement */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t("Progression", "Pwogresyon")}</div>
                  <div className="text-xs text-gray-500">+24% ce mois</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t("Actifs en ligne", "Aktif sou entènèt")}</div>
                  <div className="text-xs text-gray-500">247 utilisateurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
