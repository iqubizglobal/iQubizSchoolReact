import React from "react";
import {
  IconHome,
  IconClock,
  IconHomework,
  IconStudents,
  IconSettings,
  IconBus,
} from "../Icons";

export default function MobileBottomNav({ route, setRoute, brand }) {
  const items = [
    { id: "dashboard", label: "Home", icon: <IconHome /> },
    { id: "attendance", label: "Attendance", icon: <IconClock /> },
    { id: "homework", label: "Work", icon: <IconHomework /> },
    { id: "students", label: "Students", icon: <IconStudents /> },
    { id: "settings", label: "Settings", icon: <IconSettings /> },
    { id: "transport", label: "Transport", icon: <IconBus /> },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 z-50"
      style={{ backgroundColor: brand.blue }}
    >
      {items.map((item) => {
        const active = route === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setRoute(item.id)}
            className="flex flex-col items-center gap-1 focus:outline-none"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                active ? "scale-110 shadow-md" : "opacity-80"
              }`}
              style={{
                backgroundColor: active ? brand.orange : "transparent",
                color: active ? "#fff" : brand.light,
              }}
            >
              {item.icon}
            </div>
            <span
              className="text-[11px] font-medium transition-colors duration-200"
              style={{ color: active ? "#fff" : brand.light }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
