import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AnswerDetails from '../components/AnswerDetails'
import Filters, { applyFilters, defaultFilters, type FilterState } from '../components/Filters'
import StatusToggle from '../components/StatusToggle'
import Tags from '../components/Tags'
import { questions } from '../data/questions'
import { useProgress } from '../hooks/useProgress'
import { shuffle } from '../lib'

export default function Flashcards() {
  const location = useLocation()
  const passed = (location.state as { filters?: FilterState } | null)?.filters
  const [filters, setFilters] = useState<FilterState>(passed ?? defaultFilters)
  const { statuses } = useProgress()
  const [order, setOrder] = useState<string[]>(() => applyFilters(questions, filters, statuses).map((q) => q.id))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Rebuild the deck only when filters change, not when a card's status changes mid-session.
  useEffect(() => {
    setOrder(applyFilters(questions, filters, statuses).map((q) => q.id))
    setIndex(0)
    setFlipped(false)
  }, [filters])

  const deck = useMemo(() => order.map((id) => questions.find((q) => q.id === id)!).filter(Boolean), [order])
  const card = deck[index]

  const go = useCallback(
    (delta: number) => {
      if (!deck.length) return
      setIndex((i) => (i + delta + deck.length) % deck.length)
      setFlipped(false)
    },
    [deck.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, textarea')) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Flashcards</h1>
        <p className="muted">Answer out loud, then flip. <kbd>Space</kbd> flips, <kbd>←</kbd> <kbd>→</kbd> move.</p>
      </div>
      <Filters value={filters} onChange={setFilters} showSearch={false} />

      {card ? (
        <>
          <div className="deck-bar">
            <span className="muted">Card {index + 1} of {deck.length}</span>
            <button
              className="btn btn-ghost small"
              onClick={() => {
                setOrder(shuffle(order))
                setIndex(0)
                setFlipped(false)
              }}
            >
              Shuffle
            </button>
          </div>
          <div className={`card flashcard${flipped ? ' flipped' : ''}`}>
            <button className="flash-face" onClick={() => setFlipped((f) => !f)} aria-label="Flip card">
              <Tags q={card} />
              <p className="flash-prompt">{card.prompt}</p>
              {!flipped && <span className="muted small">Tap to reveal key points</span>}
            </button>
            {flipped && <AnswerDetails q={card} />}
          </div>
          <div className="flash-controls">
            <button className="btn" onClick={() => go(-1)}>← Prev</button>
            <StatusToggle id={card.id} />
            <button className="btn btn-primary" onClick={() => go(1)}>Next →</button>
          </div>
        </>
      ) : (
        <p className="empty">No cards match these filters.</p>
      )}
    </div>
  )
}
