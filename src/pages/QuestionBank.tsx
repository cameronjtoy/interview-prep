import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Filters, { applyFilters, defaultFilters, type FilterState } from '../components/Filters'
import QuestionCard from '../components/QuestionCard'
import { questions } from '../data/questions'
import { categories } from '../data/role'
import { useProgress } from '../hooks/useProgress'

export default function QuestionBank() {
  const [params] = useSearchParams()
  const initialCategory = params.get('category')
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: categories.some((c) => c.id === initialCategory) ? (initialCategory as FilterState['category']) : 'all',
  })
  const { statuses } = useProgress()
  const visible = useMemo(() => applyFilters(questions, filters, statuses), [filters, statuses])

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Question bank</h1>
        <p className="muted">Tap a question to reveal key points. Sources note where a question or close variant has been reported.</p>
      </div>
      <Filters value={filters} onChange={setFilters} />
      <div className="result-bar">
        <span className="muted">{visible.length} of {questions.length} questions</span>
        {visible.length > 0 && (
          <Link className="btn btn-ghost small" to="/flashcards" state={{ filters }}>
            Study these as flashcards →
          </Link>
        )}
      </div>
      <div className="stack-sm">
        {visible.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
        {visible.length === 0 && <p className="empty">No questions match these filters.</p>}
      </div>
    </div>
  )
}
