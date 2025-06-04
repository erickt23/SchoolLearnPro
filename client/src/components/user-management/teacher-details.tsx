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
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/use-language";
import { GraduationCap, Edit, Trash2 } from "lucide-react";

const teacherSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  staffId: z.string().min(1, "ID personnel requis"),
  emergencyContact: z.string().min(1, "Contact d'urgence requis"),
  phone: z.string().min(1, "Numéro de téléphone requis"),
  email: z.string().email("Email invalide"),
  courses: z.array(z.string()).min(1, "Au moins un cours requis"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherDetailsProps {
  teacher?: TeacherFormData;
  onSave?: (data: TeacherFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

const availableCourses = [
  { id: "math", name: "Mathématiques" },
  { id: "french", name: "Français" },
  { id: "english", name: "Anglais" },
  { id: "science", name: "Sciences" },
  { id: "history", name: "Histoire" },
  { id: "geography", name: "Géographie" },
  { id: "physics", name: "Physique" },
  { id: "chemistry", name: "Chimie" },
  { id: "biology", name: "Biologie" },
  { id: "pe", name: "Éducation Physique" },
];

export default function TeacherDetails({ 
  teacher, 
  onSave, 
  onEdit, 
  onDelete, 
  isEditing = false 
}: TeacherDetailsProps) {
  const { t } = useLanguage();
  const [editMode, setEditMode] = useState(isEditing);

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher || {
      firstName: "",
      lastName: "",
      staffId: "",
      emergencyContact: "",
      phone: "",
      email: "",
      courses: [],
    },
  });

  const onSubmit = (data: TeacherFormData) => {
    onSave?.(data);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setEditMode(false);
    form.reset(teacher);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {t("Détails du personnel", "Detay anplwaye a", "Staff Details")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-gray-400" />
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
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ID Personnel", "ID Anplwaye", "Staff ID")}</FormLabel>
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
            </div>

            {/* Courses Section */}
            <div>
              <FormField
                control={form.control}
                name="courses"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        {t("Cours", "Kou yo", "Courses")}
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableCourses.map((course) => (
                        <FormField
                          key={course.id}
                          control={form.control}
                          name="courses"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={course.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, course.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== course.id
                                            )
                                          )
                                    }}
                                    disabled={!editMode}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {course.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
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
                  "Ajouter des notes supplémentaires sur l'enseignant...",
                  "Ajoute nòt siplimantè sou pwofesè a...",
                  "Add additional notes about the teacher..."
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