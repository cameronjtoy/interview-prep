import type { ChoiceExercise, Exercise, NumericExercise } from '../types'
import { shuffle } from '../lib'

/** A template produces a fresh exercise each time `make` is called. */
export interface ExerciseTemplate {
  id: string
  topic: string
  make: () => Exercise
}

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)]
const range = (lo: number, hi: number, step: number) =>
  Array.from({ length: Math.floor((hi - lo) / step) + 1 }, (_, i) => lo + i * step)
const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp
const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

type NumericSpec = Omit<NumericExercise, 'id' | 'topic' | 'kind'>

function numeric(id: string, topic: string, gen: () => NumericSpec): ExerciseTemplate {
  return { id, topic, make: () => ({ id, topic, kind: 'numeric', ...gen() }) }
}

const numericTemplates: ExerciseTemplate[] = [
  numeric('ex-cpm', 'Metric math', () => {
    const spend = pick(range(1500, 9000, 500))
    const impr = pick(range(200_000, 1_200_000, 50_000))
    const cpm = round((spend / impr) * 1000)
    return {
      prompt: `A campaign spent ${money(spend)} for ${fmt(impr)} impressions. What is the CPM?`,
      answer: cpm,
      tolerance: 0.011,
      unit: '$',
      explanation: `CPM = cost / impressions × 1,000 = ${fmt(spend)} / ${fmt(impr)} × 1,000 ≈ ${money(cpm)}.`,
    }
  }),
  numeric('ex-ctr', 'Metric math', () => {
    const impr = pick(range(300_000, 1_500_000, 50_000))
    const ctr = pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2])
    const clicks = Math.round((impr * ctr) / 100)
    return {
      prompt: `${fmt(impr)} impressions produced ${fmt(clicks)} clicks. What is the CTR (in %)?`,
      answer: ctr,
      tolerance: 0.01,
      unit: '%',
      explanation: `CTR = ${fmt(clicks)} / ${fmt(impr)} = ${ctr}%.`,
    }
  }),
  numeric('ex-cpa', 'Metric math', () => {
    const cpc = pick([0.5, 0.8, 1.2, 1.5, 2, 2.5, 3])
    const cvr = pick([2, 2.5, 3, 4, 5, 8])
    const cpa = round(cpc / (cvr / 100))
    return {
      prompt: `CPC is ${money(cpc)} and CVR is ${cvr}%. What is the CPA?`,
      answer: cpa,
      tolerance: 0.011,
      unit: '$',
      explanation: `CPA = CPC / CVR = ${cpc} / ${cvr / 100} = ${money(cpa)}.`,
    }
  }),
  numeric('ex-roas', 'Metric math', () => {
    const spend = pick(range(5000, 30_000, 1000))
    const roas = pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6])
    return {
      prompt: `Spend ${money(spend)}, revenue ${money(spend * roas)}. What is ROAS (as a multiple, e.g. 3.5)?`,
      answer: roas,
      tolerance: 0.01,
      unit: 'x',
      explanation: `ROAS = revenue / spend = ${fmt(spend * roas)} / ${fmt(spend)} = ${roas}x.`,
    }
  }),
  numeric('ex-cpc-from-cpm', 'Metric math', () => {
    const cpm = pick([4, 5, 6, 8, 10, 12, 15, 20])
    const ctr = pick([0.4, 0.5, 0.8, 1, 1.25, 2])
    const clicksPerK = 10 * ctr
    const cpc = round(cpm / clicksPerK)
    return {
      prompt: `CPM is ${money(cpm)} and CTR is ${ctr}%. What is the CPC?`,
      answer: cpc,
      tolerance: 0.011,
      unit: '$',
      explanation: `Per 1,000 impressions you pay ${money(cpm)} and get ${fmt(clicksPerK)} clicks → CPC = ${cpm} / ${fmt(clicksPerK)} ≈ ${money(cpc)}.`,
    }
  }),
  numeric('ex-break-even', 'Profitability', () => {
    const margin = pick(range(15, 70, 5))
    const be = round(100 / margin)
    return {
      prompt: `Gross margin is ${margin}%. What is the break-even ROAS (to two decimals)?`,
      answer: be,
      tolerance: 0.011,
      unit: 'x',
      explanation: `Break-even ROAS = 1 / margin = 1 / ${margin / 100} ≈ ${be}x.`,
    }
  }),
  numeric('ex-max-cpa', 'Profitability', () => {
    const aov = pick([40, 60, 80, 100, 120, 150, 200])
    const margin = pick([25, 30, 40, 50, 60])
    const max = round((aov * margin) / 100)
    return {
      prompt: `AOV is ${money(aov)}, gross margin ${margin}%. What is the maximum CPA to break even on the first order?`,
      answer: max,
      tolerance: 0.011,
      unit: '$',
      explanation: `Gross profit per order = ${aov} × ${margin / 100} = ${money(max)}; that is the most you can pay per acquisition.`,
    }
  }),
  numeric('ex-budget-needed', 'Planning', () => {
    const target = pick([100, 200, 250, 300, 400, 500])
    const cvr = pick([2, 2.5, 4, 5])
    const cpc = pick([0.6, 0.9, 1.2, 1.5, 2])
    const clicks = target / (cvr / 100)
    const budget = round(clicks * cpc)
    return {
      prompt: `Target ${target} conversions. CVR ${cvr}%, CPC ${money(cpc)}. How much budget do you need?`,
      answer: budget,
      tolerance: 1,
      unit: '$',
      explanation: `Clicks = ${target} / ${cvr / 100} = ${fmt(clicks)}; budget = ${fmt(clicks)} × ${cpc} = ${money(budget)}.`,
    }
  }),
  numeric('ex-impressions', 'Planning', () => {
    const budget = pick(range(10_000, 50_000, 5000))
    const cpm = pick([20, 25, 30, 35, 40, 45])
    const impr = Math.round((budget / cpm) * 1000)
    return {
      prompt: `A ${money(budget)} CTV budget at a ${money(cpm)} CPM buys how many impressions?`,
      answer: impr,
      tolerance: Math.max(1, impr * 0.001),
      explanation: `Impressions = ${fmt(budget)} / ${cpm} × 1,000 ≈ ${fmt(impr)}.`,
    }
  }),
  numeric('ex-reach', 'Planning', () => {
    const impr = pick(range(1_000_000, 6_000_000, 500_000))
    const freq = pick([2, 2.5, 4, 5])
    const reach = Math.round(impr / freq)
    return {
      prompt: `A campaign delivered ${fmt(impr)} impressions at an average frequency of ${freq}. What was the reach?`,
      answer: reach,
      tolerance: Math.max(1, reach * 0.001),
      explanation: `Reach = impressions / frequency = ${fmt(impr)} / ${freq} = ${fmt(reach)} people.`,
    }
  }),
  numeric('ex-pct-change', 'Mental math', () => {
    const s = pick([10, 15, 20, 25, 30, 40])
    const c = pick([0, 5, 10, 15, 20].filter((x) => x < s))
    const ratio = (1 + s / 100) / (1 + c / 100)
    const change = round((ratio - 1) * 100, 1)
    return {
      prompt: `Spend up ${s}%, conversions up ${c}%. By what % did CPA change? (one decimal)`,
      answer: change,
      tolerance: 0.11,
      unit: '%',
      explanation: `New CPA = ${fmt(1 + s / 100)} / ${fmt(1 + c / 100)} = ${round(ratio, 4)} × old → +${change}%.`,
    }
  }),
  numeric('ex-blended-cvr', 'Mental math', () => {
    const ca = pick([1000, 2000, 3000, 4000])
    const ra = pick([1, 2, 3])
    const cb = pick([500, 1000])
    const rb = pick([4, 5, 6, 8])
    const conv = (ca * ra) / 100 + (cb * rb) / 100
    const cvr = round((conv / (ca + cb)) * 100)
    return {
      prompt: `Campaign A: ${fmt(ca)} clicks at ${ra}% CVR. Campaign B: ${fmt(cb)} clicks at ${rb}% CVR. What is the blended CVR (in %)?`,
      answer: cvr,
      tolerance: 0.011,
      unit: '%',
      explanation: `Conversions = ${fmt((ca * ra) / 100)} + ${fmt((cb * rb) / 100)} = ${fmt(conv)}; clicks = ${fmt(ca + cb)}; CVR = ${cvr}% (not the ${fmt((ra + rb) / 2)}% simple average).`,
    }
  }),
  numeric('ex-lift', 'Incrementality', () => {
    const control = pick([1.5, 2, 2.5, 3])
    const exposed = round(control * (1 + pick([10, 15, 20, 25, 30, 40]) / 100))
    const lift = round(((exposed - control) / control) * 100, 1)
    return {
      prompt: `Lift test: exposed group converts at ${exposed}%, holdout at ${control}%. What is the relative lift (in %)?`,
      answer: lift,
      tolerance: 0.11,
      unit: '%',
      explanation: `Lift = (${exposed} − ${control}) / ${control} ≈ ${lift}%. Only ${fmt(round(exposed - control))} / ${exposed} ≈ ${round(((exposed - control) / exposed) * 100, 0)}% of exposed-group conversions are incremental.`,
    }
  }),
  numeric('ex-iroas', 'Incrementality', () => {
    const spend = pick(range(20_000, 100_000, 10_000))
    const iroas = pick([0.8, 1.2, 1.5, 1.8, 2, 2.5, 3])
    return {
      prompt: `A geo test spent ${money(spend)} and produced ${money(spend * iroas)} in incremental revenue. What is iROAS?`,
      answer: iroas,
      tolerance: 0.01,
      unit: 'x',
      explanation: `iROAS = incremental revenue / spend = ${fmt(spend * iroas)} / ${fmt(spend)} = ${iroas}x — often much lower than platform-reported ROAS.`,
    }
  }),
  numeric('ex-marginal-cpa', 'Budget allocation', () => {
    const base = pick([8, 10, 12, 20]) * 1000
    const extra = pick([4, 5, 6]) * 1000
    const conv = pick(range(200, 400, 10))
    const extraConv = pick(range(40, 120, 10))
    const marginal = Math.round(extra / extraConv)
    const avg = round((base + extra) / (conv + extraConv), 0)
    return {
      prompt: `At ${money(base)}/week a campaign gets ${conv} conversions; at ${money(base + extra)} it gets ${conv + extraConv}. What is the marginal CPA of the extra ${money(extra)}? (nearest dollar)`,
      answer: marginal,
      tolerance: 1,
      unit: '$',
      explanation: `Marginal CPA = ${fmt(extra)} / ${extraConv} ≈ ${money(marginal)}, versus an average CPA of ${money(avg)} at ${money(base + extra)}. Allocate on marginal, not average.`,
    }
  }),
]

