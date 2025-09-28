import React, { forwardRef } from "react";

const ResultCard = forwardRef(({ student, results, examInfo }, ref) => {
  if (!student) return null;

  return (
    <div ref={ref} className="bg-white rounded-xl shadow p-4 mb-4">
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
          <span className="text-sm text-gray-500">Class: {student.className}</span>
        </div>
        <div className="text-xs text-gray-600 flex gap-4 flex-wrap">
          <div><strong>Exam:</strong> {examInfo.examName}</div>
          <div><strong>Term:</strong> {examInfo.term}</div>
          <div><strong>Year:</strong> {examInfo.academicYear}</div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border-b">Subject</th>
            <th className="p-2 text-right border-b">Marks</th>
            <th className="p-2 text-center border-b">Grade</th>
            <th className="p-2 text-left border-b">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2">{r.subject}</td>
              <td className="p-2 text-right">{r.marks}</td>
              <td className="p-2 text-center font-semibold">{r.grade}</td>
              <td className="p-2">{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ResultCard;
