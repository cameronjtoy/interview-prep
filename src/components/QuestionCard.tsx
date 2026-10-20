import { useState } from 'react'
import type { Question } from '../types'
import AnswerDetails from './AnswerDetails'
import StatusToggle from './StatusToggle'
import Tags from './Tags'

export default function QuestionCard({ q }: { q: Question }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`card qcard${open ? ' open' : ''}`}>
      <button className="qcard-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Tags q={q} />
        <span className="qcard-prompt">{q.prompt}</span>
        <span className="qcard-caret" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open && <AnswerDetails q={q} />}
      <div className="qcard-foot">
        <StatusToggle id={q.id} />
      </div>
    </article>
  )
}
