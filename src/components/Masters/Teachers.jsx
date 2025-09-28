import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { readTeachers, writeTeachers, makeId } from "../../storage";

export default function Teachers({ brand = { blue: "#0C3C78", orange: "#F15A24" } }) {
  const [teachers, setTeachers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm());

  function initialForm() {
    return {
      id: null,
      salutation: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile1: "",
      mobile2: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      country: "India",
      permanentAddress: "",
      qualification1: "",
      qualification2: "",
      qualification3: "",
      email: "",
      aadharNo: "",
      panNo: "",
      photo: "",
      tSubject: "",
    };
  }

  // Load teachers
  useEffect(() => {
    const t = readTeachers();
    if (t?.length) setTeachers(t);
  }, []);

  // Persist teachers
  useEffect(() => {
    writeTeachers(teachers);
  }, [teachers]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      alert("Please enter teacher's full name.");
      return;
    }

    const payload = {
      ...form,
      id: form.id || makeId("teacher"),
    };

    setTeachers((prev) => {
      const exists = prev.some((t) => t.id === payload.id);
      return exists ? prev.map((t) => (t.id === payload.id ? payload : t)) : [payload, ...prev];
    });

    setForm(initialForm());
    setEditing(null);
  };

  const handleEdit = (teacher) => {
    setForm(teacher);
    setEditing(teacher.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this teacher?")) return;
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const clearForm = () => {
    setForm(initialForm());
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4" style={{ color: brand.blue }}>
          {editing ? "Edit Teacher" : "Add Teacher"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Salutation</label>
            <select
              value={form.salutation}
              onChange={(e) => setForm({ ...form, salutation: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select</option>
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
              <option>Dr.</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Middle Name</label>
            <input
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Middle Name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Last Name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Mobile No. 1</label>
            <input
              value={form.mobile1}
              onChange={(e) => setForm({ ...form, mobile1: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Primary Mobile"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Mobile No. 2</label>
            <input
              value={form.mobile2}
              onChange={(e) => setForm({ ...form, mobile2: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Secondary Mobile"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs text-gray-600 mb-1 block">Present Address</label>
            <input
              value={form.address1}
              onChange={(e) => setForm({ ...form, address1: e.target.value })}
              className="border rounded-md px-3 py-2 w-full mb-2"
              placeholder="Address Line 1"
            />
            <input
              value={form.address2}
              onChange={(e) => setForm({ ...form, address2: e.target.value })}
              className="border rounded-md px-3 py-2 w-full mb-2"
              placeholder="Address Line 2"
            />
            <input
              value={form.address3}
              onChange={(e) => setForm({ ...form, address3: e.target.value })}
              className="border rounded-md px-3 py-2 w-full mb-2"
              placeholder="Address Line 3"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">State</label>
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Country</label>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs text-gray-600 mb-1 block">Permanent Address</label>
            <textarea
              value={form.permanentAddress}
              onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Qualification 1</label>
            <input
              value={form.qualification1}
              onChange={(e) => setForm({ ...form, qualification1: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Qualification 2</label>
            <input
              value={form.qualification2}
              onChange={(e) => setForm({ ...form, qualification2: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Qualification 3</label>
            <input
              value={form.qualification3}
              onChange={(e) => setForm({ ...form, qualification3: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Aadhar No.</label>
            <input
              value={form.aadharNo}
              onChange={(e) => setForm({ ...form, aadharNo: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">PAN No.</label>
            <input
              value={form.panNo}
              onChange={(e) => setForm({ ...form, panNo: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            {form.photo && (
              <img
                src={form.photo}
                alt="preview"
                className="mt-2 w-20 h-20 object-cover rounded border"
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Teaching Subject</label>
            <input
              value={form.tSubject}
              onChange={(e) => setForm({ ...form, tSubject: e.target.value })}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2 mt-4">
            <button type="button" onClick={clearForm} className="px-4 py-2 border rounded-md">
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: brand.orange }}
            >
              <Plus size={18} />
              {editing ? "Save Changes" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4" style={{ color: brand.blue }}>
          Teachers List
        </h2>
        {teachers.length === 0 ? (
          <p className="text-sm text-gray-500">No teachers added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead style={{ backgroundColor: `${brand.blue}10` }}>
                <tr>
                  <th className="px-3 py-2 text-left border-b">Name</th>
                  <th className="px-3 py-2 text-left border-b">Mobile</th>
                  <th className="px-3 py-2 text-left border-b">Email</th>
                  <th className="px-3 py-2 text-left border-b">Subject</th>
                  <th className="px-3 py-2 text-center border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">
                      {t.salutation} {t.firstName} {t.lastName}
                    </td>
                    <td className="px-3 py-2 border-b">{t.mobile1}</td>
                    <td className="px-3 py-2 border-b">{t.email}</td>
                    <td className="px-3 py-2 border-b">{t.tSubject}</td>
                    <td className="px-3 py-2 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(t)} className="p-1.5 hover:bg-blue-50 rounded">
                          <Pencil size={16} color={brand.blue} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded">
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
