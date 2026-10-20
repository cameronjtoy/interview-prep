import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import BunnyLogo from './BunnyLogo'

// SHA-256 of the site password. To change it: printf '%s' 'new-password' | sha256sum
// This is a deterrent for casual visitors, not real security — the app bundle is public.
const PASSWORD_HASH = '3ea57344fb0085aa7fc39e3ae45f2388cbd0c416bdf78a1a287a88368d96e3f5'
const KEY = 'interview-prep:unlocked:v1'

async function sha256(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function wasUnlocked() {
  try {
    return localStorage.getItem(KEY) === PASSWORD_HASH
  } catch {
    return false
  }
}

export function lock() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // storage unavailable — reload alone re-locks
  }
  window.location.reload()
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(wasUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  if (unlocked) return <>{children}</>

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if ((await sha256(value)) === PASSWORD_HASH) {
      try {
        localStorage.setItem(KEY, PASSWORD_HASH)
      } catch {
        // unlock lasts for this session only
      }
      setUnlocked(true)
      return
    }
    setError(true)
    setShake((s) => s + 1)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="gate">
      <form key={shake} className={`card gate-card${shake ? ' shake' : ''}`} onSubmit={submit}>
        <BunnyLogo size={56} />
        <h1>Interview Prep</h1>
        <p className="muted">This site is private. Enter the password to continue.</p>
        <input
          ref={inputRef}
          className="input"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          autoFocus
          aria-label="Password"
          aria-invalid={error}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
        />
        {error && <p className="gate-error" role="alert">That password isn't right. Try again.</p>}
        <button className="btn btn-primary" disabled={!value}>Unlock</button>
      </form>
    </div>
  )
}
