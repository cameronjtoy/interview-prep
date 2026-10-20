import { categoryLabel } from '../data/role'
import type { Question } from '../types'

export default function Tags({ q }: { q: Question }) {
  return (
    <div className="tags">
      <span className="tag tag-cat">{categoryLabel(q.category)}</span>
      <span className={`tag tag-${q.type}`}>{q.type === 'technical' ? 'Technical' : 'Non-technical'}</span>
      <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>
    </div>
  )
}
