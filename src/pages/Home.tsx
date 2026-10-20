import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { exerciseTemplates } from '../data/exercises'
import { questions } from '../data/questions'
import { categories, role } from '../data/role'
import { resetProgress, useProgress } from '../hooks/useProgress'

export default function Home() {
  const { statuses, exercises: exResults } = useProgress()
  const confident = Object.values(statuses).filter((s) => s === 'confident').length
  const needsWork = Object.values(statuses).filter((s) => s === 'needs-work').length
  const exDone = Object.keys(exResults).length
  const exCorrect = Object.values(exResults).filter(Boolean).length
  const technical = questions.filter((q) => q.type === 'technical').length

  return (
    <div className="stack-lg">
      <section className="hero">
        <p className="eyebrow">{role.company}</p>
        <h1>{role.title} interview prep</h1>
        <p className="lede">{role.summary}</p>
        <div className="hero-actions">
          <Link to="/mock" className="btn btn-primary">Start a mock interview</Link>
          <Link to="/questions" className="btn">Browse {questions.length} questions</Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <span className="stat-num">{questions.length}</span>
          <span className="stat-label">questions · {technical} technical, {questions.length - technical} non-technical</span>
        </div>
        <div className="stat">
          <span className="stat-num">{confident}</span>
          <span className="stat-label">marked confident · {needsWork} need work</span>
        </div>
        <div className="stat">
          <span className="stat-num">{exCorrect}/{exerciseTemplates.length}</span>
          <span className="stat-label">exercises correct · {exDone} attempted</span>
        </div>
      </section>

      <section>
        <h2>Categories</h2>
        <div className="grid">
          {categories.map((c) => {
            const qs = questions.filter((q) => q.category === c.id)
            const conf = qs.filter((q) => statuses[q.id] === 'confident').length
            const nw = qs.filter((q) => statuses[q.id] === 'needs-work').length
            return (
              <Link key={c.id} to={`/questions?category=${c.id}`} className="card cat-card">
                <div className="cat-head">
                  <h3>{c.label}</h3>
                  <span className="muted">{qs.length}</span>
                </div>
                <p className="muted">{c.blurb}</p>
                <ProgressBar confident={conf} needsWork={nw} total={qs.length} />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="two-col">
        <div className="card">
          <h2>What they look for</h2>
          <ul className="list">
            {role.whatTheyLookFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Typical process</h2>
          <ol className="list">
            {role.process.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <p className="muted small">Based on candidate reports on Glassdoor; your process may differ.</p>
        </div>
      </section>

      <section className="card how">
        <h2>How to use this</h2>
        <ol className="list">
          <li><strong>Browse</strong> the question bank and draft your own answers using the key points.</li>
          <li><strong>Drill</strong> with flashcards and mark each question confident or needs work.</li>
          <li><strong>Practice the math</strong> in Exercises until metric formulas are automatic.</li>
          <li><strong>Simulate</strong> the real thing with a timed mock interview — answer out loud.</li>
        </ol>
        {(confident + needsWork + exDone > 0) && (
          <button
            className="btn btn-ghost small"
            onClick={() => {
              if (confirm('Reset all saved progress?')) resetProgress()
            }}
          >
            Reset progress
          </button>
        )}
      </section>
    </div>
  )
}
