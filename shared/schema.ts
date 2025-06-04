import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("student"), // network_admin, school_admin, teacher, student, parent
  schoolId: integer("school_id").references(() => schools.id),
  schoolNetworkId: integer("school_network_id").references(() => schoolNetworks.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// School Networks table
export const schoolNetworks = pgTable("school_networks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  adminUserId: integer("admin_user_id").references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schools table
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique(), // Code unique pour l'école
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  schoolNetworkId: integer("school_network_id").references(() => schoolNetworks.id),
  adminUserId: integer("admin_user_id").references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(), // Primary, Secondary, etc.
  schoolId: integer("school_id").references(() => schools.id),
  teacherId: integer("teacher_id").references(() => users.id),
  academicYear: text("academic_year").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Students table (extends users with student-specific info)
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  classId: integer("class_id").references(() => classes.id),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  studentId: text("student_id").unique().notNull(), // Custom student ID
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  room: text("room"),
  age: integer("age"),
});

// Teachers table (extends users with teacher-specific info)
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  staffId: text("staff_id").unique().notNull(), // Custom staff ID
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  department: text("department"),
  hireDate: timestamp("hire_date").defaultNow(),
});

// Parents table (extends users with parent-specific info)
export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  parentId: text("parent_id").unique().notNull(), // Custom parent ID
  emergencyPhone: text("emergency_phone"),
  relationship: text("relationship"), // father, mother, guardian, etc.
});

// Teacher-Course assignments (many-to-many)
export const teacherCourses = pgTable("teacher_courses", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => teachers.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
});

// Parent-Student relationships (many-to-many)
export const parentStudents = pgTable("parent_students", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => parents.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

// Grades table
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  grade: decimal("grade", { precision: 5, scale: 2 }).notNull(),
  maxGrade: decimal("max_grade", { precision: 5, scale: 2 }).notNull().default("20"),
  gradeType: text("grade_type").notNull(), // exam, homework, quiz, etc.
  date: timestamp("date").defaultNow().notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // present, absent, late
  reason: text("reason"),
  markedBy: integer("marked_by").references(() => users.id).notNull(),
});

// Courses (E-learning)
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  classId: integer("class_id").references(() => classes.id),
  content: jsonb("content"), // Rich content: videos, texts, PDFs
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  dueDate: timestamp("due_date"),
  maxGrade: decimal("max_grade", { precision: 5, scale: 2 }).notNull().default("20"),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  gradedBy: integer("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id]
  }),
  schoolNetwork: one(schoolNetworks, {
    fields: [users.schoolNetworkId],
    references: [schoolNetworks.id]
  }),
  students: many(students),
  classes: many(classes),
  grades: many(grades),
  attendance: many(attendance),
  courses: many(courses),
  assignments: many(assignments),
  submissions: many(submissions),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const schoolNetworksRelations = relations(schoolNetworks, ({ one, many }) => ({
  admin: one(users, {
    fields: [schoolNetworks.adminUserId],
    references: [users.id]
  }),
  schools: many(schools),
  users: many(users),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  network: one(schoolNetworks, {
    fields: [schools.schoolNetworkId],
    references: [schoolNetworks.id]
  }),
  admin: one(users, {
    fields: [schools.adminUserId],
    references: [users.id]
  }),
  users: many(users),
  classes: many(classes),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  grades: many(grades),
  attendance: many(attendance),
  submissions: many(submissions),
  parentStudents: many(parentStudents),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  teacherCourses: many(teacherCourses),
}));

export const parentsRelations = relations(parents, ({ one, many }) => ({
  user: one(users, {
    fields: [parents.userId],
    references: [users.id],
  }),
  parentStudents: many(parentStudents),
}));

export const teacherCoursesRelations = relations(teacherCourses, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherCourses.teacherId],
    references: [teachers.id],
  }),
  course: one(courses, {
    fields: [teacherCourses.courseId],
    references: [courses.id],
  }),
}));

export const parentStudentsRelations = relations(parentStudents, ({ one }) => ({
  parent: one(parents, {
    fields: [parentStudents.parentId],
    references: [parents.id],
  }),
  student: one(students, {
    fields: [parentStudents.studentId],
    references: [students.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  students: many(students),
  grades: many(grades),
  attendance: many(attendance),
  courses: many(courses),
  assignments: many(assignments),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [courses.subjectId],
    references: [subjects.id],
  }),
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [courses.classId],
    references: [classes.id],
  }),
  assignments: many(assignments),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  subject: one(subjects, {
    fields: [assignments.subjectId],
    references: [subjects.id],
  }),
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  submissions: many(submissions),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  enrollmentDate: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  date: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export const insertSchoolNetworkSchema = createInsertSchema(schoolNetworks).omit({
  id: true,
  createdAt: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  hireDate: true,
});

export const insertParentSchema = createInsertSchema(parents).omit({
  id: true,
});

export const insertTeacherCourseSchema = createInsertSchema(teacherCourses).omit({
  id: true,
});

export const insertParentStudentSchema = createInsertSchema(parentStudents).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SchoolNetwork = typeof schoolNetworks.$inferSelect;
export type InsertSchoolNetwork = z.infer<typeof insertSchoolNetworkSchema>;
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Parent = typeof parents.$inferSelect;
export type InsertParent = z.infer<typeof insertParentSchema>;
export type TeacherCourse = typeof teacherCourses.$inferSelect;
export type InsertTeacherCourse = z.infer<typeof insertTeacherCourseSchema>;
export type ParentStudent = typeof parentStudents.$inferSelect;
export type InsertParentStudent = z.infer<typeof insertParentStudentSchema>;
