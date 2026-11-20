export default function StatCard({ label, value, icon, tone, helper }) {
  return <div className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><i className={`pi ${icon}`} /></div><strong>{value ?? '—'}</strong><small>{helper}</small></div>;
}
