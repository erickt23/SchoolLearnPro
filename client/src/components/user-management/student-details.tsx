import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { User, Edit, Trash2 } from "lucide-react";

const studentSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  studentId: z.string().min(1, "ID étudiant requis"),
  emergencyContact: z.string().min(1, "Contact d'urgence requis"),
  phone: z.string().min(1, "Numéro de téléphone requis"),
  classGroup: z.string().min(1, "Classe requise"),
  room: z.string().min(1, "Salle requise"),
  age: z.number().min(1, "Âge requis").max(100, "Âge invalide"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentDetailsProps {
  student?: StudentFormData;
  onSave?: (data: StudentFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export default function StudentDetails({ 
  student, 
  onSave, 
  onEdit, 
  onDelete, 
  isEditing = false 
}: StudentDetailsProps) {
  const { t } = useLanguage();
  const [editMode, setEditMode] = useState(isEditing);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      emergencyContact: "",
      phone: "",
      classGroup: "",
      room: "",
      age: 0,
    },
  });

  const onSubmit = (data: StudentFormData) => {
    onSave?.(data);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setEditMode(false);
    form.reset(student);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t("Détails de l'étudiant", "Detay elèv la", "Student Details")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Prénom", "Non", "First Name")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Nom", "Siyati", "Last Name")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Adresse email", "Adrès email", "Email Address")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ID Étudiant", "ID Elèv", "Student ID")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Contact d'urgence", "Kontak ijans", "Emergency Contact")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Numéro de téléphone", "Nimewo telefòn", "Phone Number")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Classe", "Klas", "Class")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!editMode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Sélectionner une classe", "Chwazi yon klas", "Select a class")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6eme">6ème</SelectItem>
                        <SelectItem value="5eme">5ème</SelectItem>
                        <SelectItem value="4eme">4ème</SelectItem>
                        <SelectItem value="3eme">3ème</SelectItem>
                        <SelectItem value="seconde">Seconde</SelectItem>
                        <SelectItem value="premiere">Première</SelectItem>
                        <SelectItem value="terminale">Terminale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Salle", "Sal", "Room")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!editMode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Sélectionner une salle", "Chwazi yon sal", "Select a room")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A101">A101</SelectItem>
                        <SelectItem value="A102">A102</SelectItem>
                        <SelectItem value="B201">B201</SelectItem>
                        <SelectItem value="B202">B202</SelectItem>
                        <SelectItem value="C301">C301</SelectItem>
                        <SelectItem value="C302">C302</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Âge", "Laj", "Age")}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        disabled={!editMode}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Notes Section */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("Notes", "Nòt yo", "Notes")}
              </h3>
              <div className="bg-gray-50 p-4 rounded border min-h-[100px] text-gray-600">
                {t(
                  "Ajouter des notes supplémentaires sur l'étudiant...",
                  "Ajoute nòt siplimantè sou elèv la...",
                  "Add additional notes about the student..."
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {editMode ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    {t("Annuler", "Anile", "Cancel")}
                  </Button>
                  <Button type="submit">
                    {t("Enregistrer", "Anrejistre", "Save")}
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("Modifier", "Modifye", "Edit")}
                  </Button>
                  <Button type="button" variant="destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("Supprimer", "Efase", "Delete")}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}