import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
  Receipt,
  AlertTriangle,
  Smartphone
} from "lucide-react";

export default function PaymentModule() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const mockPayments = [
    {
      id: 1,
      student: "Jean Dupont",
      amount: 15000,
      currency: "HTG",
      type: "Frais de scolarité",
      dueDate: "2025-01-15",
      status: "paid",
      paymentDate: "2025-01-10",
      method: "Moncash"
    },
    {
      id: 2,
      student: "Marie Claire",
      amount: 8500,
      currency: "HTG", 
      type: "Frais d'examen",
      dueDate: "2025-01-20",
      status: "pending",
      paymentDate: null,
      method: null
    },
    {
      id: 3,
      student: "Pierre Joseph",
      amount: 12000,
      currency: "HTG",
      type: "Frais de transport",
      dueDate: "2025-01-18",
      status: "overdue",
      paymentDate: null,
      method: null
    }
  ];

  const mockPaymentMethods = [
    { id: "moncash", name: "Moncash", icon: "📱", available: true },
    { id: "card", name: "Carte bancaire", icon: "💳", available: true },
    { id: "bank", name: "Virement bancaire", icon: "🏦", available: true },
    { id: "cash", name: "Espèces", icon: "💵", available: true }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("Payé", "Peye", "Paid")}
        </Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          {t("En attente", "Ap tann", "Pending")}
        </Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          {t("En retard", "An reta", "Overdue")}
        </Badge>;
      default:
        return null;
    }
  };

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
              {t("Gestion des paiements", "Jesyon peman yo", "Payment Management")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Frais scolaires et paiements", "Frè lekòl ak peman yo", "School fees and payments")}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("Exporter", "Ekspòte", "Export")}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <DollarSign className="h-4 w-4 mr-2" />
            {t("Nouveau paiement", "Nouvo peman", "New Payment")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("Vue d'ensemble", "Akèylan", "Overview")}</TabsTrigger>
          <TabsTrigger value="payments">{t("Paiements", "Peman yo", "Payments")}</TabsTrigger>
          <TabsTrigger value="methods">{t("Méthodes", "Metòd yo", "Methods")}</TabsTrigger>
          <TabsTrigger value="reports">{t("Rapports", "Rapò yo", "Reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Total des revenus", "Total revni yo", "Total Revenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450,000 HTG</div>
                <p className="text-xs text-muted-foreground">
                  +12% {t("par rapport au mois dernier", "depi mwa pase a", "from last month")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Paiements en attente", "Peman k ap tann", "Pending Payments")}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  {t("À traiter", "Pou trete", "To process")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Paiements en retard", "Peman an reta", "Overdue Payments")}
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">23</div>
                <p className="text-xs text-muted-foreground">
                  {t("Nécessitent un suivi", "Bezwen swivi", "Need follow-up")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Taux de collection", "To koleksyon", "Collection Rate")}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">
                  +3% {t("ce mois-ci", "mwa sa a", "this month")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Paiements récents", "Peman resan yo", "Recent Payments")}</CardTitle>
              <CardDescription>
                {t("Dernières transactions effectuées", "Dènye tranzaksyon yo", "Latest completed transactions")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Receipt className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{payment.student}</p>
                        <p className="text-sm text-gray-500">{payment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{payment.amount.toLocaleString()} {payment.currency}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Payment List */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Liste des paiements", "Lis peman yo", "Payment List")}</CardTitle>
              <CardDescription>
                {t("Gérer tous les paiements des étudiants", "Jere tout peman elèv yo", "Manage all student payments")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.student}</p>
                        <p className="text-sm text-gray-500">{payment.type}</p>
                        <p className="text-xs text-gray-400">
                          {t("Échéance", "Delè", "Due")}: {payment.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">{payment.amount.toLocaleString()} {payment.currency}</p>
                      {getStatusBadge(payment.status)}
                      {payment.method && (
                        <p className="text-xs text-gray-500">{payment.method}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        {t("Voir", "Gade", "View")}
                      </Button>
                      {payment.status !== "paid" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          {t("Payer", "Peye", "Pay")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id} className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedPaymentMethod === method.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span>{method.name}</span>
                    {method.available && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {t("Disponible", "Disponib", "Available")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    {t("Sélectionner", "Chwazi", "Select")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          {selectedPaymentMethod && (
            <Card>
              <CardHeader>
                <CardTitle>{t("Effectuer un paiement", "Fè yon peman", "Make Payment")}</CardTitle>
                <CardDescription>
                  {t("Méthode sélectionnée", "Metòd yo chwazi", "Selected method")}: {mockPaymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student">{t("Étudiant", "Elèv", "Student")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Sélectionner un étudiant", "Chwazi yon elèv", "Select student")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jean">Jean Dupont</SelectItem>
                        <SelectItem value="marie">Marie Claire</SelectItem>
                        <SelectItem value="pierre">Pierre Joseph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">{t("Montant", "Kantite", "Amount")}</Label>
                    <Input id="amount" placeholder="0.00" type="number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">{t("Type de frais", "Kalite frè", "Fee Type")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Sélectionner le type", "Chwazi kalite a", "Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">{t("Frais de scolarité", "Frè lekòl", "Tuition fees")}</SelectItem>
                      <SelectItem value="exam">{t("Frais d'examen", "Frè egzamen", "Exam fees")}</SelectItem>
                      <SelectItem value="transport">{t("Frais de transport", "Frè transpò", "Transport fees")}</SelectItem>
                      <SelectItem value="uniform">{t("Frais d'uniforme", "Frè inifòm", "Uniform fees")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("Procéder au paiement", "Kontinye ak peman an", "Proceed to Payment")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Financial Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Rapport mensuel", "Rapò pa mwa", "Monthly Report")}</CardTitle>
                <CardDescription>
                  {t("Résumé des paiements du mois", "Rezime peman mwa a", "Monthly payment summary")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("Total collecté", "Total yo kolekte", "Total collected")}:</span>
                    <span className="font-medium">1,890,000 HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("En attente", "Ap tann", "Pending")}:</span>
                    <span className="font-medium">340,000 HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("En retard", "An reta", "Overdue")}:</span>
                    <span className="font-medium text-red-600">220,000 HTG</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t("Télécharger le rapport", "Telechaje rapò a", "Download Report")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Analyse par méthode", "Analiz pa metòd", "Payment Method Analysis")}</CardTitle>
                <CardDescription>
                  {t("Répartition des paiements", "Repartisyon peman yo", "Payment distribution")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Moncash:</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Carte bancaire", "Kat bank", "Bank card")}:</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Espèces", "Lajan cash", "Cash")}:</span>
                    <span className="font-medium">25%</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t("Rapport détaillé", "Rapò detaye", "Detailed Report")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}