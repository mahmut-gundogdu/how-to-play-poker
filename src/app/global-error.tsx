'use client';

// Next renders this outside the locale layout, so it must supply its own
// <html>/<body>. English only — the locale is not known at this point.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: '#f6f4f0', color: '#1a1816' }}>
        <div style={{ maxWidth: 480, margin: '96px auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4a463f' }}>
            The page could not be rendered. Try again, or head back to the hand rankings.
          </p>
          <button
            onClick={reset}
            style={{
              appearance: 'none', border: 0, borderRadius: 7, padding: '12px 20px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: '#7a2e2e', color: '#fff8f2', font: 'inherit',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
