import { useSyncExternalStore } from 'react'
import type { Status } from '../types'

const KEY = 'interview-prep:progress:v1'

interface ProgressState {
  statuses: Record<string, Status>
  /** exercise id -> answered correctly on the latest attempt */
  exercises: Record<string, boolean>
}

const empty: ProgressState = { statuses: {}, exercises: {} }

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty, ...JSON.parse(raw) }
  } catch {
    // storage unavailable (private mode, blocked) — fall back to in-memory
  }
  return empty
}

let state = load()
const listeners = new Set<() => void>()

function commit(next: ProgressState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore — progress just won't persist
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function setStatus(id: string, status: Status | null) {
  const statuses = { ...state.statuses }
  if (status) statuses[id] = status
  else delete statuses[id]
  commit({ ...state, statuses })
}

export function recordExercise(id: string, correct: boolean) {
  commit({ ...state, exercises: { ...state.exercises, [id]: correct } })
}

export function resetProgress() {
  commit(empty)
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}
