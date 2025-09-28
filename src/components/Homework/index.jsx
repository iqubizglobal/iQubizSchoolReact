// src/components/Homework/index.jsx
import React, { useEffect, useState } from "react";
import {
  readAssignments,
  writeAssignments,
  readClasses,
  readSubjects,
  readClassSubjectTeacherMappings,
} from "../../storage";
import { Plus, Trash2, Paperclip } from "lucide-react";

export default function Homework({ currentRole, brand }) {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Load persisted data
  useEffect(() => {
    setClasses(readClasses());
    setSubjects(readSubjects());
    setMappings(readClassSubjectTeacherMappings());
    setAssignments(readAssignments());
  }, []);

  // Filter subjects based on selected class using mapping
  const filteredSubjects = classId
    ? subjects.filter((sub) =>
        mappings.some(
          (m) =>
            String(m.classId) === String(classId) &&
            String(m.subjectId) === String(sub.id)
        )
      )
    : [];

  const resetForm = () => {
    setSubjectId("");
    setDescription("");
    setDueDate("");
    setAttachments([]);
  };

  const handleAddHomework = () => {
    if (!classId || !subjectId || !description || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    const newRecord = {
      id: `hw_${Date.now()}`,
      classId,
      subjectId,
      description,
      dueDate,
      attachments,
      createdAt: new Date().toISOString(),
    };

    const updated = [...assignments, newRecord];
    setAssignments(updated);
    writeAssignments(updated);
    resetForm();
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this homework?")) return;
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    writeAssignments(updated);
  };

  const classLabel = (cid) => {
    const c = classes.find((cl) => String(cl.id) === String(cid));
    return c ? `${c.className}-${c.division} (${c.medium})` : "—";
  };

  const subjectLabel = (sid) => {
    const s = subjects.find((sb) => String(sb.id) === String(sid));
    return s ? s.name : "—";
  };

  const dueBadge = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr < today)
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
          {dateStr}
        </span>
      );
    if (dateStr === today)
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
          Today
        </span>
      );
    return (
      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
        {dateStr}
      </span>
    );
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileList = files.map((f) => f.name); // mock file names
    setAttachments((prev) => [...prev, ...fileList]);
  };

  const removeAttachment = (name) => {
    setAttachments((prev) => prev.filter((f) => f !== name));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: brand.blue }}
      >
        Homework Management
      </h2>

      {/* Add Homework Form */}
      {(currentRole === "Teacher" ||
        currentRole === "Principal" ||
        currentRole === "Owner") && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Class</label>
            <select
              className="input w-full"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className}-{c.division} ({c.medium})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Subject</label>
            <select
              className="input w-full"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!classId}
            >
              <option value="">Select subject</option>
              {filteredSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Due Date</label>
            <input
              type="date"
              className="input w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">
              Description
            </label>
            <textarea
              className="input w-full h-20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Homework details"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100"
                >
                  <Paperclip size={12} />
                  <span>{a}</span>
                  <button
                    onClick={() => removeAttachment(a)}
                    className="text-red-500 text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddHomework}
              className="flex items-center gap-2 px-4 py-2 rounded text-white"
              style={{ backgroundColor: brand.orange }}
            >
              <Plus size={16} />
              Add Homework
            </button>
          </div>
        </div>
      )}

      {/* Homework List */}
      <h3
        className="text-sm font-semibold mb-2"
        style={{ color: brand.blue }}
      >
        Homework List
      </h3>
      {assignments.length === 0 ? (
        <p className="text-sm text-gray-500">No homework assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Due Date</th>
                <th className="px-3 py-2 text-left">Attachments</th>
                {(currentRole === "Teacher" ||
                  currentRole === "Principal" ||
                  currentRole === "Owner") && (
                  <th className="px-3 py-2 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{classLabel(a.classId)}</td>
                  <td className="px-3 py-2">{subjectLabel(a.subjectId)}</td>
                  <td className="px-3 py-2 whitespace-pre-wrap">
                    {a.description}
                  </td>
                  <td className="px-3 py-2">{dueBadge(a.dueDate)}</td>
                  <td className="px-3 py-2">
                    {a.attachments?.length ? (
                      <ul className="list-disc pl-4 text-xs">
                        {a.attachments.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                  {(currentRole === "Teacher" ||
                    currentRole === "Principal" ||
                    currentRole === "Owner") && (
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} color="#dc2626" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
