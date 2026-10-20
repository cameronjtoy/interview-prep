import { useEffect, useState } from 'react'
import AnswerDetails from '../components/AnswerDetails'
import Tags from '../components/Tags'
import { questions } from '../data/questions'
import { categoryLabel } from '../data/role'
import { setStatus } from '../hooks/useProgress'
import { formatTime, shuffle } from '../lib'
import type { Question } from '../types'

type Mix = 'balanced' | 'technical' | 'non-technical'

interface Settings {
  count: number
  mix: Mix
  minutes: number
}

interface Answer {
  notes: string
  rating: number | null
  seconds: number
}

function buildSet({ count, mix }: Settings): Question[] {
  if (mix !== 'balanced') return shuffle(questions.filter((q) => q.type === mix)).slice(0, count)
  const tech = shuffle(questions.filter((q) => q.type === 'technical'))
  const non = shuffle(questions.filter((q) => q.type === 'non-technical'))
  const nonCount = Math.floor(count / 2)
  // Open with a non-technical warm-up, like a real interview.
  const [warmUp, ...restNon] = non.slice(0, nonCount)
  return [warmUp, ...shuffle([...restNon, ...tech.slice(0, count - nonCount)])].filter(Boolean)
}

const ratingLabels = ['', 'Blanked', 'Weak', 'OK', 'Good', 'Nailed it']

