// src/components/MyTeachers/MyTeachers.jsx
import React, { useMemo, useState, useEffect } from "react";
import { readClassSubjectTeacherMappings } from "../../storage";

export default function MyTeachers({ currentRole, users = [], brand = {} }) {
  const [mapping, setMapping] = useState({});
  useEffect(() => setMapping(readClassSubjectTeacherMappings()), []);

  const student = useMemo(() => users.find((u) => u.role === "Student"), [users]);
  const myClass = student?.cls;

  const entries = useMemo(() => {
    if (!myClass) return [];
    const list = mapping[myClass] || [];
    return list
      .map((m) => ({ ...m, teacher: users.find((u) => String(u.id) === String(m.teacherId)) }))
      .filter((m) => m.teacher);
  }, [mapping, myClass, users]);

  const safeBrand = { blue: brand.blue || "var(--brand-blue)" };

  return (
    <div className="p-4 card space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: safeBrand.blue }}>👨‍🏫 My Teachers</h2>
        <p className="text-sm text-gray-500">Class <b>{myClass || "-"}</b></p>
      </div>

      {entries.length === 0 ? (
        <div className="p-6 text-center text-gray-500 border rounded-xl bg-white text-sm">
          No teachers have been mapped for your class yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((e, i) => (
            <div key={`${e.subject}-${e.teacher.id}`} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-blue)] text-white flex items-center justify-center font-semibold">
                  {e.teacher.name?.[0] || "T"}
                </div>
                <div>
                  <div className="font-semibold">{e.teacher.name}</div>
                  <div className="text-sm text-gray-600">{e.subject}</div>
                </div>
              </div>
              {e.teacher.email && <div className="text-xs text-gray-500 mt-2">📧 {e.teacher.email}</div>}
              {e.teacher.phone && <div className="text-xs text-gray-500">📞 {e.teacher.phone}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
