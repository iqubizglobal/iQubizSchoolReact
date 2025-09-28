import React, { useState } from "react";
import Drivers from "./Drivers";
import Routes from "./Routes";
import StudentMapping from "./StudentMapping";
import StudentTransportView from "./StudentTransportView";

const tabs = [
  { id: "drivers", label: "Drivers" },
  { id: "routes", label: "Routes & Stops" },
  { id: "mapping", label: "Student Mapping" },
  { id: "student-view", label: "Student View" },
];

export default function Transport({ brand, currentRole, users }) {
  const [activeTab, setActiveTab] = useState("drivers");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4" style={{ color: brand.blue }}>
        Transport Management
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 -mb-px border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "drivers" && <Drivers brand={brand} />}
      {activeTab === "routes" && <Routes brand={brand} />}
      {activeTab === "mapping" && (
        <StudentMapping brand={brand} users={users} />
      )}
      {activeTab === "student-view" && (
        <StudentTransportView brand={brand} users={users} />
      )}
    </div>
  );
}
