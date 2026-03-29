import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const STATUSES = ['pending', 'in_progress', 'done'];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      notify('Failed to load tasks', 'error');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    fetchTasks();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/tasks/${editing}`, form);
        notify('Task updated');
        setEditing(null);
      } else {
        await api.post('/tasks', form);
        notify('Task created');
      }
      setForm({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      notify(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error', 'error');
    }
  };

  const handleEdit = task => {
    setEditing(task.id);
    setForm({ title: task.title, description: task.description || '', status: task.status });
  };

  const handleDelete = async id => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      notify('Task deleted');
      fetchTasks();
    } catch (err) {
      notify(err.response?.data?.error || 'Error', 'error');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Dashboard</h2>
        <div>
          <span>👤 {user.name} ({user.role})</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      {msg.text && <p className={msg.type === 'error' ? 'error' : 'success'}>{msg.text}</p>}

      <section className="task-form">
        <h3>{editing ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="form-actions">
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', status: 'pending' }); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="task-list">
        <h3>Tasks {user.role === 'admin' ? '(All Users)' : ''}</h3>
        {tasks.length === 0 ? <p>No tasks yet.</p> : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                {user.role === 'admin' && <th>Owner</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description || '-'}</td>
                  <td><span className={`badge ${task.status}`}>{task.status}</span></td>
                  {user.role === 'admin' && <td>{task.owner}</td>}
                  <td>
                    <button onClick={() => handleEdit(task)}>Edit</button>
                    <button onClick={() => handleDelete(task.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
