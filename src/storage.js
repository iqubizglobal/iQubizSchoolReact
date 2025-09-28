// src/storage.js

// --------------------
// Generic helpers
// --------------------
function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${key}`, err);
    return fallback;
  }
}

function safeWrite(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to write ${key}`, err);
  }
}

// --------------------
// Roles
// --------------------
const ROLES_KEY = "school_roles";

export function readRoles() {
  return safeRead(ROLES_KEY, [
    "Student",
    "Teacher",
    "Class Teacher",
    "Principal",
    "Trustee",
    "Owner",
  ]);
}

export function writeRoles(roles) {
  safeWrite(ROLES_KEY, roles);
}

// --------------------
// Users
// --------------------
const USERS_KEY = "users";

// src/storage.js

// const USERS_KEY = "users";

export function readUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
}

export function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Error writing users:", err);
  }
}


// --------------------
// Homework / Assignments
// --------------------
const ASSIGNMENTS_KEY = "school_assignments";

export function readAssignments() {
  return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "[]");
}

export function writeAssignments(data) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(data));
}

// --------------------
// Attendance
// --------------------
const ATTENDANCE_KEY = "school_attendance";

export function readAttendance() {
  return safeRead(ATTENDANCE_KEY, {});
}

export function writeAttendance(data) {
  safeWrite(ATTENDANCE_KEY, data);
}

// --------------------
// Settings
// --------------------
const SETTINGS_KEY = "school_settings";

export function readSettings() {
  return safeRead(SETTINGS_KEY, {
    backColor: "#0C3C78",
    foreColor: "#F15A24",
    lightColor: "#F7FAFC",
    logo: null,
    schoolName: "iQubiz School",
    schoolAddress: "",
  });
}

export function writeSettings(settings) {
  safeWrite(SETTINGS_KEY, settings);
}

// --------------------
// Calendar Events
// --------------------
const CALENDAR_KEY = "school_calendar_events";

export function readCalendarEvents() {
  const data = safeRead(CALENDAR_KEY, []);
  return data.map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));
}

export function writeCalendarEvents(events) {
  const serialized = events.map((e) => ({
    ...e,
    start: e.start instanceof Date ? e.start.toISOString() : e.start,
    end: e.end instanceof Date ? e.end.toISOString() : e.end,
  }));
  safeWrite(CALENDAR_KEY, serialized);
}


// ---- EXAM SCHEDULES (v1) ----
const EXAM_SCHEDULES_KEY = "exam_schedules_v1";

export function readExamSchedules() {
  try {
    const raw = localStorage.getItem(EXAM_SCHEDULES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("readExamSchedules parse error:", e);
    return [];
  }
}

export function writeExamSchedules(list) {
  try {
    localStorage.setItem(EXAM_SCHEDULES_KEY, JSON.stringify(list ?? []));
  } catch (e) {
    console.error("writeExamSchedules error:", e);
  }
}


// --------------------
// Clear All Storage
// --------------------
export function clearAllStorage() {
  localStorage.clear();
  console.log("✅ All localStorage cleared");
}


// Small id helper (safe-enough for local demo)
export function makeId(prefix = "m") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}


// --------------------
// Circulars 📢
// --------------------
const CIRCULARS_KEY = "school_circulars";

export function readCirculars() {
  return safeRead(CIRCULARS_KEY, []);
}

export function writeCirculars(circulars) {
  safeWrite(CIRCULARS_KEY, circulars);
}

// --------------------
// Transport: Drivers
// --------------------
const DRIVERS_KEY = "school_transport_drivers";

export function readDrivers() {
  return safeRead(DRIVERS_KEY, []);
}
export function writeDrivers(drivers) {
  safeWrite(DRIVERS_KEY, drivers);
}

// --------------------
// Transport: Routes
// Route shape example:
// {
//   id: 173, name: "Route A", vehicleNo: "MH-12 AB 1234",
//   driverId: 91,
//   stops: [
//     { id: 1, name: "Sunrise Apartments", pickupTime: "07:20", dropTime: "13:15" },
//     { id: 2, name: "Lakeview Gate",     pickupTime: "07:35", dropTime: "13:30" }
//   ]
// }
// --------------------
const ROUTES_KEY = "school_transport_routes";

export function readRoutes() {
  return safeRead(ROUTES_KEY, []);
}
export function writeRoutes(routes) {
  safeWrite(ROUTES_KEY, routes);
}

// --------------------
// Transport: Student Mapping
// Map by userId to a route/stop + explicit times if overridden
// { [studentId]: { routeId, pickupStopId, dropStopId, pickupTime?, dropTime? } }
// --------------------
const TRANSPORT_MAP_KEY = "school_transport_mappings";

export function readTransportMappings() {
  return safeRead(TRANSPORT_MAP_KEY, {});
}
export function writeTransportMappings(m) {
  safeWrite(TRANSPORT_MAP_KEY, m);
}

// --------------------
// Transport: Drivers, Routes, Stops, Mappings
// --------------------

const TRANSPORT_DRIVERS_KEY = "transport_drivers";
const TRANSPORT_ROUTES_KEY = "transport_routes";
const TRANSPORT_MAPPING_KEY = "transport_student_mapping";

export function readTransportDrivers() {
  return safeRead(TRANSPORT_DRIVERS_KEY, []);
}
export function writeTransportDrivers(data) {
  safeWrite(TRANSPORT_DRIVERS_KEY, data);
}

export function readTransportRoutes() {
  return safeRead(TRANSPORT_ROUTES_KEY, []);
}
export function writeTransportRoutes(data) {
  safeWrite(TRANSPORT_ROUTES_KEY, data);
}

export function readTransportMapping() {
  return safeRead(TRANSPORT_MAPPING_KEY, {});
}
export function writeTransportMapping(data) {
  safeWrite(TRANSPORT_MAPPING_KEY, data);
}


// 🧭 Timetables
const TIMETABLES_KEY = "timetables";

export function readTimetables() {
  try {
    const data = localStorage.getItem(TIMETABLES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Error reading timetables:", err);
    return {};
  }
}

export function writeTimetables(data) {
  try {
    localStorage.setItem(TIMETABLES_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error writing timetables:", err);
  }
}

// ---- Keys ----
const K_SUBJECTS = "iq_subjects_v1";
const K_CLASSES = "iq_classes_v1";
const K_TEACHERS = "iq_teachers_v1";
const K_CST = "iq_class_subject_teacher_v1"; // Class–Subject–Teacher mapping


function safeGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}
function safeSet(key, data) {
  localStorage.setItem(key, JSON.stringify(data || []));
}

// ---- Subjects ----
export function readSubjects() {
  return safeGet(K_SUBJECTS);
}
export function writeSubjects(list) {
  safeSet(K_SUBJECTS, list);
}

// ---- Classes ----
// Expected shape example:
// { id:"cls_1", className:"10", division:"A", medium:"English" }
export function readClasses() {
  return safeGet(K_CLASSES);
}
export function writeClasses(list) {
  safeSet(K_CLASSES, list);
}

// ---- Teachers ----
// Expected shape example:
// { id:"t_1", salutation:"Mr.", firstName:"Ravi", lastName:"Shah", ... }
export function readTeachers() {
  return safeGet(K_TEACHERS);
}
export function writeTeachers(list) {
  safeSet(K_TEACHERS, list);
}

// ---- Class–Subject–Teacher mapping ----
// Shape: { id, classId, subjectId, teacherId? }
export function readClassSubjectTeacherMappings() {
  return safeGet(K_CST);
}
export function writeClassSubjectTeacherMappings(list) {
  safeSet(K_CST, list);
}


