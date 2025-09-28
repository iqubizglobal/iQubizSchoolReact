import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ResultCard from "./ResultCard";

export default function Results({ currentRole, users, brand = {} }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [classResults, setClassResults] = useState({});

  // ✅ Safe brand defaults
  const safeBrand = {
    blue: brand?.blue || "#0C3C78",
    orange: brand?.orange || "#FF7A00",
    light: brand?.light || "#F7FAFC",
    logo: brand?.logo || null,
    schoolName: brand?.schoolName || "School Name",
    schoolAddress: brand?.schoolAddress || "School Address",
  };

  // 📝 Exam Info
  const examInfo = {
    examName: "Mid Term Examination",
    term: "Term 1",
    academicYear: "2025–2026",
  };

  // 📊 Dummy Result Data
  const mockResults = {
    "1A": [
      {
        studentId: 1,
        name: "Aarav Mehta",
        className: "1A",
        rollNo: "101",
        results: [
          { subject: "Math", marks: 92, grade: "A+", remarks: "Excellent" },
          { subject: "Science", marks: 85, grade: "A", remarks: "Very Good" },
          { subject: "English", marks: 88, grade: "A", remarks: "Well done" },
        ],
      },
      {
        studentId: 2,
        name: "Ishita Sharma",
        className: "1A",
        rollNo: "102",
        results: [
          { subject: "Math", marks: 76, grade: "B+", remarks: "Good" },
          { subject: "Science", marks: 80, grade: "A", remarks: "Nice work" },
          { subject: "English", marks: 90, grade: "A+", remarks: "Excellent" },
        ],
      },
    ],
  };

  const fetchClassResults = (className) => {
    setClassResults({ [className]: mockResults[className] || [] });
  };

  // ================= PDF UTILS =================

  const drawPDFHeader = (pdf, student) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const y = 12;

    if (safeBrand.logo) {
      try {
        pdf.addImage(safeBrand.logo, "PNG", 10, 8, 20, 20);
      } catch {}
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(safeBrand.schoolName, 35, y + 4);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(safeBrand.schoolAddress, 35, y + 12);

    pdf.setFontSize(10);
    pdf.text(`Exam: ${examInfo.examName}`, pageWidth - 10, y + 4, { align: "right" });
    pdf.text(`Term: ${examInfo.term}`, pageWidth - 10, y + 10, { align: "right" });
    pdf.text(`Year: ${examInfo.academicYear}`, pageWidth - 10, y + 16, { align: "right" });

    const infoY = 30;
    pdf.setFontSize(11);
    pdf.text(`Name: ${student.name}`, 10, infoY);
    pdf.text(`Class: ${student.className}`, 80, infoY);
    pdf.text(`Roll No: ${student.rollNo}`, 150, infoY);

    pdf.setDrawColor(170);
    pdf.line(10, infoY + 4, pageWidth - 10, infoY + 4);
  };

  const drawPDFFooter = (pdf) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const footerY = pageHeight - 22;

    pdf.setDrawColor(120);
    pdf.line(10, footerY, 60, footerY);
    pdf.line(80, footerY, 130, footerY);
    pdf.line(pageWidth - 60, footerY, pageWidth - 10, footerY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Class Teacher", 10, footerY + 5);
    pdf.text("Principal", 80, footerY + 5);
    pdf.text("Parent/Guardian", pageWidth - 60, footerY + 5);

    const today = new Date().toLocaleDateString();
    pdf.text(`Date: ${today}`, 10, pageHeight - 6);

    const pageCount = pdf.internal.getNumberOfPages();
    const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
    pdf.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 10, pageHeight - 6, {
      align: "right",
    });
  };

  const renderStudentResult = (pdf, student) => {
    autoTable(pdf, {
      head: [["Subject", "Marks", "Grade", "Remarks"]],
      body: student.results.map((r) => [r.subject, r.marks, r.grade, r.remarks]),
      theme: "grid",
      startY: 38,
      styles: { fontSize: 10, cellPadding: 3, lineWidth: 0.1 },
      headStyles: { fillColor: [12, 60, 120], textColor: 255, halign: "center" },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "center" } },
      margin: { left: 10, right: 10, top: 38, bottom: 28 },
      didDrawPage: () => {
        drawPDFHeader(pdf, student);
        drawPDFFooter(pdf);
      },
    });
  };

  const downloadStudentPDF = (student) => {
    const pdf = new jsPDF();
    renderStudentResult(pdf, student);
    pdf.save(`${student.name}_Result.pdf`);
  };

  const downloadClassPDF = (className) => {
    const students = classResults[className] || [];
    const pdf = new jsPDF();

    students.forEach((student, idx) => {
      if (idx > 0) pdf.addPage();
      renderStudentResult(pdf, student);
    });

    pdf.save(`${className}_Class_Results.pdf`);
  };

  // ================= UI =================

  // STUDENT VIEW 👇
  if (currentRole === "Student") {
    const studentUser = users.find((u) => u.role === "Student");
    const studentData =
      mockResults[studentUser?.className]?.find((s) => s.name === studentUser?.name) || null;

    if (!studentData) {
      return <div className="p-4 card">No results found for your profile.</div>;
    }

    return (
      <div className="p-4 card space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">My Result</h2>
          <p className="text-sm text-gray-600">
            {examInfo.examName} — {examInfo.term} ({examInfo.academicYear})
          </p>
        </div>

        {/* On-screen result table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-[var(--brand-blue)] text-white">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-right">Marks</th>
                <th className="p-2 text-center">Grade</th>
                <th className="p-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {studentData.results.map((r, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{r.subject}</td>
                  <td className="p-2 text-right">{r.marks}</td>
                  <td className="p-2 text-center">{r.grade}</td>
                  <td className="p-2">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download button */}
        <div className="pt-2">
          <button
            onClick={() => downloadStudentPDF(studentData)}
            className="px-4 py-2 rounded text-white font-medium"
            style={{ backgroundColor: safeBrand.blue }}
          >
            📄 Download Result Card
          </button>
        </div>
      </div>
    );
  }

  // TEACHER / PRINCIPAL / OWNER VIEW 👇
  return (
    <div className="p-4 card">
      <h2 className="text-xl font-bold mb-4">Class Results</h2>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchClassResults(e.target.value);
          }}
          className="input"
        >
          <option value="">Select Class</option>
          {Object.keys(mockResults).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {selectedClass && (
          <button
            onClick={() => downloadClassPDF(selectedClass)}
            className="px-4 py-2 rounded text-white font-medium"
            style={{ backgroundColor: safeBrand.orange }}
          >
            📥 Download Class PDF
          </button>
        )}
      </div>

      {selectedClass && classResults[selectedClass] && (
        <div>
          {classResults[selectedClass].map((student) => (
            <ResultCard
              key={student.studentId}
              student={student}
              results={student.results}
              examInfo={examInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
