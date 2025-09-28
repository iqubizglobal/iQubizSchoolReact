import React, {useEffect,useState} from 'react';
import { readUsers, writeUsers } from '../../storage.js';
export default function UserEditor({brand, roles, users, setUsers}){
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({name:'', email:'', role: roles[0]||'Student', cls: ''});
  useEffect(()=> setForm(f=>({...f, role: roles[0]||f.role})), [roles]);
  function addUser(e){ e.preventDefault(); if(!form.name.trim()||!form.email.trim()) return alert('Enter name and email'); const id=Math.max(0,...readUsers().map(u=>u.id))+1; const newUser={id,name:form.name.trim(),email:form.email.trim(),role:form.role,cls:form.cls}; const updated=[...readUsers(), newUser]; writeUsers(updated); setUsers(updated); setForm({name:'',email:'',role:roles[0]||'Student',cls:''}); }
  function saveEdit(id){ if(!form.name.trim()||!form.email.trim()) return alert('Enter name and email'); const updated=readUsers().map(u=> u.id===id? {...u, name:form.name.trim(), email:form.email.trim(), role:form.role, cls:form.cls}: u); writeUsers(updated); setUsers(updated); setEditingId(null); setForm({name:'',email:'',role:roles[0]||'Student',cls:''}); }
  function startEdit(u){ setEditingId(u.id); setForm({name:u.name, email:u.email, role:u.role, cls:u.cls||''}); }
  function deleteUser(id){ if(!confirm('Delete user?')) return; const updated=readUsers().filter(x=>x.id!==id); writeUsers(updated); setUsers(updated); }
  const visible = readUsers().filter(u=> filter.trim()? `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(filter.toLowerCase()): true);
  return (<div className="p-4 rounded-xl shadow-sm border bg-white">
    <h2 className="text-lg font-semibold mb-3" style={{color:brand.blue}}>Users</h2>
    <div className="mb-3 flex gap-2"><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search users" className="flex-1 border rounded-md px-3 py-2"/></div>
    <div className="overflow-x-auto mb-4"><table className="w-full text-sm table-auto border-collapse"><thead><tr className="text-left text-gray-500"><th className="pb-2">Name</th><th className="pb-2">Email</th><th className="pb-2">Role</th><th className="pb-2">Class</th><th className="pb-2">Actions</th></tr></thead><tbody>{visible.map(u=>(<tr key={u.id} className="border-t"><td className="py-2">{u.name}</td><td className="py-2">{u.email}</td><td className="py-2">{u.role}</td><td className="py-2">{u.cls||'-'}</td><td className="py-2"><div className="flex gap-2"><button onClick={()=>startEdit(u)} className="px-3 py-1 border rounded-md text-sm">Edit</button><button onClick={()=>deleteUser(u.id)} className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button></div></td></tr>))}{visible.length===0&&(<tr><td colSpan="5" className="py-6 text-center text-sm text-gray-500">No users found</td></tr>)}</tbody></table></div>
    <div className="border-t pt-4"><h3 className="font-medium mb-3">{editingId? 'Edit user':'Add user'}</h3>
    <form onSubmit={editingId? (e)=> (e.preventDefault(), saveEdit(editingId)) : addUser} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
      <input value={form.name} onChange={e=>setForm(s=>({...s, name:e.target.value}))} placeholder="Full name" className="border rounded-md px-3 py-2 col-span-1 sm:col-span-2"/>
      <input value={form.email} onChange={e=>setForm(s=>({...s, email:e.target.value}))} placeholder="email@example.com" className="border rounded-md px-3 py-2 col-span-1 sm:col-span-1"/>
      <input value={form.cls} onChange={e=>setForm(s=>({...s, cls:e.target.value}))} placeholder="Class (e.g., 10-A)" className="border rounded-md px-3 py-2 col-span-1 sm:col-span-1"/>
      <select value={form.role} onChange={e=>setForm(s=>({...s, role:e.target.value}))} className="border rounded-md px-3 py-2 col-span-1 sm:col-span-1">{roles.map(r=>(<option key={r} value={r}>{r}</option>))}</select>
      <div className="sm:col-span-4 flex gap-2 mt-2"><button type="submit" className="px-4 py-2 rounded-md bg-[rgba(12,60,120,1)] text-white">{editingId? 'Save':'Add'}</button>{editingId&&<button type="button" onClick={()=>{ setEditingId(null); setForm({name:'',email:'',role:roles[0]||'Student',cls:''})}} className="px-4 py-2 rounded-md border">Cancel</button>}</div>
    </form></div></div>);
}
