// src/components/Students/StudentIDCard.jsx
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * StudentIDCard
 *
 * Props:
 *  - student: object (expects fields: name, cls, roll, grNo, address, parentContact, photo, age)
 *  - school: { name, address }
 *  - onClose: function
 *
 * Provides a "Download PDF" button which captures the card and downloads a PDF.
 */

export default function StudentIDCard({ student = {}, school = {}, onClose = () => {} }) {
  const cardRef = useRef(null);

  async function handleDownloadPDF() {
    if (!cardRef.current) return alert("Nothing to export");

    try {
      // Use a higher scale for better quality in PDF
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF (A4 portrait)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Margins
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;

      // Keep aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = availableWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // If image is taller than page, scale to fit page height minus margins
      let renderWidth = imgWidth;
      let renderHeight = imgHeight;
      if (renderHeight > pageHeight - margin * 2) {
        renderHeight = pageHeight - margin * 2;
        renderWidth = (imgProps.width * renderHeight) / imgProps.height;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
      const filenameName = (student.name || "student").replace(/\s+/g, "_");
      pdf.save(`${filenameName}_ID_Card.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. See console for details.");
    }
  }

  // Optional: quick print (opens print dialog)
  async function handlePrint() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const w = window.open("");
    if (!w) return alert("Popup blocked. Allow popups for this site to print.");
    w.document.write(`<html><head><title>Print ID</title></head><body style="margin:0"><img src="${imgData}" style="width:100%;height:auto" /></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  return (
    <>
      {/* Overlay + modal wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* Card that will be captured by html2canvas */}
        <div
          ref={cardRef}
          className="relative z-10 bg-white rounded-2xl shadow-xl p-5 w-[340px]"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
            color: "#111827",
            boxShadow: "0 12px 40px rgba(2,6,23,0.12)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Header: School */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-blue, #0C3C78)" }}>
                {school.name || "Your School Name"}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>{school.address || "School address line 1, City, State"}</div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Photo */}
              <div style={{ width: 92, height: 112, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", background: "#f3f4f6" }}>
                {student.photo ? (
                  <img src={student.photo} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#9CA3AF", fontSize: 12 }}>
                    No Photo
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, fontSize: 13 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{student.name || "Student Name"}</div>

                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 10px", fontSize: 12, color: "#374151" }}>
                  <div style={{ color: "#6B7280" }}>Age</div>
                  <div>{student.age || "-"}</div>

                  <div style={{ color: "#6B7280" }}>Class</div>
                  <div>{student.cls || "-"}</div>

                  <div style={{ color: "#6B7280" }}>Roll No.</div>
                  <div>{student.roll || "-"}</div>

                  <div style={{ color: "#6B7280" }}>GR No.</div>
                  <div>{student.grNo || "-"}</div>

                  <div style={{ color: "#6B7280" }}>Parent</div>
                  <div style={{ wordBreak: "break-word" }}>{student.parentContact || "-"}</div>

                  <div style={{ color: "#6B7280" }}>Address</div>
                  <div style={{ color: "#374151", fontSize: 11 }}>{student.address || "-"}</div>
                </div>
              </div>
            </div>

            {/* Footer: small note & signature line */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <div style={{ fontSize: 10, color: "#6B7280" }}>Valid for academic year {new Date().getFullYear()}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Principal</div>
                <div style={{ height: 18 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-60">
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-md border bg-white text-sm"
            title="Open print preview"
            style={{ boxShadow: "0 6px 18px rgba(2,6,23,0.08)" }}
          >
            Print
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3 py-2 rounded-md bg-[var(--brand-blue)] text-white text-sm"
            title="Download ID card as PDF"
            style={{ boxShadow: "0 6px 18px rgba(2,6,23,0.12)" }}
          >
            Download PDF
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md border bg-white text-sm"
            style={{ boxShadow: "0 6px 18px rgba(2,6,23,0.06)" }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
