import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertStudentSchema, insertClassSchema, insertSubjectSchema, insertGradeSchema, insertAttendanceSchema, insertCourseSchema, insertAssignmentSchema, insertSubmissionSchema, insertMessageSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Helper function to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Helper function to check role
  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };

  // School Networks endpoints
  app.get("/api/school-networks", async (req, res) => {
    try {
      const networks = await storage.getSchoolNetworks();
      res.json(networks);
    } catch (error) {
      console.error("Erreur lors de la récupération des réseaux d'écoles:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await storage.getSchools();
      res.json(schools);
    } catch (error) {
      console.error("Erreur lors de la récupération des écoles:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/schools/by-network/:networkId", async (req, res) => {
    try {
      const networkId = parseInt(req.params.networkId);
      const schools = await storage.getSchoolsByNetwork(networkId);
      res.json(schools);
    } catch (error) {
      console.error("Erreur lors de la récupération des écoles du réseau:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Dashboard data endpoint
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      let dashboardData: any = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email
        }
      };

      switch (user.role) {
        case "teacher":
          const classes = await storage.getClassesByTeacher(user.id);
          const courses = await storage.getCoursesByTeacher(user.id);
          const assignments = await storage.getAssignmentsByTeacher(user.id);
          
          dashboardData.classes = classes;
          dashboardData.courses = courses;
          dashboardData.assignments = assignments;
          dashboardData.stats = {
            totalClasses: classes.length,
            totalCourses: courses.length,
            totalAssignments: assignments.length
          };
          break;

        case "student":
          const student = await storage.getStudentByUserId(user.id);
          if (student) {
            const studentGrades = await storage.getGradesByStudent(student.id);
            const studentAttendance = await storage.getAttendanceByStudent(student.id);
            const studentSubmissions = await storage.getSubmissionsByStudent(student.id);
            
            if (student.classId) {
              const classCourses = await storage.getCoursesByClass(student.classId);
              const classAssignments = await storage.getAssignmentsByClass(student.classId);
              
              dashboardData.courses = classCourses;
              dashboardData.assignments = classAssignments;
            }
            
            dashboardData.student = student;
            dashboardData.grades = studentGrades;
            dashboardData.attendance = studentAttendance;
            dashboardData.submissions = studentSubmissions;
          }
          break;

        case "admin":
          const allClasses = await storage.getClasses();
          const allSubjects = await storage.getSubjects();
          
          dashboardData.classes = allClasses;
          dashboardData.subjects = allSubjects;
          dashboardData.stats = {
            totalClasses: allClasses.length,
            totalSubjects: allSubjects.length
          };
          break;

        case "parent":
          // Parent logic would go here
          dashboardData.children = [];
          break;
      }

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Classes endpoints
  app.get("/api/classes", requireAuth, async (req, res) => {
    try {
      const classes = await storage.getClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.post("/api/classes", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      console.log("Received class data:", req.body);
      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(classData);
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Class creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid class data" });
      }
    }
  });

  // Students endpoints
  app.get("/api/students", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
    try {
      const { classId } = req.query;
      if (classId) {
        const students = await storage.getStudentsByClass(Number(classId));
        res.json(students);
      } else {
        res.status(400).json({ message: "Class ID required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post("/api/students", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  // Subjects endpoints
  app.get("/api/subjects", requireAuth, async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(subjectData);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ message: "Invalid subject data" });
    }
  });

  // Grades endpoints
  app.get("/api/grades", requireAuth, async (req, res) => {
    try {
      const { studentId, classId } = req.query;
      
      if (studentId) {
        const grades = await storage.getGradesByStudent(Number(studentId));
        res.json(grades);
      } else if (classId) {
        const grades = await storage.getGradesByClass(Number(classId));
        res.json(grades);
      } else {
        res.status(400).json({ message: "Student ID or Class ID required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });

  app.post("/api/grades", requireAuth, requireRole(["teacher", "admin"]), async (req, res) => {
    try {
      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(gradeData);
      res.status(201).json(grade);
    } catch (error) {
      res.status(400).json({ message: "Invalid grade data" });
    }
  });

  // Attendance endpoints
  app.get("/api/attendance", requireAuth, async (req, res) => {
    try {
      const { studentId, classId, date } = req.query;
      
      if (studentId) {
        const attendance = await storage.getAttendanceByStudent(Number(studentId));
        res.json(attendance);
      } else if (classId && date) {
        const attendance = await storage.getAttendanceByClass(Number(classId), new Date(date as string));
        res.json(attendance);
      } else {
        res.status(400).json({ message: "Student ID or (Class ID and date) required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", requireAuth, requireRole(["teacher", "admin"]), async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(400).json({ message: "Invalid attendance data" });
    }
  });

  // Courses endpoints (E-learning)
  app.get("/api/courses", requireAuth, async (req, res) => {
    try {
      const { teacherId, classId } = req.query;
      
      if (teacherId) {
        const courses = await storage.getCoursesByTeacher(Number(teacherId));
        res.json(courses);
      } else if (classId) {
        const courses = await storage.getCoursesByClass(Number(classId));
        res.json(courses);
      } else {
        const courses = await storage.getCourses();
        res.json(courses);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const course = await storage.getCourse(Number(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", requireAuth, requireRole(["teacher", "admin"]), async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Assignments endpoints
  app.get("/api/assignments", requireAuth, async (req, res) => {
    try {
      const { teacherId, classId } = req.query;
      
      if (teacherId) {
        const assignments = await storage.getAssignmentsByTeacher(Number(teacherId));
        res.json(assignments);
      } else if (classId) {
        const assignments = await storage.getAssignmentsByClass(Number(classId));
        res.json(assignments);
      } else {
        const assignments = await storage.getAssignments();
        res.json(assignments);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", requireAuth, requireRole(["teacher", "admin"]), async (req, res) => {
    try {
      const assignmentData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assignment data" });
    }
  });

  // Submissions endpoints
  app.get("/api/submissions", requireAuth, async (req, res) => {
    try {
      const { assignmentId, studentId } = req.query;
      
      if (assignmentId) {
        const submissions = await storage.getSubmissionsByAssignment(Number(assignmentId));
        res.json(submissions);
      } else if (studentId) {
        const submissions = await storage.getSubmissionsByStudent(Number(studentId));
        res.json(submissions);
      } else {
        res.status(400).json({ message: "Assignment ID or Student ID required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", requireAuth, async (req, res) => {
    try {
      const submissionData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid submission data" });
    }
  });

  // Messages endpoints
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessagesByUser(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.patch("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(Number(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Teachers endpoints
  app.get("/api/teachers", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });

  app.get("/api/teachers/:id", requireAuth, async (req, res) => {
    try {
      const teacher = await storage.getTeacher(parseInt(req.params.id));
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher" });
    }
  });

  app.post("/api/teachers", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const teacher = await storage.createTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to create teacher" });
    }
  });

  app.put("/api/teachers/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const teacher = await storage.updateTeacher(parseInt(req.params.id), req.body);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to update teacher" });
    }
  });

  // Parents endpoints
  app.get("/api/parents", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const parents = await storage.getParents();
      res.json(parents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parents" });
    }
  });

  app.get("/api/parents/:id", requireAuth, async (req, res) => {
    try {
      const parent = await storage.getParent(parseInt(req.params.id));
      if (!parent) {
        return res.status(404).json({ error: "Parent not found" });
      }
      res.json(parent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parent" });
    }
  });

  app.post("/api/parents", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const parent = await storage.createParent(req.body);
      res.status(201).json(parent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create parent" });
    }
  });

  app.put("/api/parents/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const parent = await storage.updateParent(parseInt(req.params.id), req.body);
      if (!parent) {
        return res.status(404).json({ error: "Parent not found" });
      }
      res.json(parent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update parent" });
    }
  });

  // Users list endpoint for table display
  app.get("/api/users", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Bulk import endpoints
  app.post("/api/import/students", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      // For now, return mock success response
      // In real implementation, process uploaded CSV file
      const result = {
        success: true,
        validRows: 25,
        invalidRows: 0,
        errors: []
      };
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to import students" });
    }
  });

  app.post("/api/import/employees", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      // For now, return mock success response
      // In real implementation, process uploaded CSV file
      const result = {
        success: true,
        validRows: 15,
        invalidRows: 0,
        errors: []
      };
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to import employees" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
