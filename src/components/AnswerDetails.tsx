import type { Question } from '../types'

export default function AnswerDetails({ q }: { q: Question }) {
  return (
    <div className="answer">
      <h4>Key points</h4>
      <ul>
        {q.keyPoints.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {q.sampleAnswer && (
        <>
          <h4>Sample answer</h4>
          <p className="sample">{q.sampleAnswer}</p>
        </>
      )}
      {q.followUps && q.followUps.length > 0 && (
        <>
          <h4>Possible follow-ups</h4>
          <ul>
            {q.followUps.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}
      {q.tip && <p className="tip">💡 {q.tip}</p>}
      {q.source && <p className="source">Reported at: {q.source}</p>}
    </div>
  )
}
