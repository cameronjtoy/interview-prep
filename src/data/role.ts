import type { CategoryInfo } from '../types'

// Swap these values to retarget the site at a different company or role.
export const role = {
  title: 'Media Strategy Analyst',
  company: 'Kepler Group',
  summary:
    'Kepler is a data-driven performance marketing agency: analysts own media strategy and execution across search, social, programmatic and retail media, and are expected to back every recommendation with numbers.',
  whatTheyLookFor: [
    'Comfort with marketing math (CPM, CPA, ROAS) and quick mental arithmetic',
    'Structured thinking on open-ended cases — budget splits, audience selection, diagnosing a KPI swing',
    'Excel fluency and basic SQL; curiosity about data',
    'Clear client communication and ownership of outcomes',
    'Genuine interest in digital advertising and where it is heading',
  ],
  process: [
    'Recruiter / HR phone screen — background, why agency, why Kepler',
    'Interviews with analysts or managers — behavioral plus marketing fundamentals',
    'Case or data exercise — calculate metrics, pick the best campaign, recommend optimizations',
    'Final round — sometimes a short presentation (e.g. on programmatic) and team fit',
  ],
}

export const categories: CategoryInfo[] = [
  { id: 'behavioral', label: 'Behavioral & Fit', blurb: 'STAR stories, teamwork, clients, motivation' },
  { id: 'company', label: 'Company & Industry', blurb: 'Agency models, trends, privacy, platforms' },
  { id: 'strategy', label: 'Media Strategy', blurb: 'Channel mix, audiences, planning, funnels' },
  { id: 'fundamentals', label: 'Marketing Fundamentals', blurb: 'Metrics, bidding, search, social, programmatic' },
  { id: 'measurement', label: 'Measurement', blurb: 'Attribution, incrementality, testing' },
  { id: 'analytics', label: 'Excel & SQL', blurb: 'Formulas, pivots, queries, diagnostics' },
  { id: 'case', label: 'Case Studies', blurb: 'Open-ended business problems' },
  { id: 'estimation', label: 'Estimation & Math', blurb: 'Market sizing and mental math' },
]

export const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id
