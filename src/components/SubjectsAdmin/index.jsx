import React, { useEffect, useMemo, useState } from "react";
import {
  readClasses,
  readTeachers,
  readSubjects,
  writeSubjects,
  readClassSubjectTeacherMappings,
  writeClassSubjectTeacherMappings,
  makeId,
} from "../../storage";
import { Pencil, Trash2, Plus, BookOpen, Link2 } from "lucide-react";

const classLabel = (c) =>
  c ? `${c.className || ""}-${c.division || ""} (${c.medium || "-"})` : "—";
const teacherLabel = (t) =>
  t
    ? `${t.salutation ? t.salutation + " " : ""}${t.firstName || ""} ${t.lastName || ""}`.trim()
    : "—";

export default function SubjectsAdmin({
  brand = { blue: "#0C3C78", orange: "#F15A24" },
}) {
  const [activeTab, setActiveTab] = useState("subjects"); // "subjects" | "mappings"

  // masters
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // mappings
  const [mappings, setMappings] = useState([]);

  // filters
  const [filterClassId, setFilterClassId] = useState("");

  // forms
  const [subForm, setSubForm] = useState({ id: null, name: "" });
  const [mapForm, setMapForm] = useState({
    id: null,
    classId: "",
    subjectId: "",
    teacherId: "",
  });

  // ---- Load once (don’t overwrite if data exists) ----
  useEffect(() => {
    const cls = readClasses();
    if (cls?.length) setClasses(cls);

    const tchs = readTeachers();
    if (tchs?.length) setTeachers(tchs);

    const subs = readSubjects();
    if (subs?.length) setSubjects(subs);

    const map = readClassSubjectTeacherMappings();
    if (map?.length) setMappings(map);
  }, []);

  // Persist
  useEffect(() => {
    writeSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    writeClassSubjectTeacherMappings(mappings);
  }, [mappings]);

  // Derived
  const filteredMappings = useMemo(() => {
    let list = [...mappings];
    if (filterClassId)
      list = list.filter((m) => String(m.classId) === String(filterClassId));
    return list.sort((a, b) => {
      const ac = String(a.classId).localeCompare(String(b.classId));
      if (ac !== 0) return ac;
      return String(a.subjectId).localeCompare(String(b.subjectId));
    });
  }, [mappings, filterClassId]);

  const classById = (id) => classes.find((c) => String(c.id) === String(id));
  const subjectById = (id) => subjects.find((s) => String(s.id) === String(id));
  const teacherById = (id) => teachers.find((t) => String(t.id) === String(id));

  // ----- Subjects Tab -----
  function clearSubjectForm() {
    setSubForm({ id: null, name: "" });
  }
  function startEditSubject(s) {
    setSubForm({ id: s.id, name: s.name || "" });
    setActiveTab("subjects");
  }
  function saveSubject(e) {
    e.preventDefault();
    const name = (subForm.name || "").trim();
    if (!name) return alert("Please enter subject name.");
    const payload = {
      id: subForm.id || makeId("sub"),
      name,
    };
    setSubjects((prev) => {
      const exists = prev.some((x) => x.id === payload.id);
      return exists ? prev.map((x) => (x.id === payload.id ? payload : x)) : [payload, ...prev];
    });
    clearSubjectForm();
  }
  function deleteSubject(id) {
    const used = mappings.some((m) => String(m.subjectId) === String(id));
    if (used && !confirm("This subject is used in mappings. Delete anyway?")) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // cleanup mappings if needed
    setMappings((prev) => prev.filter((m) => String(m.subjectId) !== String(id)));
  }

  // ----- Mappings Tab -----
  function clearMapForm() {
    setMapForm({ id: null, classId: "", subjectId: "", teacherId: "" });
  }
  function startEditMapping(m) {
    setMapForm({
      id: m.id,
      classId: String(m.classId),
      subjectId: String(m.subjectId),
      teacherId: String(m.teacherId || ""),
    });
    setActiveTab("mappings");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function saveMapping(e) {
    e.preventDefault();
    const { id, classId, subjectId, teacherId } = mapForm;
    if (!classId) return alert("Please select a class.");
    if (!subjectId) return alert("Please select a subject.");

    // enforce unique Class+Subject pair (one row per subject per class)
    const dup = mappings.find(
      (m) =>
        String(m.classId) === String(classId) &&
        String(m.subjectId) === String(subjectId) &&
        (id ? m.id !== id : true)
    );
    if (dup && !confirm("This class already has that subject mapped. Replace/allow anyway?")) {
      return;
    }

    const payload = {
      id: id || makeId("cst"),
      classId: String(classId),
      subjectId: String(subjectId),
      teacherId: teacherId ? String(teacherId) : "",
    };

    setMappings((prev) => {
      const exists = prev.some((x) => x.id === payload.id);
      return exists ? prev.map((x) => (x.id === payload.id ? payload : x)) : [payload, ...prev];
    });

    clearMapForm();
  }
  function deleteMapping(id) {
    if (!confirm("Delete this mapping?")) return;
    setMappings((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="p-3 rounded-xl shadow-sm border bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 transition ${
              activeTab === "subjects" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={activeTab === "subjects" ? { backgroundColor: brand.orange } : {}}
          >
            <BookOpen size={16} />
            Subjects
          </button>

          <button
            onClick={() => setActiveTab("mappings")}
            className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 transition ${
              activeTab === "mappings" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={activeTab === "mappings" ? { backgroundColor: brand.orange } : {}}
          >
            <Link2 size={16} />
            Mappings
          </button>
        </div>
      </div>

      {/* ===== SUBJECTS TAB ===== */}
      {activeTab === "subjects" && (
        <>
          {/* Form */}
          <div className="p-4 rounded-xl shadow-sm border bg-white">
            <h3 className="text-sm font-semibold mb-3" style={{ color: brand.blue }}>
              {subForm.id ? "Edit Subject" : "Add Subject"}
            </h3>
            <form onSubmit={saveSubject} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-600 mb-1 block">Subject Name</label>
                <input
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="e.g., Mathematics"
                  value={subForm.name}
                  onChange={(e) => setSubForm((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                  onClick={clearSubjectForm}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white flex items-center gap-2"
                  style={{ backgroundColor: brand.orange }}
                >
                  <Plus size={18} />
                  {subForm.id ? "Save Changes" : "Add Subject"}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="p-4 rounded-xl shadow-sm border bg-white">
            {subjects.length === 0 ? (
              <div className="text-sm text-gray-500 py-6 text-center">No subjects yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead style={{ backgroundColor: `${brand.blue}10` }}>
                    <tr>
                      <th className="px-3 py-2 text-left border-b">Subject</th>
                      <th className="px-3 py-2 text-center border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-b">{s.name}</td>
                        <td className="px-3 py-2 border-b text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-1.5 rounded hover:bg-blue-50"
                              title="Edit"
                              onClick={() => startEditSubject(s)}
                            >
                              <Pencil size={16} color={brand.blue} />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-red-50"
                              title="Delete"
                              onClick={() => deleteSubject(s.id)}
                            >
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
          </div>
        </>
      )}

      {/* ===== MAPPINGS TAB ===== */}
      {activeTab === "mappings" && (
        <>
          {/* Header + Filter */}
          <div className="p-4 rounded-xl shadow-sm border bg-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: brand.blue }}>
                  Create / Edit Mappings
                </h3>
                <p className="text-xs text-gray-500">
                  Map a subject to a class and optionally assign a teacher.
                </p>
              </div>
              <div className="min-w-[260px]">
                <label className="text-xs text-gray-600 mb-1 block">Filter by Class</label>
                <select
                  value={filterClassId}
                  onChange={(e) => setFilterClassId(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="">All classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {classLabel(c)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 rounded-xl shadow-sm border bg-white">
            <form onSubmit={saveMapping} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Class</label>
                <select
                  value={mapForm.classId}
                  onChange={(e) => setMapForm((s) => ({ ...s, classId: e.target.value }))}
                  className="border rounded-md px-3 py-2 w-full"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {classLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Subject</label>
                <select
                  value={mapForm.subjectId}
                  onChange={(e) => setMapForm((s) => ({ ...s, subjectId: e.target.value }))}
                  className="border rounded-md px-3 py-2 w-full"
                  disabled={!mapForm.classId}
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Teacher (optional)</label>
                <select
                  value={mapForm.teacherId}
                  onChange={(e) => setMapForm((s) => ({ ...s, teacherId: e.target.value }))}
                  className="border rounded-md px-3 py-2 w-full"
                >
                  <option value="">— Not assigned —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {teacherLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={clearMapForm}
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white flex items-center gap-2"
                  style={{ backgroundColor: brand.orange }}
                >
                  <Plus size={18} />
                  {mapForm.id ? "Save Changes" : "Add Mapping"}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="p-4 rounded-xl shadow-sm border bg-white">
            {filteredMappings.length === 0 ? (
              <div className="text-sm text-gray-500 py-6 text-center">No mappings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead style={{ backgroundColor: `${brand.blue}10` }}>
                    <tr>
                      <th className="px-3 py-2 text-left border-b">Class</th>
                      <th className="px-3 py-2 text-left border-b">Subject</th>
                      <th className="px-3 py-2 text-left border-b">Teacher</th>
                      <th className="px-3 py-2 text-center border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMappings.map((m) => {
                      const c = classById(m.classId);
                      const s = subjectById(m.subjectId);
                      const t = teacherById(m.teacherId);
                      return (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 border-b">{classLabel(c)}</td>
                          <td className="px-3 py-2 border-b">{s?.name || "—"}</td>
                          <td className="px-3 py-2 border-b">{teacherLabel(t)}</td>
                          <td className="px-3 py-2 border-b text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-1.5 rounded hover:bg-blue-50"
                                title="Edit"
                                onClick={() => startEditMapping(m)}
                              >
                                <Pencil size={16} color={brand.blue} />
                              </button>
                              <button
                                className="p-1.5 rounded hover:bg-red-50"
                                title="Delete"
                                onClick={() => deleteMapping(m.id)}
                              >
                                <Trash2 size={16} color="#dc2626" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