/** Shuffle the options while keeping track of the right answer. */
function shuffleOptions(ex: ChoiceExercise): ChoiceExercise {
  const order = shuffle(ex.options.map((_, i) => i))
  return { ...ex, options: order.map((i) => ex.options[i]), answerIndex: order.indexOf(ex.answerIndex) }
}

const CAMPAIGNS = `Campaign      Spend    Impr.      Clicks   Conv.   Revenue
Search-Brand  $2,000   40,000     4,000    400     $32,000
Search-NB     $8,000   200,000    10,000   250     $25,000
Meta-Prosp    $10,000  2,000,000  16,000   320     $22,400
Meta-Retarg   $3,000   300,000    4,500    180     $14,400
Display       $5,000   2,500,000  2,500    50      $3,500`

const choiceExercises: ChoiceExercise[] = [
  {
    id: 'ex-table-best-roas',
    kind: 'choice',
    topic: 'Campaign table',
    context: CAMPAIGNS,
    prompt: 'Which campaign has the highest ROAS?',
    options: ['Search-Brand', 'Search-NB', 'Meta-Prosp', 'Meta-Retarg'],
    answerIndex: 0,
    explanation: 'ROAS: Brand 16.0x, NB 3.1x, Meta-Prosp 2.2x, Retarg 4.8x, Display 0.7x. Brand wins — but it is also the least incremental.',
  },
  {
    id: 'ex-table-cpa',
    kind: 'choice',
    topic: 'Campaign table',
    context: CAMPAIGNS,
    prompt: 'Rank the campaigns by CPA. Which has the worst (highest) CPA?',
    options: ['Search-NB', 'Meta-Prosp', 'Display', 'Meta-Retarg'],
    answerIndex: 2,
    explanation: 'CPA: Brand $5, NB $32, Meta-Prosp $31.25, Retarg $16.67, Display $100.',
  },
  {
    id: 'ex-table-funnel',
    kind: 'choice',
    topic: 'Campaign table',
    context: CAMPAIGNS,
    prompt: 'Display\'s CTR is 0.1% and CVR is 2%. Where is it breaking down most vs. Meta-Prosp (CTR 0.8%, CVR 2%)?',
    options: [
      'Conversion rate — landing page problem',
      'Click-through rate — creative / placement / targeting problem',
      'CPM is too low',
      'Revenue tracking is broken',
    ],
    answerIndex: 1,
    explanation: 'CVR is identical, so post-click is fine. CTR is 8x lower — look at creative, placements and audience quality.',
  },
  {
    id: 'ex-table-shift',
    kind: 'choice',
    topic: 'Campaign table',
    context: CAMPAIGNS,
    prompt: 'You can move $3,000. Which reallocation is most defensible as a first step?',
    options: [
      'Display → Search-Brand, since Brand has the best ROAS',
      'Display → Search-NB and Meta-Prosp, then monitor marginal CPA',
      'Meta-Prosp → Meta-Retarg, since retargeting is cheaper',
      'Search-NB → Display, to build awareness',
    ],
    answerIndex: 1,
    explanation: 'Brand search is demand-capped and largely non-incremental; retargeting depends on prospecting. Moving Display dollars to scalable channels with reasonable CPA is the safest bet — then check marginal results.',
  },
  {
    id: 'ex-sql-output',
    kind: 'choice',
    topic: 'SQL',
    context: `SELECT channel, SUM(spend) / SUM(conversions) AS cpa
FROM campaign_daily
WHERE date >= '2026-01-01'
GROUP BY channel
HAVING SUM(conversions) > 100;`,
    prompt: 'What does this query return?',
    options: [
      'CPA per row, for rows with more than 100 conversions',
      'CPA by channel since Jan 1 2026, only for channels with more than 100 total conversions',
      'Average of daily CPAs by channel',
      'An error — HAVING cannot use SUM',
    ],
    answerIndex: 1,
    explanation: 'WHERE filters rows before grouping; HAVING filters groups after. SUM/SUM gives a properly weighted CPA.',
  },
  {
    id: 'ex-sql-join',
    kind: 'choice',
    topic: 'SQL',
    context: `campaigns (campaign_id, name)        -- 50 rows
conversions (campaign_id, conv_date) -- only 38 campaigns appear`,
    prompt: 'You need a list of all 50 campaigns with their conversion counts, including zeros. Which join?',
    options: [
      'campaigns INNER JOIN conversions',
      'campaigns LEFT JOIN conversions, COUNT(conversions.campaign_id)',
      'conversions LEFT JOIN campaigns',
      'campaigns CROSS JOIN conversions',
    ],
    answerIndex: 1,
    explanation: 'LEFT JOIN keeps all campaigns; COUNT on the right-table column returns 0 for unmatched rows (COUNT(*) would return 1).',
  },
  {
    id: 'ex-sql-window',
    kind: 'choice',
    topic: 'SQL',
    prompt: 'Which expression gives each campaign\'s rank by spend within its channel?',
    options: [
      'RANK() OVER (ORDER BY spend DESC)',
      'RANK() OVER (PARTITION BY channel ORDER BY spend DESC)',
      'GROUP BY channel ORDER BY spend',
      'MAX(spend) OVER (PARTITION BY campaign)',
    ],
    answerIndex: 1,
    explanation: 'PARTITION BY resets the ranking for each channel; ORDER BY spend DESC ranks highest spend as 1.',
  },
  {
    id: 'ex-excel-lookup',
    kind: 'choice',
    topic: 'Excel',
    prompt: 'You need to pull a campaign\'s budget from a sheet where the campaign name column is to the RIGHT of the budget column. Which works?',
    options: [
      '=VLOOKUP(A2, Budgets!A:B, 2, FALSE)',
      '=XLOOKUP(A2, Budgets!B:B, Budgets!A:A)',
      '=HLOOKUP(A2, Budgets!A:B, 2)',
      '=SUMIF(Budgets!A:A, A2)',
    ],
    answerIndex: 1,
    explanation: 'VLOOKUP can only look to the right of the lookup column. XLOOKUP (or INDEX/MATCH) can return a column to the left.',
  },
  {
    id: 'ex-excel-cpa',
    kind: 'choice',
    topic: 'Excel',
    prompt: 'A pivot shows daily CPA. To get CPA for the month you should…',
    options: [
      'AVERAGE the daily CPA column',
      'Divide total monthly spend by total monthly conversions',
      'Take the median daily CPA',
      'Multiply the average CPA by the number of days',
    ],
    answerIndex: 1,
    explanation: 'Averaging ratios weights low-volume days the same as high-volume days. Aggregate numerator and denominator first.',
  },
  {
    id: 'ex-significance',
    kind: 'choice',
    topic: 'Testing',
    prompt: 'Ad A: 50 conversions / 1,000 clicks. Ad B: 60 / 1,000. What is the best conclusion?',
    options: [
      'B is 20% better — roll it out',
      'The difference is not statistically significant yet; keep testing or accept the risk',
      'A is better because it is cheaper',
      'The test is invalid',
    ],
    answerIndex: 1,
    explanation: 'A two-proportion z-test gives z ≈ 0.98 (p ≈ 0.33). A 1-point gap on 1,000 clicks each is well within noise.',
  },
]

export const exerciseTemplates: ExerciseTemplate[] = [
  ...numericTemplates,
  ...choiceExercises.map((ex) => ({ id: ex.id, topic: ex.topic, make: () => shuffleOptions(ex) })),
]
