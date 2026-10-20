import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import QuestionBank from './pages/QuestionBank'
import Flashcards from './pages/Flashcards'
import MockInterview from './pages/MockInterview'
import Exercises from './pages/Exercises'
import { role } from './data/role'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/questions', label: 'Questions' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/mock', label: 'Mock interview' },
  { to: '/exercises', label: 'Exercises' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden>✳</span>
            <span>
              Interview Prep
              <span className="brand-sub">{role.title}</span>
            </span>
          </NavLink>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            ☰
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionBank />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/mock" element={<MockInterview />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        Built for practice · {role.company} {role.title} · progress is saved in your browser
      </footer>
    </div>
  )
}
