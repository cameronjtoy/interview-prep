import { useState } from 'react'
import { exercises } from '../data/exercises'
import { recordExercise, useProgress } from '../hooks/useProgress'
import type { Exercise } from '../types'

const topics = ['All', ...new Set(exercises.map((e) => e.topic))]

export default function Exercises() {
  const [topic, setTopic] = useState('All')
  const { exercises: results } = useProgress()
  const visible = exercises.filter((e) => topic === 'All' || e.topic === topic)
  const correct = Object.values(results).filter(Boolean).length

  return (
    <div className="stack narrow">
      <div className="page-head">
        <h1>Exercises</h1>
        <p className="muted">
          Metric math, campaign tables, SQL and Excel — the hands-on part of agency analyst interviews.
          Work it out on paper first. {correct}/{exercises.length} correct so far.
        </p>
      </div>
      <div className="pill-row">
        {topics.map((t) => (
          <button key={t} className={`pill${topic === t ? ' active' : ''}`} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="stack-sm">
        {visible.map((ex, i) => (
          <ExerciseCard key={ex.id} ex={ex} n={i + 1} prior={results[ex.id]} />
        ))}
      </div>
    </div>
  )
}

function parseNumber(raw: string) {
  const n = parseFloat(raw.replace(/[$,%x\s]/gi, ''))
  return Number.isFinite(n) ? n : null
}

function ExerciseCard({ ex, n, prior }: { ex: Exercise; n: number; prior?: boolean }) {
  const [input, setInput] = useState('')
  const [choice, setChoice] = useState<number | null>(null)
  const [result, setResult] = useState<boolean | null>(null)

  const check = () => {
    let ok: boolean
    if (ex.kind === 'numeric') {
      const v = parseNumber(input)
      if (v === null) return
      ok = Math.abs(v - ex.answer) <= ex.tolerance
    } else {
      if (choice === null) return
      ok = choice === ex.answerIndex
    }
    setResult(ok)
    recordExercise(ex.id, ok)
  }

  const reset = () => {
    setInput('')
    setChoice(null)
    setResult(null)
  }

  return (
    <article className={`card exercise${result === true ? ' correct' : result === false ? ' wrong' : ''}`}>
      <div className="ex-head">
        <span className="tag tag-cat">{ex.topic}</span>
        <span className="muted small">#{n}</span>
        {prior !== undefined && result === null && (
          <span className={`small ${prior ? 'ok-text' : 'bad-text'}`}>{prior ? '✓ solved before' : '✗ missed before'}</span>
        )}
      </div>
      {ex.context && <pre className="context">{ex.context}</pre>}
      <p className="ex-prompt">{ex.prompt}</p>

      {ex.kind === 'numeric' ? (
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
        >
          <div className="num-input">
            {ex.unit === '$' && <span className="affix">$</span>}
            <input
              className="input"
              inputMode="decimal"
              placeholder="Your answer"
              value={input}
              disabled={result !== null}
              onChange={(e) => setInput(e.target.value)}
            />
            {ex.unit && ex.unit !== '$' && <span className="affix">{ex.unit}</span>}
          </div>
          {result === null && <button className="btn btn-primary" disabled={!input.trim()}>Check</button>}
        </form>
      ) : (
        <div className="options">
          {ex.options.map((o, i) => (
            <button
              key={o}
              disabled={result !== null}
              className={`option${choice === i ? ' selected' : ''}${result !== null && i === ex.answerIndex ? ' answer' : ''}${
                result === false && choice === i ? ' miss' : ''
              }`}
              onClick={() => setChoice(i)}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              {o}
            </button>
          ))}
          {result === null && (
            <button className="btn btn-primary align-start" disabled={choice === null} onClick={check}>Check</button>
          )}
        </div>
      )}

      {result !== null && (
        <div className="feedback">
          <strong>{result ? 'Correct.' : ex.kind === 'numeric' ? `Not quite — answer: ${formatAnswer(ex)}` : 'Not quite.'}</strong>{' '}
          {ex.explanation}
          <div>
            <button className="btn btn-ghost small" onClick={reset}>Try again</button>
          </div>
        </div>
      )}
    </article>
  )
}

function formatAnswer(ex: Extract<Exercise, { kind: 'numeric' }>) {
  const v = ex.answer.toLocaleString()
  return ex.unit === '$' ? `$${v}` : ex.unit ? `${v}${ex.unit}` : v
}
