export type Category =
  | 'behavioral'
  | 'company'
  | 'strategy'
  | 'fundamentals'
  | 'measurement'
  | 'analytics'
  | 'case'
  | 'estimation'

export type QuestionType = 'technical' | 'non-technical'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  category: Category
  type: QuestionType
  difficulty: Difficulty
  prompt: string
  keyPoints: string[]
  sampleAnswer?: string
  followUps?: string[]
  tip?: string
  /** Where this question (or a close variant) has been reported. */
  source?: string
}

export interface CategoryInfo {
  id: Category
  label: string
  blurb: string
}

interface ExerciseBase {
  id: string
  topic: string
  prompt: string
  /** Optional data shown above the question (table rows, SQL, etc.). */
  context?: string
  explanation: string
}

export interface NumericExercise extends ExerciseBase {
  kind: 'numeric'
  answer: number
  /** Accepted absolute error. */
  tolerance: number
  unit?: string
}

export interface ChoiceExercise extends ExerciseBase {
  kind: 'choice'
  options: string[]
  answerIndex: number
}

export type Exercise = NumericExercise | ChoiceExercise

export type Status = 'confident' | 'needs-work'
