import type { Question } from '../../types'
import { behavioral } from './behavioral'
import { company } from './company'
import { strategy } from './strategy'
import { fundamentals } from './fundamentals'
import { measurement } from './measurement'
import { analytics } from './analytics'
import { cases } from './cases'
import { estimation } from './estimation'

export const questions: Question[] = [
  ...behavioral,
  ...company,
  ...strategy,
  ...fundamentals,
  ...measurement,
  ...analytics,
  ...cases,
  ...estimation,
]
