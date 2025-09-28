import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TimetableView({ className, timetable, brand = {} }) {
  const safeBrand = {
    blue: brand.blue || "#0C3C78",
    orange: brand.orange || "#FF7A00",
    logo: brand.logo || null,
    schoolName: brand.schoolName || "School Name",
    schoolAddress: brand.schoolAddress || "School Address",
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    if (safeBrand.logo) {
      try {
        pdf.addImage(safeBrand.logo, "PNG", 10, 8, 20, 20);
      } catch {}
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(safeBrand.schoolName, 35, 15);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(safeBrand.schoolAddress, 35, 22);

    pdf.setFontSize(11);
    pdf.text(`Class Timetable - ${className}`, pageWidth / 2, 35, { align: "center" });

    // Table
    autoTable(pdf, {
      head: [["Day", "Period", "Subject", "Teacher"]],
      body: timetable.map((row) => [row.day, row.period, row.subject, row.teacher]),
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [12, 60, 120], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    pdf.save(`${className}_Timetable.pdf`);
  };

  if (!timetable.length) return <div>No timetable set for {className}.</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-center">Period</th>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{row.day}</td>
                <td className="p-2 text-center">{row.period}</td>
                <td className="p-2">{row.subject}</td>
                <td className="p-2">{row.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={downloadPDF}
        className="px-4 py-2 rounded text-white"
        style={{ backgroundColor: safeBrand.blue }}
      >
        📄 Download Timetable
      </button>
    </div>
  );
}
