import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExamScheduleView({ className, schedule, brand = {} }) {
  if (!schedule.length) {
    return <div>No exam schedule available for class {className}.</div>;
  }

  const safeBrand = {
    blue: brand.blue || "#0C3C78",
    orange: brand.orange || "#FF7A00",
    logo: brand.logo || null,
    schoolName: brand.schoolName || "School Name",
    schoolAddress: brand.schoolAddress || "School Address",
  };

  const examName = schedule[0]?.examName || "";
  const term = schedule[0]?.term || "";

  const rows = schedule.map((row) => ({
    examName: row.examName,
    term: row.term,
    subject: row.subject,
    date: row.date,
    startTime: row.startTime || parseStart(row.time),
    endTime: row.endTime || parseEnd(row.time),
  }));

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    if (safeBrand.logo) {
      try { pdf.addImage(safeBrand.logo, "PNG", 40, 20, 40, 40); } catch {}
    }
    pdf.setFontSize(14); pdf.setFont("helvetica", "bold");
    pdf.text(safeBrand.schoolName, 100, 40);
    pdf.setFontSize(10); pdf.setFont("helvetica", "normal");
    pdf.text(safeBrand.schoolAddress, 100, 55);

    pdf.setFontSize(12);
    pdf.text(`Exam Schedule - Class ${className}`, pageWidth / 2, 90, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`Exam: ${examName}`, 40, 110);
    pdf.text(`Term: ${term}`, pageWidth - 40, 110, { align: "right" });

    // Table
    autoTable(pdf, {
      head: [["Subject", "Date", "Start", "End"]],
      body: rows.map(r => [r.subject, r.date, r.startTime, r.endTime]),
      startY: 125,
      theme: "grid",
      headStyles: { fillColor: [12, 60, 120], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 180 },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
      },
    });

    pdf.save(`Exam_Schedule_${className}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Exam Name</th>
              <th className="p-2 text-left">Term</th>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((exam, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{exam.examName}</td>
                <td className="p-2">{exam.term}</td>
                <td className="p-2">{exam.subject}</td>
                <td className="p-2">{exam.date}</td>
                <td className="p-2">{exam.startTime}</td>
                <td className="p-2">{exam.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={downloadPDF}
        className="px-4 py-2 rounded text-white font-medium"
        style={{ backgroundColor: safeBrand.blue }}
      >
        📄 Download Exam Schedule
      </button>
    </div>
  );
}

function parseStart(timeStr) {
  if (!timeStr) return "-";
  const [start] = timeStr.split("-").map(s => s.trim());
  return start || "-";
}
function parseEnd(timeStr) {
  if (!timeStr) return "-";
  const parts = timeStr.split("-").map(s => s.trim());
  return parts[1] || "-";
}
