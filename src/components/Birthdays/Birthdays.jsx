import React, { useMemo, useState } from "react";

/**
 * Birthday cards for today's birthdays.
 * - Student: auto-detects their class and shows classmates' birthdays (excludes self)
 * - Staff (Teacher/Class Teacher/Principal/Owner): choose a class to view
 * Expects users[] to have: { id, name, role: "Student", cls, dob: "YYYY-MM-DD", email? }
 */
export default function Birthdays({ currentRole, users = [], brand = {} }) {
  const safeBrand = {
    blue: brand.blue || "#0C3C78",
    orange: brand.orange || "#F15A24",
  };

  // find current student user (for demo, first student is fine if you don’t have auth yet)
  const currentStudent = useMemo(
    () => users.find((u) => u.role === "Student"),
    [users]
  );

  const allClasses = useMemo(
    () => Array.from(new Set(users.filter(u => u.role === "Student" && u.cls).map(u => u.cls))).sort(),
    [users]
  );

  const [selectedClass, setSelectedClass] = useState(
    ["Teacher", "Class Teacher", "Principal", "Owner"].includes(currentRole)
      ? (allClasses[0] || "")
      : (currentStudent?.cls || "")
  );

  // helpers
  const todayMMDD = () => {
    const d = new Date();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${m}-${day}`;
  };

  const isBirthdayToday = (dob) => {
    if (!dob) return false;
    // expect YYYY-MM-DD (but tolerate other separators)
    const parts = dob.split(/[-/]/);
    if (parts.length < 3) return false;
    const mmdd = `${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;

    // Feb 29 -> show on Feb 28 in non-leap years (optional behavior)
    if (mmdd === "02-29") {
      const now = new Date();
      const year = now.getFullYear();
      const isLeap = new Date(year, 1, 29).getDate() === 29;
      return isLeap ? todayMMDD() === "02-29" : todayMMDD() === "02-28";
    }
    return mmdd === todayMMDD();
  };

  const classmates = useMemo(() => {
    const cls = selectedClass || currentStudent?.cls;
    if (!cls) return [];
    return users
      .filter((u) => u.role === "Student" && u.cls === cls)
      .filter((u) => (currentRole === "Student" && currentStudent ? u.id !== currentStudent.id : true));
  }, [users, selectedClass, currentRole, currentStudent]);

  const birthdaysToday = classmates.filter((s) => isBirthdayToday(s.dob));

  // visuals
  const palette = [
    "#FFF2E6", "#E6F7FF", "#F3E8FF", "#E6FFFA", "#FFF5F7", "#F0FFF4", "#FDF6B2",
  ];
  const pickColor = (id, i) => palette[(id ?? i) % palette.length];

  const IconCake = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2c1.1 0 2 .9 2 2 0 1.8-2 2.2-2 4 0-1.8-2-2.2-2-4 0-1.1.9-2 2-2z" />
      <path d="M4 15v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5H4z" />
      <path d="M4 15c1.5-1.2 3.5-2 6-2s4.5.8 6 2" />
    </svg>
  );
  const IconBouquet = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 14l-2 8 2-2 2 2-2-8z" />
      <path d="M7 10a3 3 0 1 1 6 0v1H7v-1z" />
      <path d="M13 11a3 3 0 1 1 6 0v1h-6v-1z" />
    </svg>
  );
  const IconBalloon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="8" rx="5" ry="6" />
      <path d="M12 14v6" />
      <path d="M12 20c-2 0-3 1-3 2" />
    </svg>
  );

  const pickIcon = (i) => {
    const idx = i % 3;
    return idx === 0 ? <IconCake/> : idx === 1 ? <IconBouquet/> : <IconBalloon/>;
  };

  return (
    <div className="p-4 card">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: safeBrand.blue }}>
            🎉 Birthdays Today
          </h2>
          <p className="text-sm text-gray-500">Classmates having birthday today</p>
        </div>

        {["Teacher", "Class Teacher", "Principal", "Owner"].includes(currentRole) && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input"
          >
            <option value="">Select class</option>
            {allClasses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        {currentRole === "Student" && (
          <div className="pill pill-primary">{currentStudent?.cls || "-"}</div>
        )}
      </div>

      {birthdaysToday.length === 0 ? (
        <div className="p-6 text-center text-sm text-gray-500 border rounded-xl bg-white">
          No birthdays today in {selectedClass || currentStudent?.cls || "this class"}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {birthdaysToday.map((s, i) => (
            <div
              key={s.id}
              className="rounded-xl p-4 border shadow-sm transition hover:shadow-md"
              style={{ background: pickColor(s.id, i) }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* avatar (initials) */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                    style={{ background: safeBrand.blue }}
                    aria-hidden
                  >
                    {s.name?.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() || "S"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{s.name}</div>
                    <div className="text-xs text-gray-600">Class {s.cls}{s.rollNo ? ` • Roll ${s.rollNo}` : ""}</div>
                    {s.email && <div className="text-xs text-gray-500">{s.email}</div>}
                  </div>
                </div>
                <div className="text-[var(--brand-blue)]" style={{ color: safeBrand.blue }}>
                  {pickIcon(i)}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded-md bg-white/70 border">🎂 Happy Birthday!</span>
                {s.dob && <span className="text-gray-600">DOB: {s.dob}</span>}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded-md text-white"
                  style={{ background: safeBrand.orange }}
                >
                  Send Wishes
                </button>
                <button className="px-3 py-1 rounded-md border bg-white">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
