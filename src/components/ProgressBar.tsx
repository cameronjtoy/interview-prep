export default function ProgressBar({ confident, needsWork, total }: { confident: number; needsWork: number; total: number }) {
  const pct = (n: number) => (total ? (n / total) * 100 : 0)
  return (
    <div className="pbar" role="img" aria-label={`${confident} confident, ${needsWork} need work, of ${total}`}>
      <span className="pbar-confident" style={{ width: `${pct(confident)}%` }} />
      <span className="pbar-needs" style={{ width: `${pct(needsWork)}%` }} />
    </div>
  )
}
