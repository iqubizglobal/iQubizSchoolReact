import React from 'react';
import RoleEditor from '../RoleEditor';
import UserEditor from '../UserEditor';
import SubjectEditor from "../SubjectEditor";

export default function AdminSetup({ brand, roles, setRoles, users, setUsers }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div><RoleEditor brand={brand} roles={roles} setRoles={setRoles} users={users} /></div>
      <div><UserEditor brand={brand} roles={roles} users={users} setUsers={setUsers} /></div>
      <div><SubjectEditor brand={brand} /></div>
    </div>
  );
}

