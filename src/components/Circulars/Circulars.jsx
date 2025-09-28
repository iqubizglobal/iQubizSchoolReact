import React, { useState, useEffect } from "react";
import { readCirculars, writeCirculars } from "../../storage.js";

export default function Circulars({ currentRole, brand }) {
  const [circulars, setCirculars] = useState(() => readCirculars());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null,
    fileName: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    writeCirculars(circulars);
  }, [circulars]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm({
        ...form,
        file: reader.result,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.file) {
      alert("Please provide a title and file.");
      return;
    }
    const newCircular = {
      id: Date.now(),
      ...form,
    };
    setCirculars((prev) => [newCircular, ...prev]);
    setModalOpen(false);
    setForm({
      title: "",
      description: "",
      file: null,
      fileName: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const isUploader =
    currentRole === "Teacher" ||
    currentRole === "Principal" ||
    currentRole === "Owner";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: brand.blue }}>
          Circulars 📢
        </h2>
        {isUploader && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded text-white text-sm"
            style={{ backgroundColor: brand.blue }}
          >
            + New Circular
          </button>
        )}
      </div>

      {circulars.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No circulars available.
        </div>
      ) : (
        <div className="space-y-4">
          {circulars.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-lg shadow-sm border bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                {c.description && (
                  <p className="text-sm text-gray-600">{c.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Date: {new Date(c.date).toLocaleDateString()}
                </p>
              </div>
              <a
                href={c.file}
                download={c.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Modal for new circular */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Upload Circular
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">File *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png,.jpeg"
                  onChange={handleFileChange}
                  className="text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded text-white"
                  style={{ backgroundColor: brand.blue }}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
