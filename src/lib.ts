export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.abs(seconds))
  const m = Math.floor(s / 60)
  return `${seconds < 0 ? '+' : ''}${m}:${String(s % 60).padStart(2, '0')}`
}
