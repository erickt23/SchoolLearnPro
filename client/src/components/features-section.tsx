import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { 
  Users, 
  FileText, 
  Laptop, 
  ClipboardCheck, 
  MessageSquare, 
  CreditCard,
  CheckCircle
} from "lucide-react";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t("Gestion Académique", "Jesyon Akademik"),
      description: t(
        "Gestion complète des utilisateurs, classes, salles et emplois du temps avec système de rôles avancé.",
        "Jesyon konplè itilizatè yo, klas yo, sal yo ak emploi du temps yo ak sistèm wòl avanse."
      ),
      items: [
        t("Classes et emplois du temps", "Klas ak orè yo"),
        t("Gestion des salles", "Jesyon sal yo"),
        t("Attribution des cours", "Distribisyon kou yo"),
        t("Calendrier scolaire", "Kalandriye lekòl")
      ],
      color: "primary"
    },
    {
      icon: FileText,
      title: t("Notes & Évaluations", "Nòt ak Evalyasyon"),
      description: t(
        "Système complet de notation avec génération automatique de bulletins et relevés de notes en PDF.",
        "Sistèm konplè notasyon ak jenerasyon otomatik bilten ak relve nòt yo nan PDF."
      ),
      items: [
        t("Saisie de notes en ligne", "Antre nòt sou entènèt"),
        t("Bulletins automatiques", "Bilten otomatik"),
        t("Palmarès et classements", "Klasman ak rekònnèsans"),
        t("Relevés PDF", "Dokiman PDF")
      ],
      color: "green"
    },
    {
      icon: Laptop,
      title: t("Module E-Learning", "Modil E-Learning"),
      description: t(
        "Plateforme d'apprentissage à distance avec cours, devoirs, quiz et suivi de progression.",
        "Platfòm aprann nan distans ak kou yo, devwa yo, quiz ak suivi de pwogresyon."
      ),
      items: [
        t("Cours interactifs", "Kou entèraktif"),
        t("Quiz et exercices", "Quiz ak egzèsis"),
        t("Vidéoconférences", "Videokonferans"),
        t("Suivi de progression", "Swiv pwogresyon")
      ],
      color: "orange"
    },
    {
      icon: MessageSquare,
      title: t("Communication", "Kominikasyon"),
      description: t(
        "Messagerie sécurisée entre enseignants, parents et élèves avec notifications push.",
        "Mesajri sekirize ant pwofesè yo, paran yo ak elèv yo ak notifikasyon push."
      ),
      items: [
        t("Messagerie sécurisée", "Mesaje sekirize"),
        t("Notifications parents", "Notifikasyon paran"),
        t("Annonces officielles", "Anonse ofisyèl"),
        t("Chat en temps réel", "Chat nan moman an")
      ],
      color: "purple"
    },
    {
      icon: ClipboardCheck,
      title: t("Gestion Disciplinaire", "Jesyon Disiplin"),
      description: t(
        "Suivi des présences, retards, infractions et notes disciplinaires avec rapports détaillés.",
        "Swiv prezans yo, reta yo, enfrak syon yo ak nòt disiplinè yo ak rapò detaye."
      ),
      items: [
        t("Suivi des présences", "Swiv prezans"),
        t("Gestion des retards", "Jesyon reta yo"),
        t("Infractions disciplinaires", "Vyolasyon disiplin"),
        t("Rapports détaillés", "Rapò detaye")
      ],
      color: "red"
    },
    {
      icon: CreditCard,
      title: t("Économat & Paiements", "Ekonoma ak Peyman"),
      description: t(
        "Gestion financière complète avec paiements en ligne via MonCash et cartes bancaires.",
        "Jesyon finansyè konplè ak peman yo sou entènèt nan MonCash ak kat bank yo."
      ),
      items: [
        t("Paiements MonCash", "Peyman MonCash"),
        t("Cartes bancaires", "Kat bank yo"),
        t("Factures automatiques", "Faktè otomatik"),
        t("Rapports financiers", "Rapò finansye")
      ],
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return "bg-primary/10 text-primary";
      case "green": return "bg-green-100 text-green-600";
      case "orange": return "bg-orange-100 text-orange-600";
      case "purple": return "bg-purple-100 text-purple-600";
      case "red": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getItemColorClasses = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "green": return "text-green-600";
      case "orange": return "text-orange-600";
      case "purple": return "text-purple-600";
      case "red": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t("Fonctionnalités complètes", "Karakteristik konplè yo")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t(
              "Tout ce dont vous avez besoin pour digitaliser votre établissement scolaire.",
              "Tout sa ou bezwen pou dijitalize lekòl ou a."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`p-4 rounded-xl w-fit mb-6 ${getColorClasses(feature.color)}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-3">
                      <CheckCircle className={`h-4 w-4 ${getItemColorClasses(feature.color)}`} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-8 lg:p-12 rounded-2xl text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                {t("Optimisé pour Haïti", "Optimize pou Ayiti")}
              </h3>
              <p className="text-lg mb-6 opacity-90">
                {t(
                  "Conçu spécifiquement pour les défis locaux : connexions limitées, paiements mobiles, et interface bilingue.",
                  "Fèt espesyalman pou defi lokal yo: koneksyon limite, peyman mobil, ak entèfas bileng."
                )}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t("Fonctionne même avec une connexion lente", "Fonksyone menm ak koneksyon dousman")}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t("Intégration MonCash native", "Entegrasyon MonCash natirèl")}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t("Interface bilingue FR/HT", "Entèfas bileng FR/HT")}</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-4">
                {t("Statistiques d'utilisation", "Estatistik itilizasyon")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm opacity-90">{t("Satisfaction", "Satisfaksyon")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2s</div>
                  <div className="text-sm opacity-90">{t("Temps de charge", "Tan chaje")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">{t("Support", "Sipò")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm opacity-90">{t("Uptime", "Disponibilite")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
