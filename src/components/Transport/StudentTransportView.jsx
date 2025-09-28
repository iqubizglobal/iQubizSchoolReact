import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  readTransportMapping,
  readTransportRoutes,
  readUsers,
  readSettings,
} from "../../storage";

export default function StudentTransportView({ brand }) {
  const [student, setStudent] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [route, setRoute] = useState(null);
  const [settings, setSettings] = useState(readSettings());

  useEffect(() => {
    // Simulate logged-in student — for real app you'd use auth
    const allUsers = readUsers();
    const loggedIn =
      allUsers.find((u) => u.role === "Student" && u.isLoggedIn) || allUsers[0];

    if (!loggedIn) return;

    setStudent(loggedIn);

    const map = readTransportMapping();
    const studentMapping = map[loggedIn.id];
    setMapping(studentMapping);

    if (studentMapping) {
      const routes = readTransportRoutes();
      const r = routes.find(
        (rt) => String(rt.id) === String(studentMapping.routeId)
      );
      setRoute(r);
    }
  }, []);

  if (!student) {
    return (
      <div className="p-4 bg-white rounded shadow text-center">
        <p className="text-gray-500 text-sm">
          No student found. Please log in as a student.
        </p>
      </div>
    );
  }

  if (!mapping || !route) {
    return (
      <div className="p-4 bg-white rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-2" style={{ color: brand.blue }}>
          Transport Details
        </h2>
        <p className="text-gray-500 text-sm">
          No transport mapping available for {student.name}.
        </p>
      </div>
    );
  }

  // 📝 Generate PDF with jspdf
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // === Header ===
    if (settings?.logo) {
      doc.addImage(settings.logo, "PNG", 15, 10, 25, 25);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(settings?.schoolName || "My School", pageWidth / 2, 18, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(settings?.schoolAddress || "School Address", pageWidth / 2, 25, {
      align: "center",
    });

    doc.line(15, 35, pageWidth - 15, 35);

    // === Student Info ===
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Student Transport Details", pageWidth / 2, 45, {
      align: "center",
    });

    autoTable(doc, {
      startY: 52,
      head: [["Field", "Details"]],
      body: [
        ["Name", student.name],
        ["Class", student.className || "—"],
        ["Route", route.name],
        ["Driver", route.driverName || "—"],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [12, 60, 120] }, // blue header
      theme: "grid",
      margin: { left: 15, right: 15 },
    });

    // === Transport Details Table ===
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Pickup Stop", "Pickup Time", "Drop Stop", "Drop Time"]],
      body: [
        [
          mapping.pickupStop,
          mapping.pickupTime || "—",
          mapping.dropStop,
          mapping.dropTime || "—",
        ],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [241, 90, 36] }, // orange header
      theme: "grid",
      margin: { left: 15, right: 15 },
    });

    // === Footer ===
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`Transport_${student.name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4" style={{ color: brand.blue }}>
        My Transport Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded border bg-gray-50">
          <h3 className="text-sm font-semibold mb-1">Student</h3>
          <p className="text-gray-700">{student.name}</p>
          <p className="text-gray-500 text-sm">{student.className}</p>
        </div>

        <div className="p-4 rounded border bg-gray-50">
          <h3 className="text-sm font-semibold mb-1">Route</h3>
          <p className="text-gray-700">{route.name}</p>
          <p className="text-gray-500 text-sm">{route.driverName || "—"}</p>
        </div>

        <div className="p-4 rounded border bg-gray-50">
          <h3 className="text-sm font-semibold mb-1">Pickup Stop</h3>
          <p className="text-gray-700">{mapping.pickupStop}</p>
          {mapping.pickupTime && (
            <p className="text-gray-500 text-sm">⏰ {mapping.pickupTime}</p>
          )}
        </div>

        <div className="p-4 rounded border bg-gray-50">
          <h3 className="text-sm font-semibold mb-1">Drop Stop</h3>
          <p className="text-gray-700">{mapping.dropStop}</p>
          {mapping.dropTime && (
            <p className="text-gray-500 text-sm">⏰ {mapping.dropTime}</p>
          )}
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          className="px-4 py-2 rounded text-white"
          style={{ backgroundColor: brand.orange }}
          onClick={generatePDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