export default function MockInterview() {
  const [settings, setSettings] = useState<Settings>({ count: 8, mix: 'balanced', minutes: 3 })
  const [phase, setPhase] = useState<'setup' | 'running' | 'summary'>('setup')
  const [set, setSet] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (phase !== 'running' || paused || revealed) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [phase, paused, revealed])

  const start = () => {
    const s = buildSet(settings)
    setSet(s)
    setAnswers(s.map(() => ({ notes: '', rating: null, seconds: 0 })))
    setIndex(0)
    setElapsed(0)
    setRevealed(false)
    setPaused(false)
    setPhase('running')
  }

  const update = (patch: Partial<Answer>) =>
    setAnswers((a) => a.map((x, i) => (i === index ? { ...x, ...patch } : x)))

  const next = () => {
    update({ seconds: elapsed })
    if (index + 1 >= set.length) {
      setPhase('summary')
      return
    }
    setIndex(index + 1)
    setElapsed(0)
    setRevealed(false)
  }

  if (phase === 'setup') {
    return (
      <div className="stack narrow">
        <div className="page-head">
          <h1>Mock interview</h1>
          <p className="muted">
            A random set of questions with a timer. Answer out loud as if the interviewer were in the room, jot notes,
            then reveal the key points and rate yourself honestly.
          </p>
        </div>
        <div className="card stack">
          <fieldset className="field">
            <legend>Number of questions</legend>
            <div className="segmented">
              {[5, 8, 12].map((n) => (
                <button key={n} className={settings.count === n ? 'active' : ''} onClick={() => setSettings({ ...settings, count: n })}>
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <legend>Question mix</legend>
            <div className="segmented">
              {(['balanced', 'technical', 'non-technical'] as Mix[]).map((m) => (
                <button key={m} className={settings.mix === m ? 'active' : ''} onClick={() => setSettings({ ...settings, mix: m })}>
                  {m === 'balanced' ? 'Balanced' : m === 'technical' ? 'Technical' : 'Non-technical'}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <legend>Time per question</legend>
            <div className="segmented">
              {[1, 2, 3, 5].map((m) => (
                <button key={m} className={settings.minutes === m ? 'active' : ''} onClick={() => setSettings({ ...settings, minutes: m })}>
                  {m} min
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn btn-primary btn-lg" onClick={start}>Start interview</button>
        </div>
      </div>
    )
  }

  if (phase === 'summary') return <Summary set={set} answers={answers} onRestart={() => setPhase('setup')} />

  const q = set[index]
  const answer = answers[index]
  const remaining = settings.minutes * 60 - elapsed
  const pct = Math.min(100, (elapsed / (settings.minutes * 60)) * 100)

  return (
    <div className="stack narrow">
      <div className="mock-top">
        <span className="muted">Question {index + 1} of {set.length}</span>
        <div className={`timer${remaining < 0 ? ' over' : remaining <= 30 ? ' warn' : ''}`}>
          {formatTime(remaining)}
        </div>
      </div>
      <div className="timebar"><span style={{ width: `${pct}%` }} /></div>

      <div className="card stack">
        <Tags q={q} />
        <p className="mock-prompt">{q.prompt}</p>
        <textarea
          className="input notes"
          placeholder="Notes or outline (optional) — the real practice is answering out loud."
          value={answer.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={5}
        />
        <div className="row">
          {!revealed ? (
            <>
              <button className="btn" onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</button>
              <button className="btn btn-primary" onClick={() => setRevealed(true)}>I'm done — reveal key points</button>
            </>
          ) : null}
        </div>
        {revealed && (
          <>
            <AnswerDetails q={q} />
            <div className="field">
              <span className="legend">How did you do?</span>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} className={answer.rating === r ? 'active' : ''} onClick={() => update({ rating: r })}>
                    <strong>{r}</strong>
                    <span>{ratingLabels[r]}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" disabled={answer.rating === null} onClick={next}>
              {index + 1 >= set.length ? 'Finish & see summary' : 'Next question →'}
            </button>
          </>
        )}
      </div>
      <button className="btn btn-ghost small align-start" onClick={() => setPhase('summary')}>End interview early</button>
    </div>
  )
}

function Summary({ set, answers, onRestart }: { set: Question[]; answers: Answer[]; onRestart: () => void }) {
  const [saved, setSaved] = useState(false)
  const rated = answers.map((a, i) => ({ a, q: set[i] })).filter((x) => x.a.rating !== null)
  const avg = rated.length ? rated.reduce((s, x) => s + (x.a.rating ?? 0), 0) / rated.length : 0
  const weak = rated.filter((x) => (x.a.rating ?? 0) <= 2)
  const strong = rated.filter((x) => (x.a.rating ?? 0) >= 4)

  const ratingsByCategory = new Map<string, number[]>()
  rated.forEach(({ a, q }) => ratingsByCategory.set(q.category, [...(ratingsByCategory.get(q.category) ?? []), a.rating!]))
  const byCategory = [...ratingsByCategory.entries()]
    .map(([cat, rs]) => ({ cat, avg: rs.reduce((s, r) => s + r, 0) / rs.length }))
    .sort((x, y) => x.avg - y.avg)

  return (
    <div className="stack narrow">
      <div className="page-head">
        <h1>Interview summary</h1>
        <p className="muted">{rated.length} of {set.length} questions answered</p>
      </div>
      <div className="stats">
        <div className="stat"><span className="stat-num">{avg.toFixed(1)}</span><span className="stat-label">average self-rating</span></div>
        <div className="stat"><span className="stat-num">{strong.length}</span><span className="stat-label">strong answers (4–5)</span></div>
        <div className="stat"><span className="stat-num">{weak.length}</span><span className="stat-label">to revisit (1–2)</span></div>
      </div>

      {byCategory.length > 0 && (
        <div className="card">
          <h2>By category</h2>
          <ul className="cat-scores">
            {byCategory.map(({ cat, avg }) => (
              <li key={cat}>
                <span>{categoryLabel(cat)}</span>
                <span className="score-bar"><span style={{ width: `${(avg / 5) * 100}%` }} /></span>
                <span className="muted">{avg.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row">
        {weak.length > 0 && (
          <button
            className="btn"
            disabled={saved}
            onClick={() => {
              weak.forEach(({ q }) => setStatus(q.id, 'needs-work'))
              setSaved(true)
            }}
          >
            {saved ? `Saved ${weak.length} to "needs work"` : `Mark ${weak.length} weak answers as "needs work"`}
          </button>
        )}
        <button className="btn btn-primary" onClick={onRestart}>New interview</button>
      </div>

      <div className="stack-sm">
        {set.map((q, i) => (
          <details key={q.id} className="card review">
            <summary>
              <span className={`rating-pill r${answers[i].rating ?? 0}`}>{answers[i].rating ?? '–'}</span>
              <span>{q.prompt}</span>
              <span className="muted small">{formatTime(answers[i].seconds)}</span>
            </summary>
            {answers[i].notes && <p className="notes-view">{answers[i].notes}</p>}
            <AnswerDetails q={q} />
          </details>
        ))}
      </div>
    </div>
  )
}
