import { 
  users, students, classes, subjects, grades, attendance, 
  courses, assignments, submissions, messages, schools, schoolNetworks,
  teachers, parents, teacherCourses, parentStudents,
  type User, type InsertUser, type Student, type InsertStudent,
  type Class, type InsertClass, type Subject, type InsertSubject,
  type Grade, type InsertGrade, type Attendance, type InsertAttendance,
  type Course, type InsertCourse, type Assignment, type InsertAssignment,
  type Submission, type InsertSubmission, type Message, type InsertMessage,
  type School, type InsertSchool, type SchoolNetwork, type InsertSchoolNetwork,
  type Teacher, type InsertTeacher, type Parent, type InsertParent,
  type TeacherCourse, type ParentStudent
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // School Network management
  getSchoolNetworks(): Promise<SchoolNetwork[]>;
  getSchoolNetwork(id: number): Promise<SchoolNetwork | undefined>;
  createSchoolNetwork(network: InsertSchoolNetwork): Promise<SchoolNetwork>;

  // School management
  getSchools(): Promise<School[]>;
  getSchool(id: number): Promise<School | undefined>;
  getSchoolsByNetwork(networkId: number): Promise<School[]>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: number, school: Partial<InsertSchool>): Promise<School | undefined>;

  // Student management
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getStudentsByClass(classId: number): Promise<Student[]>;

  // Class management
  getClass(id: number): Promise<Class | undefined>;
  getClasses(): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined>;
  getClassesByTeacher(teacherId: number): Promise<Class[]>;

  // Subject management
  getSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Grade management
  getGradesByStudent(studentId: number): Promise<Grade[]>;
  getGradesByClass(classId: number): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;

  // Attendance management
  getAttendanceByStudent(studentId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]>;
  getAttendanceByClass(classId: number, date: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;

  // Course management (E-learning)
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByTeacher(teacherId: number): Promise<Course[]>;
  getCoursesByClass(classId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Assignment management
  getAssignments(): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]>;
  getAssignmentsByClass(classId: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;

  // Submission management
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: number, submission: Partial<InsertSubmission>): Promise<Submission | undefined>;

  // Message management
  getMessagesByUser(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Teacher management
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeacherByUserId(userId: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;

  // Parent management
  getParents(): Promise<Parent[]>;
  getParent(id: number): Promise<Parent | undefined>;
  getParentByUserId(userId: number): Promise<Parent | undefined>;
  createParent(parent: InsertParent): Promise<Parent>;
  updateParent(id: number, parent: Partial<InsertParent>): Promise<Parent | undefined>;

  // Teacher-Course relationships
  getTeacherCourses(teacherId: number): Promise<TeacherCourse[]>;
  assignCourseToTeacher(teacherId: number, courseId: number): Promise<TeacherCourse>;
  removeCourseFromTeacher(teacherId: number, courseId: number): Promise<void>;

  // Parent-Student relationships
  getParentStudents(parentId: number): Promise<ParentStudent[]>;
  assignStudentToParent(parentId: number, studentId: number): Promise<ParentStudent>;
  removeStudentFromParent(parentId: number, studentId: number): Promise<void>;

  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users).orderBy(asc(users.firstName), asc(users.lastName));
    return result as User[];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // School Network methods
  async getSchoolNetworks(): Promise<SchoolNetwork[]> {
    return await db.select().from(schoolNetworks);
  }

  async getSchoolNetwork(id: number): Promise<SchoolNetwork | undefined> {
    const [network] = await db.select().from(schoolNetworks).where(eq(schoolNetworks.id, id));
    return network || undefined;
  }

  async createSchoolNetwork(network: InsertSchoolNetwork): Promise<SchoolNetwork> {
    const [newNetwork] = await db
      .insert(schoolNetworks)
      .values(network)
      .returning();
    return newNetwork;
  }

  // School methods
  async getSchools(): Promise<School[]> {
    return await db.select().from(schools);
  }

  async getSchool(id: number): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school || undefined;
  }

  async getSchoolsByNetwork(networkId: number): Promise<School[]> {
    return await db.select().from(schools).where(eq(schools.schoolNetworkId, networkId));
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const [newSchool] = await db
      .insert(schools)
      .values(school)
      .returning();
    return newSchool;
  }

  async updateSchool(id: number, schoolData: Partial<InsertSchool>): Promise<School | undefined> {
    const [updatedSchool] = await db.update(schools)
      .set(schoolData)
      .where(eq(schools.id, id))
      .returning();
    return updatedSchool || undefined;
  }

  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student || undefined;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async getStudentsByClass(classId: number): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.classId, classId));
  }

  // Class methods
  async getClass(id: number): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || undefined;
  }

  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.isActive, true));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const [updatedClass] = await db.update(classes)
      .set(classData)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass || undefined;
  }

  async getClassesByTeacher(teacherId: number): Promise<Class[]> {
    return await db.select().from(classes).where(
      and(eq(classes.teacherId, teacherId), eq(classes.isActive, true))
    );
  }

  // Subject methods
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.isActive, true));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  // Grade methods
  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    return await db.select().from(grades)
      .where(eq(grades.studentId, studentId))
      .orderBy(desc(grades.date));
  }

  async getGradesByClass(classId: number): Promise<Grade[]> {
    return await db.select().from(grades)
      .where(eq(grades.classId, classId))
      .orderBy(desc(grades.date));
  }

  async createGrade(grade: InsertGrade): Promise<Grade> {
    const [newGrade] = await db.insert(grades).values(grade).returning();
    return newGrade;
  }

  // Attendance methods
  async getAttendanceByStudent(studentId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    let query = db.select().from(attendance).where(eq(attendance.studentId, studentId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(attendance.studentId, studentId),
          // Add date range filtering here if needed
        )
      );
    }
    
    return await query.orderBy(desc(attendance.date));
  }

  async getAttendanceByClass(classId: number, date: Date): Promise<Attendance[]> {
    return await db.select().from(attendance)
      .where(
        and(
          eq(attendance.classId, classId),
          // Add date filtering here
        )
      );
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return await db.select().from(courses)
      .where(eq(courses.teacherId, teacherId))
      .orderBy(desc(courses.createdAt));
  }

  async getCoursesByClass(classId: number): Promise<Course[]> {
    return await db.select().from(courses)
      .where(
        and(
          eq(courses.classId, classId),
          eq(courses.isPublished, true)
        )
      )
      .orderBy(desc(courses.createdAt));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Assignment methods
  async getAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments).orderBy(desc(assignments.createdAt));
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.teacherId, teacherId))
      .orderBy(desc(assignments.createdAt));
  }

  async getAssignmentsByClass(classId: number): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.classId, classId))
      .orderBy(desc(assignments.dueDate));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  // Submission methods
  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return await db.select().from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return await db.select().from(submissions)
      .where(eq(submissions.studentId, studentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async updateSubmission(id: number, submissionData: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const [submission] = await db.update(submissions)
      .set(submissionData)
      .where(eq(submissions.id, id))
      .returning();
    return submission || undefined;
  }

  // Message methods
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.receiverId, userId))
      .orderBy(desc(messages.sentAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message || undefined;
  }

  // Teacher management methods
  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers);
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || undefined;
  }

  async getTeacherByUserId(userId: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId));
    return teacher || undefined;
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [newTeacher] = await db
      .insert(teachers)
      .values(teacher)
      .returning();
    return newTeacher;
  }

  async updateTeacher(id: number, teacherData: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const [teacher] = await db
      .update(teachers)
      .set(teacherData)
      .where(eq(teachers.id, id))
      .returning();
    return teacher || undefined;
  }

  // Parent management methods
  async getParents(): Promise<Parent[]> {
    return await db.select().from(parents);
  }

  async getParent(id: number): Promise<Parent | undefined> {
    const [parent] = await db.select().from(parents).where(eq(parents.id, id));
    return parent || undefined;
  }

  async getParentByUserId(userId: number): Promise<Parent | undefined> {
    const [parent] = await db.select().from(parents).where(eq(parents.userId, userId));
    return parent || undefined;
  }

  async createParent(parent: InsertParent): Promise<Parent> {
    const [newParent] = await db
      .insert(parents)
      .values(parent)
      .returning();
    return newParent;
  }

  async updateParent(id: number, parentData: Partial<InsertParent>): Promise<Parent | undefined> {
    const [parent] = await db
      .update(parents)
      .set(parentData)
      .where(eq(parents.id, id))
      .returning();
    return parent || undefined;
  }

  // Teacher-Course relationship methods
  async getTeacherCourses(teacherId: number): Promise<TeacherCourse[]> {
    return await db.select().from(teacherCourses).where(eq(teacherCourses.teacherId, teacherId));
  }

  async assignCourseToTeacher(teacherId: number, courseId: number): Promise<TeacherCourse> {
    const [assignment] = await db
      .insert(teacherCourses)
      .values({ teacherId, courseId })
      .returning();
    return assignment;
  }

  async removeCourseFromTeacher(teacherId: number, courseId: number): Promise<void> {
    await db
      .delete(teacherCourses)
      .where(
        and(
          eq(teacherCourses.teacherId, teacherId),
          eq(teacherCourses.courseId, courseId)
        )
      );
  }

  // Parent-Student relationship methods
  async getParentStudents(parentId: number): Promise<ParentStudent[]> {
    return await db.select().from(parentStudents).where(eq(parentStudents.parentId, parentId));
  }

  async assignStudentToParent(parentId: number, studentId: number): Promise<ParentStudent> {
    const [assignment] = await db
      .insert(parentStudents)
      .values({ parentId, studentId })
      .returning();
    return assignment;
  }

  async removeStudentFromParent(parentId: number, studentId: number): Promise<void> {
    await db
      .delete(parentStudents)
      .where(
        and(
          eq(parentStudents.parentId, parentId),
          eq(parentStudents.studentId, studentId)
        )
      );
  }
}

export const storage = new DatabaseStorage();
