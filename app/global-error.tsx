"use client";

// Catches errors in the root layout itself (rare). Must render its own
// <html>/<body> because it replaces the whole document.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#e9e7f1",
          color: "#1a1430",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 26 }}>Something broke</h1>
          <p style={{ fontWeight: 700, opacity: 0.7 }}>Please reload the page.</p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              fontWeight: 800,
              border: "2px solid #1a1430",
              borderRadius: 999,
              background: "#6c4cf0",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
