import React, { useEffect, useState } from "react";
import {
  readClasses,
  readExamSchedules,
  writeExamSchedules,
  readSubjects,
} from "../../storage";
import { Plus, Trash2, Download, Edit3, Check } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExamSchedule({ currentRole, brand }) {
  // ✅ lazy init pulls from storage even on first paint
  const [schedules, setSchedules] = useState(() => readExamSchedules());
  const [classes, setClasses] = useState(() => readClasses() || []);
  const [subjects, setSubjects] = useState(() => readSubjects() || []);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    classId: "",
    examName: "",
    term: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // ✅ also re-read on mount (covers HMR & conditional remounts)
  useEffect(() => {
    setSchedules(readExamSchedules());
    setClasses(readClasses() || []);
    setSubjects(readSubjects() || []);
  }, []);

  // ✅ persist on any change
  useEffect(() => {
    writeExamSchedules(schedules);
  }, [schedules]);

  // ✅ keep in sync if storage changes in other tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "exam_schedules_v1") {
        setSchedules(readExamSchedules());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isPrivileged = ["Owner", "Principal", "Teacher"].includes(currentRole);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { classId, examName, term, subject, date, startTime, endTime } = form;
    if (!classId || !examName || !term || !subject || !date || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    if (editId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editId
            ? {
                ...s,
                classId: Number(classId),
                examName,
                term,
                subject,
                date,
                startTime,
                endTime,
              }
            : s
        )
      );
      setEditId(null);
    } else {
      setSchedules((prev) => [
        ...prev,
        {
          id: Date.now(),
          classId: Number(classId),
          examName,
          term,
          subject,
          date,
          startTime,
          endTime,
        },
      ]);
    }

    setForm({
      classId: "",
      examName: "",
      term: "",
      subject: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  }

  function handleEdit(s) {
    setForm({
      classId: String(s.classId),
      examName: s.examName,
      term: s.term,
      subject: s.subject,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    });
    setEditId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (!confirm("Delete this schedule?")) return;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (editId === id) setEditId(null);
  }

  function getClassLabel(classId) {
    const c = classes.find((cls) => Number(cls.id) === Number(classId));
    return c ? `${c.className}-${c.division} (${c.medium})` : "—";
  }

  function downloadClassPDF(classId) {
    const doc = new jsPDF();
    const clsLabel = getClassLabel(classId);
    const classSchedules = schedules.filter((s) => Number(s.classId) === Number(classId));

    doc.setFontSize(16);
    doc.setTextColor(brand?.blue || "#0C3C78");
    doc.text(`Exam Schedule - ${clsLabel}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Exam Name", "Term", "Subject", "Date", "Start", "End"]],
      body: classSchedules.map((s) => [
        s.examName,
        s.term,
        s.subject,
        s.date,
        s.startTime,
        s.endTime,
      ]),
      theme: "grid",
      headStyles: { fillColor: brand?.blue || "#0C3C78" },
    });

    doc.save(`ExamSchedule_${clsLabel}.pdf`);
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: brand?.blue }}>
          Exam Schedule
        </h2>
      </div>

      {isPrivileged && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Class</label>
            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {`${c.className}-${c.division} (${c.medium})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Exam Name</label>
            <input
              type="text"
              name="examName"
              value={form.examName}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Term</label>
            <input
              type="text"
              name="term"
              value={form.term}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Subject</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map((s, idx) => (
                <option key={`${s}-${idx}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className={`${
                editId ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
              } text-white rounded px-3 py-2 text-sm flex items-center gap-1`}
            >
              {editId ? <Check size={16} /> : <Plus size={16} />}
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Class</th>
              <th className="p-2">Exam</th>
              <th className="p-2">Term</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Date</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              {isPrivileged && <th className="p-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-3 text-center text-gray-500">
                  No exam schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{getClassLabel(s.classId)}</td>
                  <td className="p-2">{s.examName}</td>
                  <td className="p-2">{s.term}</td>
                  <td className="p-2">{s.subject}</td>
                  <td className="p-2">{s.date}</td>
                  <td className="p-2">{s.startTime}</td>
                  <td className="p-2">{s.endTime}</td>
                  {isPrivileged && (
                    <td className="p-2 text-right flex gap-2 justify-end">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(s)}
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {classes.length > 0 && schedules.length > 0 && (
        <div className="mt-4">
          <label className="text-xs text-gray-600 mb-1 block">
            Download Exam Schedule PDF by Class
          </label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => downloadClassPDF(c.id)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                <Download size={14} />
                {`${c.className}-${c.division} (${c.medium})`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
