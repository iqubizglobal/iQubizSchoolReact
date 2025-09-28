import React, { useState } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableEditor({ timetables, setTimetables }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [periodTime, setPeriodTime] = useState("");

  const [form, setForm] = useState({
    day: "",
    period: "",
    subject: "",
    teacher: "",
  });

  const ensureClassStructure = (cls) => {
    setTimetables((prev) => ({
      ...prev,
      [cls]: prev[cls] || { periods: [], data: {} },
    }));
  };

  const addPeriod = () => {
    if (!selectedClass || !periodName || !periodTime) return;
    ensureClassStructure(selectedClass);

    setTimetables((prev) => {
      const t = { ...prev };
      const classTimetable = t[selectedClass];

      // add period if not exists
      if (!classTimetable.periods.find((p) => p.name === periodName)) {
        classTimetable.periods.push({ name: periodName, time: periodTime });
        classTimetable.data[periodName] = {};
      }
      return t;
    });

    setPeriodName("");
    setPeriodTime("");
  };

  const addSubjectToCell = () => {
    const { day, period, subject, teacher } = form;
    if (!selectedClass || !day || !period || !subject) return;

    setTimetables((prev) => {
      const t = { ...prev };
      const classData = t[selectedClass];
      if (!classData.data[period]) classData.data[period] = {};
      classData.data[period][day] = { subject, teacher };
      return t;
    });

    setForm({ day: "", period: "", subject: "", teacher: "" });
  };

  const timetable = timetables[selectedClass];

  return (
    <div className="space-y-4">
      {/* CLASS SELECTION */}
      <input
        type="text"
        placeholder="Class (e.g. 1A)"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="input"
      />

      {/* ADD PERIOD */}
      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Period Name (e.g. Period 1)"
            value={periodName}
            onChange={(e) => setPeriodName(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Time Slot (e.g. 8:00 - 8:45)"
            value={periodTime}
            onChange={(e) => setPeriodTime(e.target.value)}
            className="input"
          />
          <button
            onClick={addPeriod}
            className="bg-[var(--brand-blue)] text-white px-3 py-2 rounded"
          >
            ➕ Add Period
          </button>
        </div>
      )}

      {/* ADD SUBJECT TO CELL */}
      {selectedClass && timetable && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="input"
          >
            <option value="">Day</option>
            {daysOfWeek.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="input"
          >
            <option value="">Period</option>
            {timetable.periods.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Teacher"
            value={form.teacher}
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
            className="input"
          />
          <button
            onClick={addSubjectToCell}
            className="bg-[var(--brand-blue)] text-white px-3 py-2 rounded"
          >
            💾 Save
          </button>
        </div>
      )}
    </div>
  );
}
