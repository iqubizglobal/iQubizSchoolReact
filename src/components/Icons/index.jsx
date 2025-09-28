// src/components/Icons/index.jsx
import React from "react";
import {
  Home,
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings,
  Clock,
  FileText,
  Gift,
  HelpCircle,
  Inbox,
  GraduationCap,
  Megaphone,
  Bus,
  UserCog,
  Route,
  MapPin,
  UserCheck,
  FileDown,
  Phone,
  Truck,
  Car,
} from "lucide-react";

/**
 * ✅ Brand Logo
 * A simple SVG logo using iQubiz colors
 */
export function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="6" width="52" height="52" rx="8" fill="#0C3C78" />
      <rect x="14" y="14" width="36" height="36" rx="6" fill="#F15A24" />
      <path
        d="M20 40 L44 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * ✅ Standard Lucide Icons
 * Use `currentColor` so parent can control color through styles
 */
export const IconHome = <Home size={20} />;
export const IconDashboard = <LayoutDashboard size={20} />;
export const IconStudents = <Users size={20} />;
export const IconAddStudent = <UserPlus size={20} />;
export const IconHomework = <BookOpen size={20} />;
export const IconResults = <ClipboardList size={20} />;
export const IconCalendar = <Calendar size={20} />;
export const IconMessages = <MessageSquare size={20} />;
export const IconSettings = <Settings size={20} />;
export const IconClock = <Clock size={20} />;
export const IconExam = <FileText size={20} />;
export const IconBirthday = <Gift size={20} />;
export const IconQueries = <HelpCircle size={20} />;
export const IconLostFound = <Inbox size={20} />;
export const IconFeedback = <MessageSquare size={20} />;
export const IconTeachers = <GraduationCap size={20} />;
export const IconSubjects = <Megaphone size={20} />;
export const IconFees = <FileText size={20} />;
export const IconUsers = <Users size={20} />;
export const IconBus = <Bus size={20} />;
export const IconDriver = <UserCog size={20} />;
export const IconRoute = <Route size={20} />;
export const IconStop = <MapPin size={20} />;
export const IconTime = <Clock size={20} />;
export const IconAssignStudent = <UserCheck size={20} />;
export const IconDownload = <FileDown size={20} />;
export const IconPhone = <Phone size={20} />;
export const IconTruck = <Truck size={20} />;
export const IconCar = <Car size={20} />;

