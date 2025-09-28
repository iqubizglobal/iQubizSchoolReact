import React, {useState} from 'react';
import { readUsers, writeUsers } from '../../storage.js';
function readUsersSafe(){ return readUsers(); }
export default function RoleEditor({brand, roles, setRoles, users}){
  const [newRole, setNewRole] = useState('');
  const [editing, setEditing] = useState(null);
  const [rename, setRename] = useState('');
  function addRole(){ const t=newRole.trim(); if(!t) return alert('Enter role'); if(roles.includes(t)) return alert('Exists'); setRoles(r=>[...r,t]); setNewRole(''); }
  function removeRole(rName){ const assigned = users.some(u=>u.role===rName); if(assigned) return alert('Cannot delete role with users'); if(!confirm('Delete?')) return; setRoles(r=>r.filter(x=>x!==rName)); }
  function startRename(r){ setEditing(r); setRename(r); }
  function saveRename(oldName){ const v=rename.trim(); if(!v) return alert('Enter name'); if(v===oldName){ setEditing(null); return; } if(roles.includes(v)) return alert('Exists'); setRoles(rs=>rs.map(x=> x===oldName? v: x)); const stored=readUsersSafe(); const updated=stored.map(u=> u.role===oldName? {...u, role:v}: u); writeUsers(updated); setEditing(null); alert('Renamed'); }
  return (<div className="p-4 rounded-xl shadow-sm border bg-white">
    <h2 className="text-lg font-semibold mb-3" style={{color:brand.blue}}>Roles</h2>
    <div className="mb-4 flex gap-2"><input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="New role name" className="flex-1 border rounded-md px-3 py-2"/><button onClick={addRole} className="px-4 py-2 rounded-md bg-[rgba(241,90,36,1)] text-white">Add</button></div>
    <div className="space-y-2">{roles.map(r=> (<div key={r} className="flex items-center justify-between p-2 border rounded-md">
      <div>{editing===r? <input value={rename} onChange={e=>setRename(e.target.value)} className="border rounded-md px-2 py-1"/>: <div className="font-medium">{r}</div>}<div className="text-xs text-gray-500">Users assigned: {users.filter(u=>u.role===r).length}</div></div>
      <div className="flex gap-2">{editing===r? <><button onClick={()=>saveRename(r)} className="px-3 py-1 border rounded-md text-sm bg-[rgba(12,60,120,0.06)]">Save</button><button onClick={()=>setEditing(null)} className="px-3 py-1 border rounded-md text-sm">Cancel</button></>: <><button onClick={()=>startRename(r)} className="px-3 py-1 border rounded-md text-sm">Rename</button><button onClick={()=>removeRole(r)} className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button></>}</div></div>))}</div>
  </div>);
}
