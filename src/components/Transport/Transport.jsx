import React, { useEffect, useMemo, useState } from "react";
import {
  readDrivers, writeDrivers,
  readRoutes, writeRoutes,
  readTransportMappings, writeTransportMappings,
  readUsers
} from "../../storage.js";

const CAN_MANAGE = ["Transport Manager", "Principal", "Owner"];

export default function Transport({ currentRole = "Owner", brand }) {
  const canManage = CAN_MANAGE.includes(currentRole);

  // master data
  const [drivers, setDrivers] = useState(readDrivers());
  const [routes, setRoutes] = useState(readRoutes());
  const [students] = useState(() => readUsers().filter(u => u.role === "Student"));
  const [map, setMap] = useState(readTransportMappings());

  // forms
  const [driverForm, setDriverForm] = useState({ name: "", phone: "", altPhone: "", license: "", vehicleNo: "" });

  // Create-route form + draft stops (attached when you click "Add Route")
  const [routeForm, setRouteForm] = useState({ name: "", vehicleNo: "", driverId: "", stops: [] });
  const [stopDraft, setStopDraft] = useState({ name: "", pickupTime: "", dropTime: "" });

  // Edit existing route's stops
  const [selectedRouteId, setSelectedRouteId] = useState(""); // to edit stops of a saved route
  const [editStopDraft, setEditStopDraft] = useState({ name: "", pickupTime: "", dropTime: "" });

  // Assign student to route/stop
  const [assignForm, setAssignForm] = useState({
    studentId: "",
    routeId: "",
    pickupStopId: "",
    dropStopId: "",
    pickupTime: "",
    dropTime: ""
  });

  // persist
  useEffect(() => writeDrivers(drivers), [drivers]);
  useEffect(() => writeRoutes(routes), [routes]);
  useEffect(() => writeTransportMappings(map), [map]);

  // helpers
  const routeById = useMemo(() => Object.fromEntries(routes.map(r => [r.id, r])), [routes]);
  const driverById = useMemo(() => Object.fromEntries(drivers.map(d => [d.id, d])), [drivers]);

  // ---------- CRUD: Drivers ----------
  function addDriver(e) {
    e.preventDefault();
    if (!driverForm.name.trim() || !driverForm.phone.trim()) return alert("Name & Phone are required");
    const id = Date.now();
    setDrivers(prev => [...prev, { id, ...driverForm }]);
    setDriverForm({ name: "", phone: "", altPhone: "", license: "", vehicleNo: "" });
  }
  function deleteDriver(id) {
    const used = routes.some(r => r.driverId === id);
    if (used) return alert("Driver is assigned to a route. Reassign before deleting.");
    if (confirm("Delete driver?")) setDrivers(prev => prev.filter(d => d.id !== id));
  }

  // ---------- CREATE ROUTE: attach draft stops BEFORE saving route ----------
  function addStopToDraft() {
    if (!stopDraft.name.trim()) return alert("Stop name is required");
    const id = Math.max(0, ...((routeForm.stops || []).map(s => s.id))) + 1;
    setRouteForm(r => ({ ...r, stops: [...(r.stops || []), { id, ...stopDraft }] }));
    setStopDraft({ name: "", pickupTime: "", dropTime: "" });
  }
  function removeDraftStop(id) {
    setRouteForm(r => ({ ...r, stops: (r.stops || []).filter(s => s.id !== id) }));
  }
  function addRoute(e) {
    e.preventDefault();
    if (!routeForm.name.trim()) return alert("Route name is required");
    const id = Date.now();
    const route = {
      id,
      name: routeForm.name.trim(),
      vehicleNo: routeForm.vehicleNo.trim(),
      driverId: routeForm.driverId ? Number(routeForm.driverId) : null,
      stops: (routeForm.stops || []).map((s, idx) => ({ ...s, id: s.id || idx + 1 })),
    };
    setRoutes(prev => [...prev, route]);
    setRouteForm({ name: "", vehicleNo: "", driverId: "", stops: [] });
    // auto-select the newly created route for further stop edits if needed
    setSelectedRouteId(String(id));
  }
  function deleteRoute(id) {
    const mapped = Object.values(map).some(m => m.routeId === id);
    if (mapped) return alert("Some students are mapped to this route. Unmap before deleting.");
    if (confirm("Delete route?")) setRoutes(prev => prev.filter(r => r.id !== id));
  }

  // ---------- EDIT STOPS FOR EXISTING ROUTE (this fixes “stops not saving”) ----------
  function addStopToExisting() {
    const rid = Number(selectedRouteId);
    if (!rid) return alert("Select a route to add stops");
    if (!editStopDraft.name.trim()) return alert("Stop name is required");

    setRoutes(prev => prev.map(r => {
      if (r.id !== rid) return r;
      const nextId = Math.max(0, ...(r.stops || []).map(s => s.id)) + 1;
      const updated = { ...r, stops: [...(r.stops || []), { id: nextId, ...editStopDraft }] };
      return updated;
    }));
    setEditStopDraft({ name: "", pickupTime: "", dropTime: "" });
  }

  function removeStopFromExisting(stopId) {
    const rid = Number(selectedRouteId);
    if (!rid) return;
    setRoutes(prev => prev.map(r => {
      if (r.id !== rid) return r;
      return { ...r, stops: (r.stops || []).filter(s => s.id !== stopId) };
    }));
  }

  // ---------- Map Student → Route/Stops ----------
  function saveMapping(e) {
    e.preventDefault();
    const { studentId, routeId, pickupStopId, dropStopId, pickupTime, dropTime } = assignForm;
    if (!studentId || !routeId) return alert("Student and Route are required");
    const route = routeById[Number(routeId)];
    if (!route) return alert("Invalid route");

    const payload = {
      routeId: Number(routeId),
      pickupStopId: pickupStopId ? Number(pickupStopId) : null,
      dropStopId: dropStopId ? Number(dropStopId) : null,
      pickupTime: pickupTime || undefined,
      dropTime: dropTime || undefined,
    };

    setMap(prev => ({ ...prev, [Number(studentId)]: payload }));
    setAssignForm({ studentId: "", routeId: "", pickupStopId: "", dropStopId: "", pickupTime: "", dropTime: "" });
  }

  // ---------- Student view demo (choose a student to preview) ----------
  const [studentViewId, setStudentViewId] = useState(students[0]?.id || "");
  const assigned = map[Number(studentViewId)];
  const assignedRoute = assigned ? routeById[assigned.routeId] : null;
  const pickupStop = assigned && assigned.pickupStopId ? assignedRoute?.stops?.find(s => s.id === assigned.pickupStopId) : null;
  const dropStop = assigned && assigned.dropStopId ? assignedRoute?.stops?.find(s => s.id === assigned.dropStopId) : null;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: brand.blue }}>🚌 Transport</h2>
        <div className="text-sm text-gray-500">
          {canManage ? "Manage drivers, routes, stops & student mappings" : "View your route details"}
        </div>
      </header>

      {canManage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DRIVERS */}
          <section className="bg-white border rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Drivers</h3>
            <form onSubmit={addDriver} className="space-y-2 mb-3">
              <input className="input w-full" placeholder="Name *"
                value={driverForm.name} onChange={e=>setDriverForm(f=>({ ...f, name:e.target.value }))}/>
              <input className="input w-full" placeholder="Phone *"
                value={driverForm.phone} onChange={e=>setDriverForm(f=>({ ...f, phone:e.target.value }))}/>
              <input className="input w-full" placeholder="Alt. Phone"
                value={driverForm.altPhone} onChange={e=>setDriverForm(f=>({ ...f, altPhone:e.target.value }))}/>
              <input className="input w-full" placeholder="License No."
                value={driverForm.license} onChange={e=>setDriverForm(f=>({ ...f, license:e.target.value }))}/>
              <input className="input w-full" placeholder="Vehicle No."
                value={driverForm.vehicleNo} onChange={e=>setDriverForm(f=>({ ...f, vehicleNo:e.target.value }))}/>
              <button className="btn-primary w-full" style={{ backgroundColor: brand.blue, color:"#fff" }}>Add Driver</button>
            </form>

            <div className="space-y-2">
              {drivers.length === 0 && <div className="text-sm text-gray-500">No drivers yet</div>}
              {drivers.map(d=>(
                <div key={d.id} className="border rounded-md p-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.name} • {d.vehicleNo || "—"}</div>
                    <div className="text-xs text-gray-500">{d.phone}{d.altPhone ? ` / ${d.altPhone}`:""} {d.license ? `• ${d.license}`:""}</div>
                  </div>
                  <button onClick={()=>deleteDriver(d.id)} className="text-red-600 text-sm">Delete</button>
                </div>
              ))}
            </div>
          </section>

          {/* CREATE ROUTE (with draft stops attached on save) */}
          <section className="bg-white border rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Create Route</h3>
            <form onSubmit={addRoute} className="grid grid-cols-1 gap-2 mb-4">
              <input className="input" placeholder="Route Name *"
                value={routeForm.name} onChange={e=>setRouteForm(r=>({ ...r, name:e.target.value }))}/>
              <input className="input" placeholder="Vehicle No."
                value={routeForm.vehicleNo} onChange={e=>setRouteForm(r=>({ ...r, vehicleNo:e.target.value }))}/>
              <select className="input"
                value={routeForm.driverId}
                onChange={e=>setRouteForm(r=>({ ...r, driverId:e.target.value }))}>
                <option value="">Assign Driver</option>
                {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <div className="border rounded-md p-3">
                <div className="text-sm font-medium mb-2">Draft Stops (will attach when you add route)</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <input className="input" placeholder="Stop Name"
                    value={stopDraft.name} onChange={e=>setStopDraft(s=>({ ...s, name:e.target.value }))}/>
                  <input className="input" type="time" placeholder="Pickup Time"
                    value={stopDraft.pickupTime} onChange={e=>setStopDraft(s=>({ ...s, pickupTime:e.target.value }))}/>
                  <input className="input" type="time" placeholder="Drop Time"
                    value={stopDraft.dropTime} onChange={e=>setStopDraft(s=>({ ...s, dropTime:e.target.value }))}/>
                  <button type="button" onClick={addStopToDraft} className="btn-primary" style={{ backgroundColor: brand.orange, color:"#fff" }}>
                    + Add Stop
                  </button>
                </div>

                {routeForm.stops?.length > 0 && (
                  <ul className="mt-3 divide-y">
                    {routeForm.stops.map(s=>(
                      <li key={s.id} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{s.name}</div>
                          <div className="text-xs text-gray-500">Pickup: {s.pickupTime || "—"} • Drop: {s.dropTime || "—"}</div>
                        </div>
                        <button className="text-red-600 text-sm" onClick={()=>removeDraftStop(s.id)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button className="btn-primary" style={{ backgroundColor: brand.blue, color:"#fff" }}>Add Route</button>
            </form>
            <p className="text-xs text-gray-500">
              Tip: To add stops to an existing route, use the <b>“Edit Route Stops”</b> panel on the right.
            </p>
          </section>

          {/* EDIT STOPS FOR EXISTING ROUTE */}
          <section className="bg-white border rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Edit Route Stops</h3>
            <select className="input mb-3" value={selectedRouteId} onChange={e=>setSelectedRouteId(e.target.value)}>
              <option value="">Select Route</option>
              {routes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            {selectedRouteId ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <input className="input" placeholder="Stop Name"
                    value={editStopDraft.name} onChange={e=>setEditStopDraft(s=>({ ...s, name:e.target.value }))}/>
                  <input className="input" type="time" placeholder="Pickup Time"
                    value={editStopDraft.pickupTime} onChange={e=>setEditStopDraft(s=>({ ...s, pickupTime:e.target.value }))}/>
                  <input className="input" type="time" placeholder="Drop Time"
                    value={editStopDraft.dropTime} onChange={e=>setEditStopDraft(s=>({ ...s, dropTime:e.target.value }))}/>
                  <button type="button" onClick={addStopToExisting} className="btn-primary" style={{ backgroundColor: brand.orange, color:"#fff" }}>
                    + Add Stop
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Stops for this route:</div>
                  {(routeById[Number(selectedRouteId)]?.stops || []).length === 0 ? (
                    <div className="text-sm text-gray-500">No stops yet</div>
                  ) : (
                    <ul className="divide-y">
                      {routeById[Number(selectedRouteId)].stops.map(s=>(
                        <li key={s.id} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{s.name}</div>
                            <div className="text-xs text-gray-500">Pickup: {s.pickupTime || "—"} • Drop: {s.dropTime || "—"}</div>
                          </div>
                          <button className="text-red-600 text-sm" onClick={()=>removeStopFromExisting(s.id)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">Select a route to edit its stops.</div>
            )}
          </section>
        </div>
      )}

      {/* EXISTING ROUTES OVERVIEW + DELETE */}
      {canManage && (
        <section className="bg-white border rounded-xl p-4 shadow-sm mt-6">
          <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Routes Overview</h3>
          <div className="space-y-3">
            {routes.length === 0 && <div className="text-sm text-gray-500">No routes yet</div>}
            {routes.map(r=>(
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.name} • {r.vehicleNo || "—"}</div>
                  <div className="text-sm text-gray-500">Driver: {r.driverId ? (driverById[r.driverId]?.name || "Unknown") : "Unassigned"}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Stops:</div>
                  {(r.stops?.length ? r.stops : []).map(s=>(
                    <div key={s.id} className="text-sm">
                      • {s.name} <span className="text-xs text-gray-500">Pickup {s.pickupTime || "—"} / Drop {s.dropTime || "—"}</span>
                    </div>
                  ))}
                  {(!r.stops || r.stops.length===0) && <div className="text-sm text-gray-500">No stops</div>}
                </div>
                <div className="mt-2 flex justify-end">
                  <button className="text-red-600 text-sm" onClick={()=>deleteRoute(r.id)}>Delete Route</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ASSIGN STUDENT → ROUTE */}
      {canManage && (
        <section className="bg-white border rounded-xl p-4 shadow-sm mt-6">
          <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Map Student to Route</h3>
          <form onSubmit={saveMapping} className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <select className="input" value={assignForm.studentId} onChange={e=>setAssignForm(a=>({ ...a, studentId:e.target.value }))}>
              <option value="">Select Student</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.name} {s.cls ? `(${s.cls})` : ""}</option>)}
            </select>

            <select className="input" value={assignForm.routeId} onChange={e=>setAssignForm(a=>({ ...a, routeId:e.target.value, pickupStopId:"", dropStopId:"" }))}>
              <option value="">Select Route</option>
              {routes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <select className="input" value={assignForm.pickupStopId} onChange={e=>setAssignForm(a=>({ ...a, pickupStopId:e.target.value }))}>
              <option value="">Pickup Stop</option>
              {(routeById[Number(assignForm.routeId)]?.stops || []).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input className="input" type="time" placeholder="Pickup Time"
              value={assignForm.pickupTime} onChange={e=>setAssignForm(a=>({ ...a, pickupTime:e.target.value }))}/>

            <select className="input" value={assignForm.dropStopId} onChange={e=>setAssignForm(a=>({ ...a, dropStopId:e.target.value }))}>
              <option value="">Drop Stop</option>
              {(routeById[Number(assignForm.routeId)]?.stops || []).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input className="input" type="time" placeholder="Drop Time"
              value={assignForm.dropTime} onChange={e=>setAssignForm(a=>({ ...a, dropTime:e.target.value }))}/>

            <div className="md:col-span-6 flex justify-end">
              <button className="btn-primary" style={{ backgroundColor: brand.blue, color:"#fff" }}>Save Mapping</button>
            </div>
          </form>
        </section>
      )}

      {/* STUDENT VIEW */}
      <section className="bg-white border rounded-xl p-4 shadow-sm mt-6">
        <h3 className="font-semibold mb-3" style={{ color: brand.blue }}>Student View</h3>

        {/* selector just for demo; in a real app use the logged-in student's id */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <span className="text-sm text-gray-600">Preview as:</span>
          <select className="input" value={studentViewId} onChange={e=>setStudentViewId(e.target.value)}>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} {s.cls ? `(${s.cls})` : ""}</option>)}
          </select>
        </div>

        {!assignedRoute ? (
          <div className="text-sm text-gray-500">No route mapped for this student.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-md">
              <div className="font-semibold mb-1">Route</div>
              <div className="text-sm">{assignedRoute.name}</div>
              <div className="text-xs text-gray-500">Vehicle: {assignedRoute.vehicleNo || "—"}</div>
              <div className="text-xs text-gray-500">Driver: {assignedRoute.driverId ? (driverById[assignedRoute.driverId]?.name || "—") : "—"}</div>
            </div>

            <div className="p-3 border rounded-md">
              <div className="font-semibold mb-1">Pickup</div>
              <div className="text-sm">{pickupStop?.name || "—"}</div>
              <div className="text-xs text-gray-500">Time: {assigned?.pickupTime || pickupStop?.pickupTime || "—"}</div>
            </div>

            <div className="p-3 border rounded-md">
              <div className="font-semibold mb-1">Drop</div>
              <div className="text-sm">{dropStop?.name || "—"}</div>
              <div className="text-xs text-gray-500">Time: {assigned?.dropTime || dropStop?.dropTime || "—"}</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
