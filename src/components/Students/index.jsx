import React, { useEffect, useState } from "react";
import { readUsers, writeUsers, readClasses } from "../../storage";
import { Pencil, Trash2 } from "lucide-react";
import EditStudentModal from "./editsudent";

export default function Students({ brand }) {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editing, setEditing] = useState(null);

  // Load once on mount
  useEffect(() => {
    const all = readUsers() || [];
    const studs = all.filter((u) => u.role === "Student");
    setStudents(studs);
    setClasses(readClasses() || []);
  }, []);

  // Helper to persist students properly
  const saveToStorage = (updatedList) => {
    const all = readUsers() || [];
    const others = all.filter((u) => u.role !== "Student");
    writeUsers([...others, ...updatedList]);
  };

  const classLabel = (classId) => {
    const c = (classes || []).find((x) => String(x.id) === String(classId));
    return c ? `${c.className}-${c.division} (${c.medium})` : "—";
  };

  const onDelete = (id) => {
    if (confirm("Delete this student?")) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      saveToStorage(updated);
    }
  };

  const onSaveEdit = (updatedStudent) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updated);
    saveToStorage(updated);
    setEditing(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4" style={{ color: brand?.blue || "#0C3C78" }}>
        Students
      </h2>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No students found. Add some first.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead style={{ backgroundColor: `${brand?.blue || "#0C3C78"}10` }}>
              <tr>
                <th className="px-3 py-2 text-left border-b">Name</th>
                <th className="px-3 py-2 text-left border-b">Class</th>
                <th className="px-3 py-2 text-left border-b">Roll No</th>
                <th className="px-3 py-2 text-left border-b">GR No</th>
                <th className="px-3 py-2 text-left border-b">Email</th>
                <th className="px-3 py-2 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">
                    {s.firstName} {s.middleName} {s.lastName}
                  </td>
                  <td className="px-3 py-2 border-b">{classLabel(s.classId)}</td>
                  <td className="px-3 py-2 border-b">{s.rollNo || "—"}</td>
                  <td className="px-3 py-2 border-b">{s.grNo || "—"}</td>
                  <td className="px-3 py-2 border-b">{s.studentEmail || "—"}</td>
                  <td className="px-3 py-2 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 rounded hover:bg-blue-50" title="Edit" onClick={() => setEditing(s)}>
                        <Pencil size={16} color={brand?.blue || "#0C3C78"} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50" title="Delete" onClick={() => onDelete(s.id)}>
                        <Trash2 size={16} color="#dc2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditStudentModal
          student={editing}
          classes={classes}
          onClose={() => setEditing(null)}
          onSave={onSaveEdit}
        />
      )}
    </div>
  );
}
