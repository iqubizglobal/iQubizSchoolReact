import React, { useEffect, useState } from "react";
import TimetableEditor from "./TimetableEditor";
import TimetableMatrixView from "./TimetableMatrixView";
import { readTimetables, writeTimetables } from "../../storage";

export default function Timetable({ currentRole, users, brand = {} }) {
  const [timetables, setTimetables] = useState(() => readTimetables());

  useEffect(() => {
    writeTimetables(timetables);
  }, [timetables]);

  const canEdit = ["Teacher", "Principal", "Owner"].includes(currentRole);
  const studentUser = users.find((u) => u.role === "Student");

  return (
    <div className="p-4 card">
      <h2 className="text-xl font-bold mb-4">Class Timetable</h2>

      {canEdit ? (
        <TimetableEditor timetables={timetables} setTimetables={setTimetables} />
      ) : studentUser ? (
        <TimetableMatrixView
          className={studentUser.className}
          timetable={timetables[studentUser.className]}
          brand={brand}
        />
      ) : (
        <div>No timetable available for your class.</div>
      )}
    </div>
  );
}
