import React, { useState, useEffect } from "react";
import { readUsers, writeUsers, readClasses } from "../../storage";
import { v4 as uuidv4 } from "uuid";

export default function AddStudent({ brand }) {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    fatherName: "",
    fatherMiddleName: "",
    guardianName: "",
    fatherMobile: "",
    motherMobile: "",
    studentEmail: "",
    fatherEmail: "",
    motherEmail: "",
    guardianEmail: "",
    presentAddress: "",
    permanentAddress: "",
    classId: "",
    rollNo: "",
    grNo: "",
    photo: "",
    role: "Student",
  });

  useEffect(() => {
    setClasses(readClasses() || []);
  }, []);

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
    const all = readUsers() || [];
    const newStudent = { ...form, id: uuidv4() };
    writeUsers([...all, newStudent]);
    alert("✅ Student added successfully!");
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      fatherName: "",
      fatherMiddleName: "",
      guardianName: "",
      fatherMobile: "",
      motherMobile: "",
      studentEmail: "",
      fatherEmail: "",
      motherEmail: "",
      guardianEmail: "",
      presentAddress: "",
      permanentAddress: "",
      classId: "",
      rollNo: "",
      grNo: "",
      photo: "",
      role: "Student",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
      <h2
        className="text-xl font-bold mb-6 text-center"
        style={{ color: brand?.blue || "#0C3C78" }}
      >
        ➕ Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input border rounded px-3 py-2" required />
          <input name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} className="input border rounded px-3 py-2" />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input border rounded px-3 py-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Date of Birth" />
          <select name="classId" value={form.classId} onChange={handleChange} className="border rounded px-3 py-2" required>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.className}-{cls.division} ({cls.medium})</option>
            ))}
          </select>
        </div>

        {/* Parent & Guardian Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="fatherName" placeholder="Father Name" value={form.fatherName} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="fatherMiddleName" placeholder="Father Middle Name" value={form.fatherMiddleName} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="guardianName" placeholder="Guardian Name" value={form.guardianName} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="fatherMobile" placeholder="Father Mobile" value={form.fatherMobile} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="motherMobile" placeholder="Mother Mobile" value={form.motherMobile} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="studentEmail" type="email" placeholder="Student Email" value={form.studentEmail} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="fatherEmail" type="email" placeholder="Father Email" value={form.fatherEmail} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="motherEmail" type="email" placeholder="Mother Email" value={form.motherEmail} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="guardianEmail" type="email" placeholder="Guardian Email" value={form.guardianEmail} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>

        {/* Addresses */}
        <textarea name="presentAddress" placeholder="Present Address" value={form.presentAddress} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
        <textarea name="permanentAddress" placeholder="Permanent Address" value={form.permanentAddress} onChange={handleChange} className="border rounded px-3 py-2 w-full" />

        {/* Roll, GR, Photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input name="rollNo" placeholder="Roll No" value={form.rollNo} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="grNo" placeholder="GR No" value={form.grNo} onChange={handleChange} className="border rounded px-3 py-2" />
          <div>
            <label className="block text-sm mb-1 font-medium">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm" />
            {form.photo && <img src={form.photo} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-full border" />}
          </div>
        </div>

        <div className="text-center pt-4">
          <button type="submit" className="px-6 py-2 rounded-md text-white font-semibold" style={{ backgroundColor: brand?.blue || "#0C3C78" }}>
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
}
