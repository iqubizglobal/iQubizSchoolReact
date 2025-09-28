import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExamScheduleEditor({ examSchedules, setExamSchedules, brand = {} }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({
    examName: "",
    term: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleAdd = () => {
    const { examName, term, subject, date, startTime, endTime } = form;
    if (!selectedClass || !examName || !term || !subject || !date || !startTime || !endTime) {
      alert("Please fill all fields (including start & end time).");
      return;
    }

    setExamSchedules(prev => {
      const copy = { ...prev };
      const list = copy[selectedClass] || [];
      copy[selectedClass] = [...list, { examName, term, subject, date, startTime, endTime }];
      return copy;
    });

    setForm({ examName: "", term: "", subject: "", date: "", startTime: "", endTime: "" });
  };

  const handleDelete = (idx) => {
    if (!selectedClass) return;
    setExamSchedules(prev => {
      const copy = { ...prev };
      copy[selectedClass] = (copy[selectedClass] || []).filter((_, i) => i !== idx);
      return copy;
    });
  };

  const handleBatchExport = () => {
    if (!selectedClass || !examSchedules[selectedClass] || examSchedules[selectedClass].length === 0) {
      alert("Please select a class that has an exam schedule.");
      return;
    }

    const schedule = examSchedules[selectedClass];
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // --- HEADER ---
    if (brand.logo) {
      try {
        pdf.addImage(brand.logo, "PNG", 40, 20, 40, 40);
      } catch {}
    }
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(brand.schoolName || "School Name", 100, 40);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(brand.schoolAddress || "School Address", 100, 55);

    pdf.setFontSize(12);
    pdf.text(`Class ${selectedClass} - Exam Schedule`, pageWidth / 2, 90, { align: "center" });

    // --- TABLE ---
    autoTable(pdf, {
      head: [["Exam", "Term", "Subject", "Date", "Start", "End"]],
      body: schedule.map(e => [
        e.examName,
        e.term,
        e.subject,
        e.date,
        e.startTime,
        e.endTime,
      ]),
      startY: 110,
      theme: "grid",
      headStyles: { fillColor: [12, 60, 120], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60 },
        2: { cellWidth: 120 },
        3: { halign: "center", cellWidth: 80 },
        4: { halign: "center", cellWidth: 60 },
        5: { halign: "center", cellWidth: 60 },
      },
    });

    pdf.save(`Exam_Schedule_${selectedClass}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* CLASS */}
      <input
        type="text"
        placeholder="Class (e.g. 1A)"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="input"
      />

      {/* FORM */}
      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <input
            type="text"
            placeholder="Exam Name"
            value={form.examName}
            onChange={(e) => setForm({ ...form, examName: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Term"
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="input"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="input"
          />

          <button onClick={handleAdd} className="bg-[var(--brand-blue)] text-white px-3 py-2 rounded md:col-span-6">
            ➕ Add
          </button>
        </div>
      )}

      {/* LIST */}
      {selectedClass && (examSchedules[selectedClass] || []).length > 0 && (
        <>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Exam</th>
                  <th className="p-2 text-left">Term</th>
                  <th className="p-2 text-left">Subject</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2 text-left">End</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(examSchedules[selectedClass] || []).map((exam, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{exam.examName}</td>
                    <td className="p-2">{exam.term}</td>
                    <td className="p-2">{exam.subject}</td>
                    <td className="p-2">{exam.date}</td>
                    <td className="p-2">{exam.startTime}</td>
                    <td className="p-2">{exam.endTime}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleDelete(idx)} className="text-red-500 hover:underline">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleBatchExport}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            📄 Download Class Schedule PDF
          </button>
        </>
      )}
    </div>
  );
}
