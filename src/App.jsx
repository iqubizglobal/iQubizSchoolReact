import React, { useEffect, useState } from "react";

// storage helpers
import {
  readRoles,
  writeRoles,
  readUsers,
  writeUsers,
  readAssignments,
  writeAssignments,
  readAttendance,
  writeAttendance,
  readSettings,
  writeSettings,
} from "./storage.js";

// components
import AdminSetup from "./components/AdminSetup";
import Attendance from "./components/Attendance";
import Homework from "./components/Homework";
import Dashboard from "./components/Dashboard";
import AddStudent from "./components/AddStudent";
import Students from "./components/Students";
import SchoolCalendar from "./components/Calendar/SchoolCalendar";
import Settings from "./components/Settings";
import Results from "./components/Results/Results";
import Timetable from "./components/Timetable/Timetable";
import ExamSchedule from "./components/ExamSchedule/ExamSchedule";
import Birthdays from "./components/Birthdays/Birthdays";
import Queries from "./components/Queries/Queries";
import LostFound from "./components/LostFound/LostFound";
import Feedback from "./components/Feedback/Feedback";
import MyTeachers from "./components/MyTeachers/MyTeachers";
import SubjectsAdmin from "./components/SubjectsAdmin";
import Circulars from "./components/Circulars/Circulars";
import Transport from "./components/Transport";
import Classes from "./components/Masters/Classes";
import Teachers from "./components/Masters/Teachers";




// navigation
import {
  SidebarNavigation,
  MobileDrawerNav,
  MobileBottomNav,
} from "./components/Layout/Navigation";

// icons
import {
  Logo,
  IconClock,
  IconHomework,
  IconStudents,
  IconAddStudent,
  IconFees,
  IconMessages,
  IconSettings,
  IconUsers,
  IconDashboard,
  IconCalendar,
  IconResults,
  IconExam,
  IconBirthday,
  IconQueries,
  IconLostFound,
  IconFeedback,
  IconTeachers,
  IconSubjects,
  IconBus,
  IconDriver,
  IconRoute,
  IconStop,
  IconTime,
  IconAssignStudent,
  IconDownload,
  IconPhone,
  IconTruck,
  IconCar,
} from "./components/Icons";


import "./index.css";

