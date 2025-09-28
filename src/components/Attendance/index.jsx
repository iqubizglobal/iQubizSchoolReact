import React, { useEffect, useMemo, useState } from "react";
import {
  readUsers,
  readClasses,
  readAttendance,
  writeAttendance,
} from "../../storage";

const CAN_MARK = new Set(["Teacher", "Class Teacher", "Principal", "Owner"]);

export default function Attendance({
  brand = { blue: "#0C3C78", orange: "#F15A24" },
  currentRole = "Owner",
  users: usersProp,
  attendanceStore: attendanceProp,
  setAttendanceStore: setAttendanceProp,
}) {
  const canMark = CAN_MARK.has(currentRole);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [marks, setMarks] = useState({});

  useEffect(() => {
    setClasses(readClasses() || []);
    const data = usersProp?.length ? usersProp : readUsers() || [];
    setUsers(data);
  }, [usersProp]);

  const students = useMemo(() => {
    if (!selectedClassId) return [];
    return users.filter(
      (u) =>
        (u.role || "").toLowerCase() === "student" &&
        String(u.classId) === String(selectedClassId)
    );
  }, [users, selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) {
      setMarks({});
      return;
    }
    const stored = readAttendance() || {};
    const byDate = stored[date] || {};
    const list = byDate[String(selectedClassId)] || [];
    const next = {};
    students.forEach((s) => {
      const sid = String(s.id);
      const found = list.find((r) => String(r.studentId) === sid);
      next[sid] = found ? found.status : "absent";
    });
    setMarks(next);
  }, [date, selectedClassId, students]);

  const toggleMark = (sid) => {
    setMarks((m) => ({
      ...m,
      [sid]: m[sid] === "present" ? "absent" : "present",
    }));
  };

  const saveMarks = () => {
    if (!selectedClassId) return alert("Please select a class first.");
    const entry = Object.entries(marks).map(([sid, status]) => ({
      studentId: String(sid),
      status,
    }));

    const existing = readAttendance() || {};
    if (!existing[date]) existing[date] = {};
    existing[date][String(selectedClassId)] = entry;
    writeAttendance(existing);
    setAttendanceProp?.(existing);
    alert("✅ Attendance saved successfully!");
  };

  const summary = useMemo(() => {
    const total = students.length;
    const present = Object.values(marks).filter((v) => v === "present").length;
    return { present, absent: total - present, total };
  }, [students, marks]);

  const classLabel = (c) =>
    `${c.className || ""}-${c.division || ""} (${c.medium || "-"})`;

  return (
    <div className="p-4 bg-gradient-to-b from-[#f9fbff] to-[#eef2f9] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: brand.blue }}>
              📋 Attendance
            </h1>
            <p className="text-sm text-gray-500">
              Mark or view attendance class-wise
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm shadow-sm min-w-[220px] focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {classLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
          {!selectedClassId && (
            <div className="text-sm text-gray-500 text-center py-6">
              Please select a class to view students.
            </div>
          )}
          {selectedClassId && students.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-6">
              No students in this class.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((s) => {
              const sid = String(s.id);
              const name = `${s.firstName || s.name || ""} ${s.middleName || ""} ${
                s.lastName || ""
              }`
                .replace(/\s+/g, " ")
                .trim();

              const isPresent = marks[sid] === "present";

              return (
                <div
                  key={sid}
                  className={`flex justify-between items-center p-3 rounded-lg border transition-all shadow-sm hover:shadow-md ${
                    isPresent
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-gray-800">{name}</div>
                    <div className="text-xs text-gray-500">
                      {s.studentEmail || s.email || ""}
                    </div>
                  </div>
                  {canMark && (
                    <button
                      onClick={() => toggleMark(sid)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                        isPresent
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </button>
                  )}
                  {!canMark && (
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        isPresent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {canMark && selectedClassId && students.length > 0 && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDate(new Date().toISOString().slice(0, 10));
                  if (classes.length) setSelectedClassId(String(classes[0].id));
                }}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
              >
                Reset
              </button>
              <button
                onClick={saveMarks}
                className="px-5 py-2 rounded-md text-sm font-semibold text-white shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: brand.blue }}
              >
                💾 Save Attendance
              </button>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 max-w-sm mx-auto text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
          {selectedClassId ? (
            <div className="text-sm text-gray-700 space-x-2">
              <span className="font-medium text-green-600">
                Present: {summary.present}
              </span>
              <span className="font-medium text-red-600">
                Absent: {summary.absent}
              </span>
              <span className="font-medium text-gray-800">
                Total: {summary.total}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Select class to see summary</div>
          )}
        </div>
      </div>
    </div>
  );
}
