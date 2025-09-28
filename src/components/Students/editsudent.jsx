import React, { useState, useEffect } from "react";

export default function EditStudentModal({ student, classes, onClose, onSave }) {
  const [form, setForm] = useState({ ...student });

  useEffect(() => {
    setForm({ ...student });
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto w-full max-w-3xl">
        <h3 className="text-lg font-bold mb-4 text-center text-[#0C3C78]">
          ✏️ Edit Student
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border rounded px-3 py-2" />
            <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle Name" className="border rounded px-3 py-2" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="border rounded px-3 py-2" />
            <select name="classId" value={form.classId} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.className}-{cls.division} ({cls.medium})</option>
              ))}
            </select>
          </div>

          {/* Parent Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" className="border rounded px-3 py-2" />
            <input name="fatherMiddleName" value={form.fatherMiddleName} onChange={handleChange} placeholder="Father Middle Name" className="border rounded px-3 py-2" />
            <input name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Guardian Name" className="border rounded px-3 py-2" />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input name="fatherMobile" value={form.fatherMobile} onChange={handleChange} placeholder="Father Mobile" className="border rounded px-3 py-2" />
            <input name="motherMobile" value={form.motherMobile} onChange={handleChange} placeholder="Mother Mobile" className="border rounded px-3 py-2" />
            <input name="studentEmail" type="email" value={form.studentEmail} onChange={handleChange} placeholder="Student Email" className="border rounded px-3 py-2" />
          </div>

          {/* Emails */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input name="fatherEmail" value={form.fatherEmail} onChange={handleChange} placeholder="Father Email" className="border rounded px-3 py-2" />
            <input name="motherEmail" value={form.motherEmail} onChange={handleChange} placeholder="Mother Email" className="border rounded px-3 py-2" />
            <input name="guardianEmail" value={form.guardianEmail} onChange={handleChange} placeholder="Guardian Email" className="border rounded px-3 py-2" />
          </div>

          <textarea name="presentAddress" value={form.presentAddress} onChange={handleChange} placeholder="Present Address" className="border rounded px-3 py-2 w-full" />
          <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className="border rounded px-3 py-2 w-full" />

          {/* Roll, GR, Photo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll No" className="border rounded px-3 py-2" />
            <input name="grNo" value={form.grNo} onChange={handleChange} placeholder="GR No" className="border rounded px-3 py-2" />
            <div>
              <label className="block text-sm font-medium mb-1">Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm" />
              {form.photo && <img src={form.photo} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-full border" />}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded text-white text-sm font-semibold bg-[#0C3C78]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
