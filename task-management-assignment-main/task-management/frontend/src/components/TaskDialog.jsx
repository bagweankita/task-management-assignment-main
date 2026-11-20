import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const statuses = ['To Do', 'In Progress', 'Completed'].map(x => ({ label: x, value: x }));
const priorities = ['Low', 'Medium', 'High'].map(x => ({ label: x, value: x }));

export default function TaskDialog({ visible, onHide, onSave, users, task }) {
  const empty = { title: '', description: '', status: 'To Do', priority: 'Medium', dueDate: null, assignee: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!visible) return;
    setForm(task ? {
      title: task.title, description: task.description || '', status: task.status, priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null, assignee: task.assignee?._id || task.assignee || ''
    } : empty);
    setError('');
  }, [visible, task]);
  const change = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim() || form.title.trim().length < 2) return setError('Enter a title with at least 2 characters.');
    if (!form.dueDate) return setError('Please select a due date.');
    if (!form.assignee) return setError('Please assign this task to a team member.');
    setSaving(true); setError('');
    try {
      await onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate.toISOString() });
      onHide();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  return <Dialog header={task ? 'Edit task' : 'Create a task'} visible={visible} onHide={onHide} modal style={{ width: 'min(560px, 94vw)' }}>
    <form className="task-form" onSubmit={submit}>
      <label>Task title *</label><InputText value={form.title} maxLength={120} onChange={e => change('title', e.target.value)} placeholder="e.g. Build reporting dashboard" />
      <label>Description</label><InputTextarea value={form.description} rows={3} maxLength={2000} onChange={e => change('description', e.target.value)} placeholder="Add task details..." />
      <div className="form-grid">
        <div><label>Status</label><Dropdown value={form.status} options={statuses} onChange={e => change('status', e.value)} /></div>
        <div><label>Priority</label><Dropdown value={form.priority} options={priorities} onChange={e => change('priority', e.value)} /></div>
        <div><label>Due date *</label><Calendar value={form.dueDate} onChange={e => change('dueDate', e.value)} dateFormat="dd M yy" showIcon /></div>
        <div><label>Assignee *</label><Dropdown value={form.assignee} options={users.map(u => ({ label: u.name, value: u._id }))} onChange={e => change('assignee', e.value)} placeholder="Select member" /></div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="dialog-actions"><Button type="button" label="Cancel" severity="secondary" text onClick={onHide} /><Button type="submit" label={saving ? 'Saving...' : 'Save task'} icon="pi pi-check" loading={saving} /></div>
    </form>
  </Dialog>;
}
