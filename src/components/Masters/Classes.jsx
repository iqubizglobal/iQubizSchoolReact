import React, { useState, useEffect } from "react";
import { readClasses, writeClasses } from "../../storage";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function Classes({ brand }) {
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({ className: "", division: "", medium: "English" });

  useEffect(() => {
    setClasses(readClasses());
  }, []);

  const saveClasses = (newList) => {
    setClasses(newList);
    writeClasses(newList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.className.trim() || !form.division.trim()) return;

    if (editingClass) {
      const updated = classes.map((c) =>
        c.id === editingClass.id ? { ...c, ...form } : c
      );
      saveClasses(updated);
      setEditingClass(null);
    } else {
      const newClass = {
        id: Date.now(),
        ...form,
      };
      saveClasses([...classes, newClass]);
    }
    setForm({ className: "", division: "", medium: "English" });
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setForm({ className: cls.className, division: cls.division, medium: cls.medium });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      saveClasses(classes.filter((c) => c.id !== id));
    }
  };

  const filtered = classes.filter(
    (c) =>
      c.className.toLowerCase().includes(filter.toLowerCase()) ||
      c.division.toLowerCase().includes(filter.toLowerCase()) ||
      c.medium.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4" style={{ color: brand.blue }}>
        Class Management
      </h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <input
          type="text"
          placeholder="Class (e.g. 5)"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Division (e.g. A)"
          value={form.division}
          onChange={(e) => setForm({ ...form, division: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        />
        <select
          value={form.medium}
          onChange={(e) => setForm({ ...form, medium: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Gujarati</option>
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 text-white rounded px-3 py-2 text-sm"
          style={{ backgroundColor: brand.orange }}
        >
          <Plus size={16} />
          {editingClass ? "Update" : "Add"}
        </button>
      </form>

      {/* Search/Filter */}
      <div className="flex items-center mb-3 gap-2">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Filter by Class, Division, Medium"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm flex-1"
        />
      </div>

      {/* Class List Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No classes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="p-2">Class</th>
                <th className="p-2">Division</th>
                <th className="p-2">Medium</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cls) => (
                <tr key={cls.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{cls.className}</td>
                  <td className="p-2">{cls.division}</td>
                  <td className="p-2">{cls.medium}</td>
                  <td className="p-2 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
