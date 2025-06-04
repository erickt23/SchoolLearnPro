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
import { Users, Edit, Trash2 } from "lucide-react";

const parentSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  parentId: z.string().min(1, "ID parent requis"),
  phone: z.string().min(1, "Numéro de téléphone requis"),
  email: z.string().email("Email invalide"),
  students: z.array(z.string()).min(1, "Au moins un étudiant requis"),
});

type ParentFormData = z.infer<typeof parentSchema>;

interface ParentDetailsProps {
  parent?: ParentFormData;
  onSave?: (data: ParentFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

const availableStudents = [
  { id: "student1", name: "Marie Dupont" },
  { id: "student2", name: "Jean Baptiste" },
  { id: "student3", name: "Sophie Laurent" },
  { id: "student4", name: "Pierre Martin" },
  { id: "student5", name: "Claire Moreau" },
  { id: "student6", name: "Thomas Bernard" },
  { id: "student7", name: "Emma Dubois" },
  { id: "student8", name: "Lucas Petit" },
];

export default function ParentDetails({ 
  parent, 
  onSave, 
  onEdit, 
  onDelete, 
  isEditing = false 
}: ParentDetailsProps) {
  const { t } = useLanguage();
  const [editMode, setEditMode] = useState(isEditing);

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: parent || {
      firstName: "",
      lastName: "",
      parentId: "",
      phone: "",
      email: "",
      students: [],
    },
  });

  const onSubmit = (data: ParentFormData) => {
    onSave?.(data);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setEditMode(false);
    form.reset(parent);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("Détails du parent", "Detay paran an", "Parent Details")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
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
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ID Parent", "ID Paran", "Parent ID")}</FormLabel>
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("Adresse email", "Adrès email", "Email Address")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={!editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Students Section */}
            <div>
              <FormField
                control={form.control}
                name="students"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        {t("Étudiants", "Elèv yo", "Students")}
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableStudents.map((student) => (
                        <FormField
                          key={student.id}
                          control={form.control}
                          name="students"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={student.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(student.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, student.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== student.id
                                            )
                                          )
                                    }}
                                    disabled={!editMode}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {student.name}
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
                  "Ajouter des notes supplémentaires sur le parent...",
                  "Ajoute nòt siplimantè sou paran an...",
                  "Add additional notes about the parent..."
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