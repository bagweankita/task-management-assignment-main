import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { getTasks, getDashboard, getUsers, createTask, updateTask, deleteTask } from './api';
import TaskDialog from './components/TaskDialog';
import StatCard from './components/StatCard';

const statusOptions = [{ label: 'All statuses', value: '' }, ...['To Do', 'In Progress', 'Completed'].map(x => ({ label: x, value: x }))];
const priorityOptions = [{ label: 'All priorities', value: '' }, ...['Low', 'Medium', 'High'].map(x => ({ label: x, value: x }))];

export default function App() {
  const toast = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sortBy: 'createdAt', order: 'desc' });
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ visible: false, task: null });
  const [activeTab, setActiveTab] = useState('tasks');
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true); setLoadError('');
    try {
      const [taskResult, dash, team] = await Promise.all([
        getTasks({ page, limit: pagination.limit, ...currentFilters }), getDashboard(), getUsers()
      ]);
      setTasks(taskResult.data); setPagination(taskResult.pagination); setDashboard(dash); setUsers(team);
    } catch (err) { setLoadError(err.message); }
    finally { setLoading(false); }
  }, [filters, pagination.limit]);

  useEffect(() => { load(1, filters); }, [filters.search, filters.status, filters.priority, filters.sortBy, filters.order]);
  useEffect(() => { load(1); }, []);

  const notify = (severity, summary, detail) => toast.current?.show({ severity, summary, detail, life: 3000 });
  const save = async payload => {
    if (dialog.task) await updateTask(dialog.task._id, payload);
    else await createTask(payload);
    await load(1); notify('success', 'Success', dialog.task ? 'Task updated.' : 'Task created.');
  };
  const remove = task => confirmDialog({
    message: `Delete "${task.title}"? This action cannot be undone.`, header: 'Delete task', icon: 'pi pi-exclamation-triangle',
    acceptClassName: 'p-button-danger', accept: async () => {
      try { await deleteTask(task._id); await load(1); notify('success', 'Deleted', 'Task removed successfully.'); }
      catch (err) { notify('error', 'Delete failed', err.message); }
    }
  });
  const statusBody = row => <Tag value={row.status} severity={row.status === 'Completed' ? 'success' : row.status === 'In Progress' ? 'info' : 'warning'} />;
  const priorityBody = row => <span className={`priority priority-${row.priority.toLowerCase()}`}><span />{row.priority}</span>;
  const dueBody = row => {
    const date = new Date(row.dueDate);
    const overdue = row.status !== 'Completed' && date < new Date(new Date().setHours(0, 0, 0, 0));
    return <span className={overdue ? 'overdue' : ''}>{date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}{overdue && <small> Overdue</small>}</span>;
  };
  const actions = row => <div className="row-actions"><Button icon="pi pi-pencil" text rounded severity="secondary" aria-label="Edit task" onClick={() => setDialog({ visible: true, task: row })} /><Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete task" onClick={() => remove(row)} /></div>;
  const changeFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const onPage = e => load(e.page + 1);
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return <div className="app-shell">
    <Toast ref={toast} /><ConfirmDialog />
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><i className="pi pi-check-square" /></span><span>TaskFlow<small>WORKSPACE</small></span></div>
      <div className="side-label">WORKSPACE</div>
      <button className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}><i className="pi pi-list" /> Tasks <span>{pagination.total}</span></button>
      <button className={`nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}><i className="pi pi-users" /> Team</button>
      <div className="sidebar-bottom"><div className="profile-avatar">AB</div><div><b>Ankita Bagwe</b><small>Workspace Admin</small></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><span className="breadcrumb">Workspace /</span> <b>{activeTab === 'tasks' ? 'Tasks overview' : 'Team members'}</b></div><div className="topbar-right"><span className="today-label">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span><span className="top-avatar">AB</span></div></header>
      <section className="page-content">
        {activeTab === 'tasks' ? <>
          <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Task management</h1><p>Plan, track and deliver your team's work.</p></div><Button label="Create task" icon="pi pi-plus" onClick={() => setDialog({ visible: true, task: null })} /></div>
          <div className="stats-grid">
            <StatCard label="Total tasks" value={dashboard?.total} icon="pi-briefcase" tone="blue" helper="Across your workspace" />
            <StatCard label="To do" value={dashboard?.counts?.['To Do']} icon="pi-circle" tone="amber" helper="Waiting to be started" />
            <StatCard label="In progress" value={dashboard?.counts?.['In Progress']} icon="pi-sync" tone="violet" helper="Currently being worked on" />
            <StatCard label="Completed" value={dashboard?.counts?.Completed} icon="pi-check-circle" tone="green" helper="Successfully finished" />
            <StatCard label="Overdue" value={dashboard?.overdue} icon="pi-clock" tone="red" helper="Past due and not completed" />
          </div>
          <section className="panel">
            <div className="panel-heading"><div><h2>All tasks</h2><p>Manage and monitor your team's tasks</p></div><span className="result-count">{pagination.total} results</span></div>
            <div className="filters">
              <span className="search-box"><i className="pi pi-search" /><InputText value={filters.search} onChange={e => changeFilter('search', e.target.value)} placeholder="Search tasks..." /></span>
              <Dropdown value={filters.status} options={statusOptions} onChange={e => changeFilter('status', e.value)} />
              <Dropdown value={filters.priority} options={priorityOptions} onChange={e => changeFilter('priority', e.value)} />
              <Dropdown value={`${filters.sortBy}:${filters.order}`} options={[
                { label: 'Newest first', value: 'createdAt:desc' }, { label: 'Oldest first', value: 'createdAt:asc' },
                { label: 'Due date (soonest)', value: 'dueDate:asc' }, { label: 'Due date (latest)', value: 'dueDate:desc' },
                { label: 'Title A–Z', value: 'title:asc' }
              ]} onChange={e => { const [sortBy, order] = e.value.split(':'); setFilters(p => ({ ...p, sortBy, order })); }} />
            </div>
            {loadError ? <div className="empty-state"><i className="pi pi-exclamation-circle" /><b>Could not load tasks</b><p>{loadError}</p><Button label="Try again" onClick={() => load(1)} /></div> :
              <DataTable value={tasks} loading={loading} dataKey="_id" emptyMessage="No tasks found. Create a task to get started." responsiveLayout="scroll" className="tasks-table">
                <Column field="title" header="TASK" body={row => <div className="task-title"><b>{row.title}</b><small>{row.description || 'No description'}</small></div>} />
                <Column header="ASSIGNEE" body={row => <div className="assignee-cell"><span className="mini-avatar">{row.assignee?.name?.split(' ').map(x => x[0]).join('').slice(0, 2) || '?'}</span>{row.assignee?.name || 'Unassigned'}</div>} />
                <Column header="STATUS" body={statusBody} />
                <Column header="PRIORITY" body={priorityBody} />
                <Column header="DUE DATE" body={dueBody} />
                <Column header="ACTIONS" body={actions} />
              </DataTable>}
            <div className="table-footer"><span>Showing {start}–{end} of {pagination.total}</span><div className="pagination"><Button icon="pi pi-angle-left" text rounded disabled={pagination.page <= 1 || loading} onClick={() => load(pagination.page - 1)} /><span>Page {pagination.page} of {Math.max(pagination.totalPages, 1)}</span><Button icon="pi pi-angle-right" text rounded disabled={pagination.page >= pagination.totalPages || loading} onClick={() => load(pagination.page + 1)} /></div></div>
          </section>
        </> : <section className="panel team-panel"><div className="page-heading"><div><div className="eyebrow">WORKSPACE</div><h1>Team members</h1><p>People who can be assigned to tasks.</p></div></div><div className="team-grid">{users.map(user => <div className="team-card" key={user._id}><div className="team-avatar">{user.name.split(' ').map(x => x[0]).join('').slice(0, 2)}</div><b>{user.name}</b><span>{user.role}</span><small>{user.email}</small></div>)}</div></section>}
      </section>
    </main>
    <TaskDialog visible={dialog.visible} task={dialog.task} users={users} onHide={() => setDialog({ visible: false, task: null })} onSave={save} />
  </div>;
}
