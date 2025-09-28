import React, { useState, useEffect } from "react";
import { IconRoute, IconStop } from "../Icons";
import { readTransportRoutes, writeTransportRoutes } from "../../storage";

export default function Routes({ brand }) {
  const [routes, setRoutes] = useState(readTransportRoutes());
  const [routeName, setRouteName] = useState("");
  const [stopName, setStopName] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    writeTransportRoutes(routes);
  }, [routes]);

  const addRoute = () => {
    if (!routeName) return;
    setRoutes([...routes, { id: Date.now(), name: routeName, stops: [] }]);
    setRouteName("");
  };

  const addStop = () => {
    if (!stopName || selected === null) return;
    const newRoutes = [...routes];
    newRoutes[selected].stops.push(stopName);
    setRoutes(newRoutes);
    setStopName("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3" style={{ color: brand.blue }}>
        {IconRoute} Routes & Stops
      </h3>

      {/* Add Route */}
      <div className="flex gap-2 mb-3">
        <input className="input flex-1" placeholder="New Route Name" value={routeName}
          onChange={(e) => setRouteName(e.target.value)} />
        <button onClick={addRoute} className="px-3 py-2 bg-orange-500 text-white rounded">Add</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Routes List */}
        <ul className="space-y-2">
          {routes.map((r, i) => (
            <li key={r.id} onClick={() => setSelected(i)}
              className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                selected === i ? "bg-orange-100 border-l-4 border-orange-500" : "bg-gray-50"
              }`}>
              <span>{r.name}</span>
              <span className="text-xs text-gray-500">{r.stops.length} stops</span>
            </li>
          ))}
        </ul>

        {/* Stops Editor */}
        {selected !== null && (
          <div>
            <div className="flex gap-2 mb-2">
              <input className="input flex-1" placeholder="New Stop" value={stopName}
                onChange={(e) => setStopName(e.target.value)} />
              <button onClick={addStop} className="px-3 py-2 bg-blue-500 text-white rounded">Add</button>
            </div>
            <ul className="space-y-1">
              {routes[selected].stops.map((s, j) => (
                <li key={j} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded">
                  {IconStop} <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
