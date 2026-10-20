import { categories } from '../data/role'
import type { Category, Difficulty, Question, QuestionType, Status } from '../types'

export interface FilterState {
  category: Category | 'all'
  type: QuestionType | 'all'
  difficulty: Difficulty | 'all'
  status: Status | 'unmarked' | 'all'
  search: string
}

export const defaultFilters: FilterState = {
  category: 'all',
  type: 'all',
  difficulty: 'all',
  status: 'all',
  search: '',
}

export function applyFilters(questions: Question[], f: FilterState, statuses: Record<string, Status>) {
  const term = f.search.trim().toLowerCase()
  return questions.filter((q) => {
    if (f.category !== 'all' && q.category !== f.category) return false
    if (f.type !== 'all' && q.type !== f.type) return false
    if (f.difficulty !== 'all' && q.difficulty !== f.difficulty) return false
    if (f.status !== 'all') {
      const s = statuses[q.id]
      if (f.status === 'unmarked' ? s !== undefined : s !== f.status) return false
    }
    if (term && !`${q.prompt} ${q.keyPoints.join(' ')}`.toLowerCase().includes(term)) return false
    return true
  })
}

interface Props {
  value: FilterState
  onChange: (f: FilterState) => void
  showSearch?: boolean
}

export default function Filters({ value, onChange, showSearch = true }: Props) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...value, [k]: v })
  return (
    <div className="filters">
      {showSearch && (
        <input
          className="input search"
          type="search"
          placeholder="Search questions…"
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
        />
      )}
      <select className="input" value={value.category} onChange={(e) => set('category', e.target.value as FilterState['category'])}>
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <select className="input" value={value.type} onChange={(e) => set('type', e.target.value as FilterState['type'])}>
        <option value="all">Technical + non-technical</option>
        <option value="technical">Technical</option>
        <option value="non-technical">Non-technical</option>
      </select>
      <select className="input" value={value.difficulty} onChange={(e) => set('difficulty', e.target.value as FilterState['difficulty'])}>
        <option value="all">Any difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <select className="input" value={value.status} onChange={(e) => set('status', e.target.value as FilterState['status'])}>
        <option value="all">Any status</option>
        <option value="unmarked">Not reviewed</option>
        <option value="needs-work">Needs work</option>
        <option value="confident">Confident</option>
      </select>
    </div>
  )
}
