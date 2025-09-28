import React, { useState, useEffect } from "react";
import { IconDriver, IconPhone, IconTruck } from "../Icons";
import { readTransportDrivers, writeTransportDrivers } from "../../storage";

export default function Drivers({ brand }) {
  const [drivers, setDrivers] = useState(readTransportDrivers());
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "" });

  useEffect(() => {
    writeTransportDrivers(drivers);
  }, [drivers]);

  const addDriver = () => {
    if (!form.name.trim()) return;
    setDrivers([...drivers, { ...form, id: Date.now() }]);
    setForm({ name: "", phone: "", vehicle: "" });
  };

  const removeDriver = (id) => setDrivers(drivers.filter((d) => d.id !== id));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3" style={{ color: brand.blue }}>
        {IconDriver} Drivers
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input className="input" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Vehicle No." value={form.vehicle}
          onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
      </div>

      <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={addDriver}>
        Add Driver
      </button>

      <ul className="mt-4 divide-y">
        {drivers.map((d) => (
          <li key={d.id} className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium">{d.name}</span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                {IconPhone} {d.phone}
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                {IconTruck} {d.vehicle}
              </span>
            </div>
            <button onClick={() => removeDriver(d.id)} className="text-red-500 hover:text-red-700">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
