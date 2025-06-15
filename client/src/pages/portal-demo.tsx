import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Link, useLocation } from "wouter";
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
import LanguageSwitcher from "@/components/language-switcher-new";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PortalDemo() {
  const { user, loginMutation } = useAuth();
  const { tKey } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ 
    username: "", 
    password: "" 
  });

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(loginData as any);
      setShowLoginForm(false);
      setLocation("/dashboard");
      toast({
        title: tKey("login_success"),
        description: tKey("welcome"),
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
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
                      {tKey("edupro_tagline")}
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
                  {tKey("home")}
                </Button>
              </Link>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <FileText className="h-4 w-4 mr-2" />
                {tKey("about")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Newspaper className="h-4 w-4 mr-2" />
                {tKey("news")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                {tKey("admission")}
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Contact className="h-4 w-4 mr-2" />
                {tKey("contact")}
              </Button>
            </div>

            {/* Language, Theme and Login Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {tKey("login")}
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
                    {tKey("home")}
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  {tKey("about")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Newspaper className="h-4 w-4 mr-2" />
                  {tKey("news")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {tKey("admission")}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Contact className="h-4 w-4 mr-2" />
                  {tKey("contact")}
                </Button>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                  <Button 
                    onClick={() => setShowLoginForm(true)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {tKey("login")}
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
          <div className="absolute inset-0 transition-opacity duration-1000">
            <div 
              className="h-full bg-cover bg-center relative"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/api/placeholder/1200/600)`,
                backgroundColor: '#1e293b'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {tKey("academic_excellence")}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-6 text-gray-200">
                    {tKey("quality_education")}
                  </h2>
                  <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
                    {tKey("quality_education_desc")}
                  </p>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {tKey("learn_more")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  {tKey("news_announcements")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                      School Year 2024-2025 Opening
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Important information about the new school year
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Administration</span>
                      <span>August 15, 2024</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    {tKey("view_all_news")}
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
                  {tKey("edupro_in_numbers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,250+</div>
                    <div className="text-sm text-muted-foreground">
                      {tKey("students")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">75+</div>
                    <div className="text-sm text-muted-foreground">
                      {tKey("teachers")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">25+</div>
                    <div className="text-sm text-muted-foreground">
                      {tKey("classes")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">
                      {tKey("success_rate")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {tKey("quick_links")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {tKey("elearning_platform")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    {tKey("online_admission")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    {tKey("results_grades")}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {tKey("school_calendar")}
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
                    {tKey("school_management_system")}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {tKey("comprehensive_platform")}
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
                {tKey("useful_links")}
              </h4>
              <div className="space-y-2">
                <Link href="/portal">
                  <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                    {tKey("home")}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {tKey("about")}
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {tKey("admission")}
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
                  {tKey("contact")}
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">
                {tKey("contact_info")}
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
                  <span>{tKey("port_au_prince_haiti")}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 EduPro. {tKey("all_rights_reserved")}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-xs">
                {tKey("privacy_policy")}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                {tKey("terms_of_service")}
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
                  {tKey("login")}
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
                {tKey("sign_in")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">
                    {tKey("username")}
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
                    {tKey("password")}
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
                  {loginMutation.isPending ? "Signing in..." : tKey("sign_in")}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Button variant="link" size="sm">
                  {tKey("forgot_password")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}