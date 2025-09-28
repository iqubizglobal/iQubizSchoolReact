import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableMatrixView({ className, timetable, brand = {} }) {
  if (!timetable || !timetable.periods.length) return <div>No timetable found.</div>;

  const safeBrand = {
    blue: brand.blue || "#0C3C78",
    orange: brand.orange || "#FF7A00",
    logo: brand.logo || null,
    schoolName: brand.schoolName || "School Name",
    schoolAddress: brand.schoolAddress || "School Address",
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    if (safeBrand.logo) {
      try {
        pdf.addImage(safeBrand.logo, "PNG", 40, 20, 40, 40);
      } catch {}
    }
    pdf.setFontSize(14);
    pdf.text(safeBrand.schoolName, 100, 40);
    pdf.setFontSize(10);
    pdf.text(safeBrand.schoolAddress, 100, 55);
    pdf.setFontSize(12);
    pdf.text(`Class Timetable - ${className}`, pageWidth / 2, 85, { align: "center" });

    // Table data
    const head = ["Period (Time)", ...daysOfWeek];
    const body = timetable.periods.map((p) => [
      `${p.name}\n${p.time}`,
      ...daysOfWeek.map((day) => {
        const cell = timetable.data[p.name]?.[day];
        return cell ? `${cell.subject}\n(${cell.teacher})` : "";
      }),
    ]);

    autoTable(pdf, {
      head: [head],
      body,
      startY: 100,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, valign: "middle" },
      headStyles: { fillColor: [12, 60, 120], textColor: 255 },
    });

    pdf.save(`${className}_Timetable.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Period (Time)</th>
              {daysOfWeek.map((d) => (
                <th key={d} className="p-2">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.periods.map((p) => (
              <tr key={p.name} className="border-b">
                <td className="p-2 font-medium">
                  {p.name}
                  <div className="text-xs text-gray-500">{p.time}</div>
                </td>
                {daysOfWeek.map((day) => {
                  const cell = timetable.data[p.name]?.[day];
                  return (
                    <td key={day} className="p-2">
                      {cell ? (
                        <>
                          <div className="font-semibold">{cell.subject}</div>
                          <div className="text-xs text-gray-600">{cell.teacher}</div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
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
