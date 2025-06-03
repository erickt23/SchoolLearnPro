import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Navigation() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "#features", label: t("Fonctionnalités", "Fonksyonalite yo") },
    { href: "#demo", label: t("Démonstration", "Demonstrasyon") },
    { href: "#contact", label: t("Contact", "Kontak") },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-primary">EduHaïti</h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-600 hover:text-primary"
                >
                  {item.label}
                </Button>
              ))}
              <Button onClick={() => setLocation("/auth")}>
                {t("Connexion", "Konekte")}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-600 hover:text-primary justify-start"
                >
                  {item.label}
                </Button>
              ))}
              <Button 
                onClick={() => {
                  setLocation("/auth");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                {t("Connexion", "Konekte")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
