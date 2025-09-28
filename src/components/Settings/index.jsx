import React, { useState, useEffect } from "react";

export default function Settings({ brand, setBrand }) {
  const [schoolName, setSchoolName] = useState(localStorage.getItem("schoolName") || "");
  const [schoolAddress, setSchoolAddress] = useState(localStorage.getItem("schoolAddress") || "");
  const [logo, setLogo] = useState(localStorage.getItem("schoolLogo") || null);

  const [colors, setColors] = useState({
    blue: brand.blue,
    orange: brand.orange,
    light: brand.light,
  });

  // --- Persist school details ---
  useEffect(() => {
    localStorage.setItem("schoolName", schoolName);
    localStorage.setItem("schoolAddress", schoolAddress);
    if (logo) localStorage.setItem("schoolLogo", logo);
  }, [schoolName, schoolAddress, logo]);

  // --- Upload logo ---
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogo(event.target.result);
    reader.readAsDataURL(file);
  }

  // --- Save brand colors ---
  function saveColors() {
    setBrand(colors);
    localStorage.setItem("brandColors", JSON.stringify(colors));
    alert("Theme updated!");
  }

  // --- Reset to iQubiz default brand colors ---
  function resetColors() {
    const iqDefaults = {
      blue: "#0C3C78",    // iQubiz Primary
      orange: "#F15A24",  // iQubiz Accent
      light: "#F7FAFC",   // Background
    };
    setColors(iqDefaults);
    setBrand(iqDefaults);
    localStorage.setItem("brandColors", JSON.stringify(iqDefaults));
    alert("Colors reset to iQubiz defaults");
  }

  return (
    <div className="p-4 card">
      <h2 className="text-lg font-bold text-[var(--brand-blue)] mb-4">Settings</h2>

      {/* School Info */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">School Name</label>
        <input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="input w-full"
        />

        <label className="block text-sm font-medium mt-3 mb-1">School Address</label>
        <textarea
          value={schoolAddress}
          onChange={(e) => setSchoolAddress(e.target.value)}
          rows={3}
          className="input w-full"
        />

        <label className="block text-sm font-medium mt-3 mb-1">School Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {logo && (
          <div className="mt-2">
            <img
              src={logo}
              alt="School Logo"
              className="h-20 object-contain border rounded-md bg-white p-2"
            />
          </div>
        )}
      </div>

      {/* Theme Colors */}
      <div className="mb-6">
        <h3 className="font-medium text-md mb-2">Theme Colors</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs">Primary (Blue)</label>
            <input
              type="color"
              value={colors.blue}
              onChange={(e) => setColors({ ...colors, blue: e.target.value })}
              className="w-12 h-8 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs">Accent (Orange)</label>
            <input
              type="color"
              value={colors.orange}
              onChange={(e) => setColors({ ...colors, orange: e.target.value })}
              className="w-12 h-8 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs">Background</label>
            <input
              type="color"
              value={colors.light}
              onChange={(e) => setColors({ ...colors, light: e.target.value })}
              className="w-12 h-8 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={saveColors}
            className="px-4 py-2 rounded-md bg-[var(--brand-orange)] text-white"
          >
            Save Colors
          </button>
          <button
            onClick={resetColors}
            className="px-4 py-2 rounded-md border"
          >
            Reset to iQubiz Colors
          </button>
        </div>
      </div>
    </div>
  );
}
