import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { Upload, Download, FileText, Users, GraduationCap, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  success: boolean;
  validRows: number;
  invalidRows: number;
  errors: ValidationError[];
}

export default function BulkImport() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("students");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Expected CSV formats
  const csvFormats = {
    students: {
      columns: [
        t("Nom", "Sènom", "Last Name"),
        t("Prénom", "Non", "First Name"), 
        t("Sexe", "Sèks", "Gender"),
        t("Date de naissance", "Dat nesans", "Birth Date"),
        t("Code", "Kòd", "Code")
      ],
      example: "Dupont,Marie,F,22-12-2014,STU001"
    },
    employees: {
      columns: [
        t("Nom", "Sènom", "Last Name"),
        t("Prénom", "Non", "First Name"),
        t("Email", "Imèl", "Email"),
        t("Rôle", "Wòl", "Role"),
        t("Département", "Depatman", "Department")
      ],
      example: "Martin,Jean,jean.martin@school.com,teacher,Mathematics"
    }
  };

  // Validate CSV file client-side
  const validateCSVFile = (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error(t("Erreur de lecture du fichier", "Erè nan lekti fichye a", "File reading error")));
      reader.readAsText(file);
    });
  };

  const validateCSVContent = (rows: string[][], type: 'students' | 'employees'): ValidationError[] => {
    const errors: ValidationError[] = [];
    const expectedColumns = csvFormats[type].columns;

    // Check if file has content
    if (rows.length < 2) {
      errors.push({
        row: 0,
        field: 'file',
        message: t("Le fichier doit contenir au moins une ligne de données", "Fichye a dwe gen omwen yon liy done", "File must contain at least one data row")
      });
      return errors;
    }

    // Validate header row
    const headers = rows[0];
    if (headers.length !== expectedColumns.length) {
      errors.push({
        row: 1,
        field: 'headers',
        message: t(`Le fichier doit contenir ${expectedColumns.length} colonnes`, `Fichye a dwe gen ${expectedColumns.length} kolòn`, `File must contain ${expectedColumns.length} columns`)
      });
    }

    // Validate data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (row.every(cell => !cell)) continue;

      // Check row length
      if (row.length !== expectedColumns.length) {
        errors.push({
          row: i + 1,
          field: 'length',
          message: t("Nombre de colonnes incorrect", "Kantite kolòn yo pa kòrèk", "Incorrect number of columns")
        });
        continue;
      }

      // Validate required fields
      row.forEach((cell, colIndex) => {
        if (!cell) {
          errors.push({
            row: i + 1,
            field: expectedColumns[colIndex],
            message: t("Champ requis manquant", "Jaden obligatwa a manke", "Required field missing")
          });
        }
      });

      // Validate date format for students (column 3)
      if (type === 'students' && row[3]) {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (!datePattern.test(row[3])) {
          errors.push({
            row: i + 1,
            field: t("Date de naissance", "Dat nesans", "Birth Date"),
            message: t("Format de date invalide (attendu: jj-mm-aaaa)", "Fòma dat la pa bon (ki atann: jj-mm-aaaa)", "Invalid date format (expected: dd-mm-yyyy)")
          });
        }
      }

      // Validate email format for employees (column 2)
      if (type === 'employees' && row[2]) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(row[2])) {
          errors.push({
            row: i + 1,
            field: "Email",
            message: t("Format d'email invalide", "Fòma imèl la pa bon", "Invalid email format")
          });
        }
      }
    }

    return errors;
  };

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File, type: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await apiRequest('POST', `/api/import/${type}`, formData);
      return await response.json();
    },
    onSuccess: (result: ImportResult) => {
      setImportResult(result);
      if (result.success) {
        toast({
          title: t("Import réussi", "Enpòtasyon reyisi", "Import successful"),
          description: t(`${result.validRows} utilisateur(s) importé(s)`, `${result.validRows} itilizatè yo enpòte`, `${result.validRows} user(s) imported`),
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t("Erreur d'import", "Erè nan enpòtasyon", "Import error"),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast({
        title: t("Type de fichier invalide", "Tip fichye a pa bon", "Invalid file type"),
        description: t("Veuillez sélectionner un fichier CSV", "Tanpri chwazi yon fichye CSV", "Please select a CSV file"),
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setValidationErrors([]);
    setImportResult(null);

    try {
      const rows = await validateCSVFile(file);
      const errors = validateCSVContent(rows, activeTab as 'students' | 'employees');
      setValidationErrors(errors);
    } catch (error) {
      toast({
        title: t("Erreur de validation", "Erè nan validasyon", "Validation error"),
        description: t("Impossible de lire le fichier", "Nou pa ka li fichye a", "Cannot read file"),
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    if (!selectedFile || validationErrors.length > 0) return;
    
    importMutation.mutate({
      file: selectedFile,
      type: activeTab
    });
  };

  const downloadTemplate = (type: 'students' | 'employees') => {
    const format = csvFormats[type];
    const csvContent = [
      format.columns.join(','),
      format.example
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${type}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Retour au tableau de bord", "Tounen nan tablo jesyon", "Back to Dashboard")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("Import en masse", "Enpòtasyon an mas", "Bulk Import")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("Importer des utilisateurs via fichiers CSV", "Enpòte itilizatè yo ak fichye CSV", "Import users via CSV files")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                {t("Téléchargement de fichier", "Telechajman fichye", "File Upload")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="students" className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {t("Migration Étudiants", "Migrasyon Elèv yo", "Student Migration")}
                  </TabsTrigger>
                  <TabsTrigger value="employees" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {t("Migration Employés", "Migrasyon Anplwaye yo", "Employee Migration")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("Sélectionner le fichier CSV", "Chwazi fichye CSV la", "Select CSV File")}
                      </label>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {selectedFile && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFile.name}</span>
                        <span>({Math.round(selectedFile.size / 1024)} KB)</span>
                      </div>
                    )}

                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {t("Erreurs de validation trouvées:", "Erè validasyon yo jwenn:", "Validation errors found:")}
                            </p>
                            <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                              {validationErrors.slice(0, 10).map((error, index) => (
                                <li key={index} className="text-xs">
                                  {t(`Ligne ${error.row}`, `Liy ${error.row}`, `Row ${error.row}`)} - {error.field}: {error.message}
                                </li>
                              ))}
                              {validationErrors.length > 10 && (
                                <li className="text-xs italic">
                                  {t(`... et ${validationErrors.length - 10} autres erreurs`, `... ak ${validationErrors.length - 10} lòt erè yo`, `... and ${validationErrors.length - 10} more errors`)}
                                </li>
                              )}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {importResult && (
                      <Alert variant={importResult.success ? "default" : "destructive"}>
                        {importResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription>
                          {importResult.success ? (
                            <p>{t(`Import réussi: ${importResult.validRows} utilisateur(s) importé(s)`, `Enpòtasyon reyisi: ${importResult.validRows} itilizatè yo enpòte`, `Import successful: ${importResult.validRows} user(s) imported`)}</p>
                          ) : (
                            <p>{t(`Import échoué: ${importResult.invalidRows} erreur(s) trouvée(s)`, `Enpòtasyon echwe: ${importResult.invalidRows} erè yo jwenn`, `Import failed: ${importResult.invalidRows} error(s) found`)}</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleImport}
                        disabled={!selectedFile || validationErrors.length > 0 || importMutation.isPending}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {importMutation.isPending 
                          ? t("Import en cours...", "Enpòtasyon kap fèt...", "Importing...") 
                          : t("Importer le fichier", "Enpòte fichye a", "Upload File")
                        }
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadTemplate('students')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t("Modèle", "Modèl", "Template")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="employees" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("Sélectionner le fichier CSV", "Chwazi fichye CSV la", "Select CSV File")}
                      </label>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {selectedFile && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFile.name}</span>
                        <span>({Math.round(selectedFile.size / 1024)} KB)</span>
                      </div>
                    )}

                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {t("Erreurs de validation trouvées:", "Erè validasyon yo jwenn:", "Validation errors found:")}
                            </p>
                            <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                              {validationErrors.slice(0, 10).map((error, index) => (
                                <li key={index} className="text-xs">
                                  {t(`Ligne ${error.row}`, `Liy ${error.row}`, `Row ${error.row}`)} - {error.field}: {error.message}
                                </li>
                              ))}
                              {validationErrors.length > 10 && (
                                <li className="text-xs italic">
                                  {t(`... et ${validationErrors.length - 10} autres erreurs`, `... ak ${validationErrors.length - 10} lòt erè yo`, `... and ${validationErrors.length - 10} more errors`)}
                                </li>
                              )}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {importResult && (
                      <Alert variant={importResult.success ? "default" : "destructive"}>
                        {importResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription>
                          {importResult.success ? (
                            <p>{t(`Import réussi: ${importResult.validRows} utilisateur(s) importé(s)`, `Enpòtasyon reyisi: ${importResult.validRows} itilizatè yo enpòte`, `Import successful: ${importResult.validRows} user(s) imported`)}</p>
                          ) : (
                            <p>{t(`Import échoué: ${importResult.invalidRows} erreur(s) trouvée(s)`, `Enpòtasyon echwe: ${importResult.invalidRows} erè yo jwenn`, `Import failed: ${importResult.invalidRows} error(s) found`)}</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleImport}
                        disabled={!selectedFile || validationErrors.length > 0 || importMutation.isPending}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {importMutation.isPending 
                          ? t("Import en cours...", "Enpòtasyon kap fèt...", "Importing...") 
                          : t("Importer le fichier", "Enpòte fichye a", "Upload File")
                        }
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadTemplate('employees')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t("Modèle", "Modèl", "Template")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Instructions", "Enstriksyon yo", "Instructions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === 'students' ? (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t("Format CSV requis pour les étudiants:", "Fòma CSV ki obligatwa pou elèv yo:", "Required CSV format for students:")}
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>{t("Colonnes:", "Kolòn yo:", "Columns:")}</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {csvFormats.students.columns.map((col, index) => (
                          <li key={index} className="text-xs">{col}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <strong>{t("Format de date:", "Fòma dat:", "Date format:")}</strong>
                      <p className="text-xs mt-1">jj-mm-aaaa (22-12-2014)</p>
                    </div>
                    <div className="text-sm">
                      <strong>{t("Exemple:", "Egzanp:", "Example:")}</strong>
                      <p className="text-xs mt-1 font-mono bg-gray-100 p-2 rounded">
                        {csvFormats.students.example}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t("Format CSV requis pour les employés:", "Fòma CSV ki obligatwa pou anplwaye yo:", "Required CSV format for employees:")}
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>{t("Colonnes:", "Kolòn yo:", "Columns:")}</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {csvFormats.employees.columns.map((col, index) => (
                          <li key={index} className="text-xs">{col}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <strong>{t("Rôles valides:", "Wòl ki valab yo:", "Valid roles:")}</strong>
                      <p className="text-xs mt-1">teacher, admin, staff</p>
                    </div>
                    <div className="text-sm">
                      <strong>{t("Exemple:", "Egzanp:", "Example:")}</strong>
                      <p className="text-xs mt-1 font-mono bg-gray-100 p-2 rounded">
                        {csvFormats.employees.example}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-600 space-y-1">
                <p>• {t("Tous les champs sont obligatoires", "Tout jaden yo obligatwa", "All fields are required")}</p>
                <p>• {t("Aucun doublon n'est autorisé", "Nou pa aksepte doub", "No duplicates allowed")}</p>
                <p>• {t("Encodage UTF-8 recommandé", "Nou rekòmande UTF-8", "UTF-8 encoding recommended")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}