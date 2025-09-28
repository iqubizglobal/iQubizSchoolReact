import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  readUsers,
  readTransportRoutes,
  readTransportMapping,
  writeTransportMapping,
} from "../../storage";
import { Bus, MapPin, Clock, Edit2, Trash2 } from "lucide-react";

export default function StudentMapping({
  brand = { blue: "#0C3C78", orange: "#F15A24" },
}) {
  // -------- Hydrate from storage in initial state (prevents clobber) --------
  const [routes, setRoutes] = useState(() => readTransportRoutes() || []);
  const [mapping, setMapping] = useState(() => readTransportMapping() || {});
  const hydrated = useRef(false); // becomes true after first mount

  // Students list (pulled fresh on mount)
  const [students, setStudents] = useState([]);

  // Form state
  const [studentId, setStudentId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [pickupStop, setPickupStop] = useState("");
  const [dropStop, setDropStop] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");

  // ---------- Load students once ----------
  useEffect(() => {
    const allUsers = readUsers() || [];
    const studs = allUsers.filter(
      (u) => (u.role || "").toLowerCase() === "student"
    );
    setStudents(studs);
    // we’ve already hydrated routes/mapping via initial state
    hydrated.current = true;
  }, []);

  // ---------- Persist mapping AFTER hydration ----------
  useEffect(() => {
    if (!hydrated.current) return; // skip initial render
    writeTransportMapping(mapping);
  }, [mapping]);

  // ---------- Helpers ----------
  const getFullName = (s) =>
    `${s?.firstName || ""} ${s?.middleName || ""} ${s?.lastName || ""}`
      .replace(/\s+/g, " ")
      .trim() || "—";

  const currentRoute = useMemo(
    () => routes.find((r) => String(r.id) === String(routeId)),
    [routes, routeId]
  );

  const stops = useMemo(() => {
    const list = currentRoute?.stops || [];
    return list.map((s) => (typeof s === "string" ? { name: s } : s));
  }, [currentRoute]);

  const studentNameById = (id) => {
    const s = students.find((st) => String(st.id) === String(id));
    return getFullName(s);
  };

  const routeNameById = (id) =>
    routes.find((r) => String(r.id) === String(id))?.name || "—";

  // ---------- Prefill when picking a student ----------
  useEffect(() => {
    if (!studentId) return;
    const m = mapping[studentId];
    if (m) {
      setRouteId(String(m.routeId || ""));
      setPickupStop(m.pickupStop || "");
      setDropStop(m.dropStop || "");
      setPickupTime(m.pickupTime || "");
      setDropTime(m.dropTime || "");
    } else {
      setRouteId("");
      setPickupStop("");
      setDropStop("");
      setPickupTime("");
      setDropTime("");
    }
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Actions ----------
  const handleSave = (e) => {
    e.preventDefault();
    if (!studentId) return alert("Please select a student.");
    if (!routeId) return alert("Please select a route.");
    if (!pickupStop || !dropStop)
      return alert("Please select pickup & drop stops.");

    const payload = {
      routeId: Number(routeId),
      pickupStop,
      dropStop,
      pickupTime: pickupTime || "",
      dropTime: dropTime || "",
    };

    setMapping((prev) => ({ ...prev, [studentId]: payload }));
    alert("✅ Mapping saved.");
    clearForm();
  };

  const clearForm = () => {
    setStudentId("");
    setRouteId("");
    setPickupStop("");
    setDropStop("");
    setPickupTime("");
    setDropTime("");
  };

  const removeMapping = (id) => {
    if (!confirm("Remove this student's transport mapping?")) return;
    setMapping((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (studentId === id) clearForm();
  };

  // ---------- UI ----------
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bus size={26} color={brand.orange} />
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ color: brand.blue }}
        >
          Student Transport Mapping
        </h2>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Student */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Student</label>
            <select
              className="input w-full border rounded px-3 py-2"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {getFullName(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Route */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Route</label>
            <select
              className="input w-full border rounded px-3 py-2"
              value={routeId}
              onChange={(e) => {
                setRouteId(e.target.value);
                setPickupStop("");
                setDropStop("");
              }}
              disabled={!studentId}
            >
              <option value="">Select route</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Stop */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Pickup Stop
            </label>
            <select
              className="input w-full border rounded px-3 py-2"
              value={pickupStop}
              onChange={(e) => setPickupStop(e.target.value)}
              disabled={!routeId}
            >
              <option value="">Select pickup</option>
              {stops.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Drop Stop */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Drop Stop</label>
            <select
              className="input w-full border rounded px-3 py-2"
              value={dropStop}
              onChange={(e) => setDropStop(e.target.value)}
              disabled={!routeId}
            >
              <option value="">Select drop</option>
              {stops.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Times */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Pickup Time
            </label>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <input
                type="time"
                className="input w-full border rounded px-3 py-2"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                disabled={!routeId}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Drop Time</label>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <input
                type="time"
                className="input w-full border rounded px-3 py-2"
                value={dropTime}
                onChange={(e) => setDropTime(e.target.value)}
                disabled={!routeId}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 rounded border hover:bg-gray-100 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded text-white shadow-md hover:opacity-90 transition"
              style={{ backgroundColor: brand.orange }}
            >
              Save Mapping
            </button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-md font-semibold mb-3" style={{ color: brand.blue }}>
          Current Mappings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-md bg-white">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-2">Student</th>
                <th className="p-2">Route</th>
                <th className="p-2">Pickup</th>
                <th className="p-2">Drop</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mapping).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-gray-500 text-center">
                    No mappings yet
                  </td>
                </tr>
              )}
              {Object.entries(mapping).map(([sid, m]) => (
                <tr
                  key={sid}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2">{studentNameById(sid)}</td>
                  <td className="p-2">{routeNameById(m.routeId)}</td>
                  <td className="p-2">
                    <MapPin size={14} className="inline mr-1 text-gray-400" />
                    {m.pickupStop}
                    {m.pickupTime && (
                      <span className="text-xs text-gray-500">
                        {" "}
                        ({m.pickupTime})
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <MapPin size={14} className="inline mr-1 text-gray-400" />
                    {m.dropStop}
                    {m.dropTime && (
                      <span className="text-xs text-gray-500">
                        {" "}
                        ({m.dropTime})
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-right">
                    <button
                      className="text-blue-600 hover:underline inline-flex items-center gap-1 mr-3"
                      onClick={() => {
                        setStudentId(sid);
                        setRouteId(String(m.routeId || ""));
                        setPickupStop(m.pickupStop || "");
                        setDropStop(m.dropStop || "");
                        setPickupTime(m.pickupTime || "");
                        setDropTime(m.dropTime || "");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline inline-flex items-center gap-1"
                      onClick={() => removeMapping(sid)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
