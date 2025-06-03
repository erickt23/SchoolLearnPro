// Centralized translations for the application
export const translations = {
  // Navigation and Common
  "EduHaïti": {
    fr: "EduHaïti",
    ht: "EduAyiti", 
    en: "EduHaiti"
  },
  "Se connecter": {
    fr: "Se connecter",
    ht: "Konekte",
    en: "Sign In"
  },
  "Créer un compte": {
    fr: "Créer un compte", 
    ht: "Kreye yon kont",
    en: "Create Account"
  },
  "Déconnexion": {
    fr: "Déconnexion",
    ht: "Dekonekte", 
    en: "Sign Out"
  },
  "Tableau de bord": {
    fr: "Tableau de bord",
    ht: "Tablo jesyon",
    en: "Dashboard"
  },

  // Landing Page
  "Plateforme complète de gestion scolaire": {
    fr: "Plateforme complète de gestion scolaire avec e-learning intégré, adaptée au contexte haïtien",
    ht: "Platfòm konplè jesyon lekòl ak e-learning entegre, ki adapte pou kontèks ayisyen an",
    en: "Complete school management platform with integrated e-learning, tailored for the Haitian context"
  },
  
  // Auth Page
  "Connexion": {
    fr: "Connexion",
    ht: "Koneksyon",
    en: "Login"
  },
  "Inscription": {
    fr: "Inscription", 
    ht: "Enskripsyon",
    en: "Registration"
  },
  "Nom d'utilisateur": {
    fr: "Nom d'utilisateur",
    ht: "Non itilizatè",
    en: "Username"
  },
  "Mot de passe": {
    fr: "Mot de passe",
    ht: "Mo de pas",
    en: "Password"
  },
  "Email": {
    fr: "Email",
    ht: "Imel", 
    en: "Email"
  },
  "Prénom": {
    fr: "Prénom",
    ht: "Non",
    en: "First Name"
  },
  "Nom": {
    fr: "Nom",
    ht: "Siyatè",
    en: "Last Name"
  },
  "Rôle": {
    fr: "Rôle",
    ht: "Wòl",
    en: "Role"
  },

  // Roles
  "Administrateur de réseau": {
    fr: "Administrateur de réseau",
    ht: "Administratè rezo",
    en: "Network Administrator"
  },
  "Administrateur d'école": {
    fr: "Administrateur d'école", 
    ht: "Administratè lekòl",
    en: "School Administrator"
  },
  "Enseignant": {
    fr: "Enseignant",
    ht: "Pwofesè",
    en: "Teacher"
  },
  "Élève": {
    fr: "Élève",
    ht: "Elèv",
    en: "Student"
  },
  "Parent": {
    fr: "Parent",
    ht: "Paran",
    en: "Parent"
  },

  // Multi-tenant fields
  "École": {
    fr: "École",
    ht: "Lekòl",
    en: "School"
  },
  "Réseau d'écoles": {
    fr: "Réseau d'écoles",
    ht: "Rezo lekòl yo",
    en: "School Network"
  },
  "Sélectionner une école": {
    fr: "Sélectionner une école",
    ht: "Chwazi yon lekòl", 
    en: "Select a school"
  },
  "Sélectionner un réseau": {
    fr: "Sélectionner un réseau",
    ht: "Chwazi yon rezo",
    en: "Select a network"
  },

  // Features
  "Gestion des élèves": {
    fr: "Gestion des élèves",
    ht: "Jesyon elèv yo",
    en: "Student Management"
  },
  "Suivi des notes": {
    fr: "Suivi des notes", 
    ht: "Swiv nòt yo",
    en: "Grade Tracking"
  },
  "Présences": {
    fr: "Présences",
    ht: "Prezans",
    en: "Attendance"
  },
  "E-learning": {
    fr: "E-learning",
    ht: "E-learning", 
    en: "E-learning"
  },
  "Communication": {
    fr: "Communication",
    ht: "Kominikasyon",
    en: "Communication"
  },

  // Dashboard sections
  "Mes classes": {
    fr: "Mes classes",
    ht: "Klas yo mwen",
    en: "My Classes"
  },
  "Mes cours": {
    fr: "Mes cours",
    ht: "Kou yo mwen", 
    en: "My Courses"
  },
  "Mes devoirs": {
    fr: "Mes devoirs",
    ht: "Devwa yo mwen",
    en: "My Assignments"
  },
  "Statistiques": {
    fr: "Statistiques",
    ht: "Estatistik",
    en: "Statistics"
  },

  // Form validation
  "Ce champ est requis": {
    fr: "Ce champ est requis",
    ht: "Jaden sa a obligatwa",
    en: "This field is required"
  },
  "Email invalide": {
    fr: "Email invalide",
    ht: "Imel pa bon",
    en: "Invalid email"
  },
  "Mot de passe trop court": {
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    ht: "Mo de pas la dwe gen omwen 6 karaktè",
    en: "Password must be at least 6 characters"
  },

  // Messages
  "Connexion réussie": {
    fr: "Connexion réussie",
    ht: "Koneksyon reyisi",
    en: "Login successful"
  },
  "Compte créé avec succès": {
    fr: "Compte créé avec succès",
    ht: "Kont kreye ak siksè",
    en: "Account created successfully"
  },
  "Erreur lors de la connexion": {
    fr: "Erreur lors de la connexion",
    ht: "Erè nan koneksyon an",
    en: "Login error"
  },

  // Testimonials
  "Directrice, École Sainte-Marie": {
    fr: "Directrice, École Sainte-Marie",
    ht: "Direktè, Lekòl Sainte-Marie",
    en: "Principal, Sainte-Marie School"
  },
  "Enseignante, Collège Moderne": {
    fr: "Enseignante, Collège Moderne",
    ht: "Pwofesè, Collège Moderne", 
    en: "Teacher, Modern College"
  },
  "Administrateur, Institut Saint-Louis": {
    fr: "Administrateur, Institut Saint-Louis",
    ht: "Administratè, Institut Saint-Louis",
    en: "Administrator, Saint-Louis Institute"
  }
};

export type TranslationKey = keyof typeof translations;
export type Language = 'fr' | 'ht' | 'en';

export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[key]?.[language] || translations[key]?.fr || key;
}