// src/components/SubjectEditor/index.jsx
import React, { useState, useEffect } from "react";
import { readSubjects, writeSubjects } from "../../storage.js";

export default function SubjectEditor({ brand }) {
  const [subjects, setSubjects] = useState(readSubjects());
  const [newSub, setNewSub] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    // keep local copy in sync with storage
    setSubjects(readSubjects());
  }, []);

  function addSubject() {
    const v = newSub.trim();
    if (!v) return alert("Enter subject name");
    if (subjects.includes(v)) return alert("Subject already exists");
    const updated = [...subjects, v];
    writeSubjects(updated);
    setSubjects(updated);
    setNewSub("");
  }

  function startEdit(idx) {
    setEditingIndex(idx);
    setEditingValue(subjects[idx]);
  }

  function saveEdit(idx) {
    const v = editingValue.trim();
    if (!v) return alert("Enter subject name");
    if (subjects.includes(v) && subjects[idx] !== v) return alert("Subject already exists");
    const updated = subjects.map((s, i) => (i === idx ? v : s));
    writeSubjects(updated);
    setSubjects(updated);
    setEditingIndex(null);
    setEditingValue("");
  }

  function deleteSubject(idx) {
    if (!confirm("Delete subject? This will remove it from the global list but existing assignments that reference it will remain unchanged.")) return;
    const updated = subjects.filter((_, i) => i !== idx);
    writeSubjects(updated);
    setSubjects(updated);
  }

  return (
    <div className="p-4 card">
      <h3 className="text-lg h-title mb-3">Subjects</h3>
      <p className="text-sm text-gray-500 mb-3">Create and manage subjects used in assignments.</p>

      <div className="space-y-2 mb-3">
        {subjects.map((s, idx) => (
          <div key={s} className="flex items-center justify-between">
            {editingIndex === idx ? (
              <input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="input mr-2" />
            ) : (
              <div className="text-sm">{s}</div>
            )}
            <div className="flex gap-2">
              {editingIndex === idx ? (
                <>
                  <button onClick={() => saveEdit(idx)} className="btn btn-primary">Save</button>
                  <button onClick={() => setEditingIndex(null)} className="btn btn-ghost">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(idx)} className="px-3 py-1 border rounded-md text-sm">Edit</button>
                  <button onClick={() => deleteSubject(idx)} className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="New subject (e.g., Geography)" className="input" />
        <button onClick={addSubject} className="btn btn-primary">Add</button>
      </div>
    </div>
  );
}