// ----------------------
// Main App Component
// ----------------------
export default function App() {
  const [route, setRoute] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // persisted states
  const [roles, setRoles] = useState(readRoles());
  const [users, setUsers] = useState(readUsers());
  const [assignments, setAssignments] = useState(readAssignments());
  const [attendanceStore, setAttendanceStore] = useState(readAttendance());
  const [settings, setSettings] = useState(readSettings());
  const [currentRole, setCurrentRole] = useState("Owner");

  // persist storage
  useEffect(() => writeRoles(roles), [roles]);
  useEffect(() => writeUsers(users), [users]);
  useEffect(() => writeAssignments(assignments), [assignments]);
  useEffect(() => writeAttendance(attendanceStore), [attendanceStore]);
  useEffect(() => writeSettings(settings), [settings]);

  // brand from settings (fallback to iQubiz defaults)
  const brand = {
    blue: settings?.backColor || "#0C3C78",
    orange: settings?.foreColor || "#F15A24",
    light: settings?.lightColor || "#F7FAFC",
    logo: settings?.logo || null,
    schoolName: settings?.schoolName || "iQubiz School",
    schoolAddress: settings?.schoolAddress || "",
  };

  // Navigation Items
const navItems = [
  { id: "dashboard", icon: IconDashboard, label: "Dashboard" },
  { id: "attendance", icon: IconClock, label: "Attendance" },
  { id: "homework", icon: IconHomework, label: "Homework" },
  { id: "students", icon: IconStudents, label: "Students" },
  { id: "add-student", icon: IconAddStudent, label: "Add Student" },
  { id: "fees", icon: IconFees, label: "Fees" },
  { id: "messages", icon: IconMessages, label: "Messages" },
  { id: "school-calendar", icon: IconCalendar, label: "School Calendar" },
  { id: "settings", icon: IconSettings, label: "Settings" },
  { id: "roles", icon: IconUsers, label: "User & Role Admin" },
  { id: "results", icon: IconResults, label: "Results" },
  { id: "timetable", icon: IconCalendar, label: "Timetable" },
  { id: "exam-schedule", icon: IconExam, label: "Exam Schedule" },
  { id: "birthdays", icon: IconBirthday, label: "Birthdays" },
  { id: "queries", icon: IconQueries, label: "Queries" },
  { id: "lost-found", icon: IconLostFound, label: "Lost & Found" },
  { id: "feedback", icon: IconFeedback, label: "Feedback" },
  { id: "my-teachers", icon: IconTeachers, label: "My Teachers" },
  { id: "subjects-admin", icon: IconSubjects, label: "Subjects" },
  { id: "circulars", icon:IconMessages, label: "Circulars" },
  { id: "transport", icon:IconBus, label: "Transport" },
  { id: "classes", icon: IconCalendar, label: "Classes" },
  { id: "teachers-master", icon: IconTeachers, label: "Teachers Master" },
];



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#fbfcff] flex">
      {/* Sidebar (Desktop) */}
      <SidebarNavigation
        brand={brand}
        navItems={navItems}
        route={route}
        setRoute={setRoute}
        currentRole={currentRole}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 bg-[#f9fafb]">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setMobileNavOpen((s) => !s)}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke={brand.blue}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="hidden lg:flex items-center gap-3">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt="School Logo"
                  className="h-9 w-9 object-contain rounded bg-white p-1"
                />
              ) : (
                <Logo size={32} />
              )}
              <div>
                <h1 className="text-xl font-bold" style={{ color: brand.blue }}>
                  {brand.schoolName}
                </h1>
                <p className="text-xs text-gray-500">School App</p>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Page Content */}
        <div className="space-y-6">
          {route === "dashboard" && (
            <Dashboard
              brand={brand}
              users={users}
              currentRole={currentRole}
              assignments={assignments}
              attendanceStore={attendanceStore}
            />
          )}
          {route === "attendance" && (
            <Attendance
              brand={brand}
              users={users}
              attendanceStore={attendanceStore}
              setAttendanceStore={setAttendanceStore}
              currentRole={currentRole}
            />
          )}
          {route === "homework" && (
            <Homework
              brand={brand}
              currentRole={currentRole}
              users={users}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          )}
          {route === "students" && (
            <Students users={users} setUsers={setUsers} brand={brand} />
          )}
          {route === "add-student" && (
            <AddStudent
              brand={brand}
              users={users}
              setUsers={setUsers}
              roles={roles}
            />
          )}
          {route === "school-calendar" && (
            <SchoolCalendar currentRole={currentRole} brand={brand} />
          )}
          {route === "settings" && (
            <Settings brand={brand} settings={settings} setSettings={setSettings} />
          )}
          {route === "roles" && (
            <AdminSetup
              brand={brand}
              roles={roles}
              setRoles={setRoles}
              users={users}
              setUsers={setUsers}
            />
          )}
          {route === "results" && (
            <Results currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "timetable" && (
            <Timetable currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "exam-schedule" && (
            <ExamSchedule currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "birthdays" && (
            <Birthdays currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "queries" && (
            <Queries currentRole={currentRole} users={users} />
          )}
          {route === "lost-found" && (
            <LostFound currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "feedback" && (
            <Feedback currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "my-teachers" && (
            <MyTeachers currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "subjects-admin" && (
            <SubjectsAdmin currentRole={currentRole} users={users} brand={brand} />
          )}
          {route === "circulars" && (
            <Circulars currentRole={currentRole} brand={brand} />
          )}
          {route === "transport" && (
          <Transport currentRole={currentRole} brand={brand} />
          )}
          {route === "student-mapping" && (
          <StudentMapping users={users} brand={brand} />
          )}
          {route === "classes" && <Classes brand={brand} />}
          
{route === "teachers-master" && <Teachers brand={brand} />}
        </div>
      </main>

      {/* Mobile Drawer */}
      <MobileDrawerNav
        brand={brand}
        navItems={navItems}
        route={route}
        setRoute={setRoute}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        brand={brand}
        route={route}
        setRoute={setRoute}
        navItems={navItems}
      />
    </div>
  );
}
