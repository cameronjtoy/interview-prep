import { setStatus, useProgress } from '../hooks/useProgress'
import type { Status } from '../types'

const options: { value: Status; label: string }[] = [
  { value: 'confident', label: 'Confident' },
  { value: 'needs-work', label: 'Needs work' },
]

export default function StatusToggle({ id }: { id: string }) {
  const current = useProgress().statuses[id]
  return (
    <div className="status-toggle" role="group" aria-label="Mark progress">
      {options.map((o) => (
        <button
          key={o.value}
          className={`chip chip-${o.value}${current === o.value ? ' active' : ''}`}
          aria-pressed={current === o.value}
          onClick={(e) => {
            e.stopPropagation()
            setStatus(id, current === o.value ? null : o.value)
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
