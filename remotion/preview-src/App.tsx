import React, { useState } from "react";
import { Player } from "@remotion/player";
import { CashClownsPromo } from "../src/CashClownsPromo";

const FORMATS = {
  landscape: { width: 1920, height: 1080, label: "16:9", sub: "YouTube / FB" },
  vertical: { width: 1080, height: 1920, label: "9:16", sub: "Reels / Shorts" },
  square: { width: 1080, height: 1080, label: "1:1", sub: "Square Feed" },
} as const;

type FormatKey = keyof typeof FORMATS;

const inputProps = {
  brand: "ClownFlowAI",
  tagline: "The next generation of mouse jigglers is here.",
  hype: "Download Free",
  cta: "cashclowns.github.io/KeepAlive",
};

const PINK = "#FF1B6B";
const ACCENT = "#22D3EE";

export const App: React.FC = () => {
  const [format, setFormat] = useState<FormatKey>("vertical");
  const f = FORMATS[format];

  return (
    <div style={{ minHeight: "100vh", padding: "16px 12px 32px", maxWidth: 720, margin: "0 auto" }}>
      <header style={{ marginBottom: 16, textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 36,
            margin: 0,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            background: `linear-gradient(90deg, ${PINK}, ${ACCENT})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ClownFlowAI Promo
        </h1>
        <p style={{ margin: "4px 0 0", opacity: 0.7, fontSize: 14 }}>
          Live preview · tap a format
        </p>
      </header>

      <div
        role="tablist"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {(Object.keys(FORMATS) as FormatKey[]).map((k) => {
          const active = k === format;
          const opt = FORMATS[k];
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFormat(k)}
              style={{
                padding: "10px 8px",
                background: active ? PINK : "#1a1a22",
                color: "white",
                border: `2px solid ${active ? PINK : "#2a2a35"}`,
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                lineHeight: 1.2,
                touchAction: "manipulation",
              }}
            >
              <div style={{ fontSize: 18 }}>{opt.label}</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{opt.sub}</div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "#000",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(255, 27, 107, 0.25)`,
        }}
      >
        <Player
          key={format}
          component={CashClownsPromo}
          inputProps={inputProps}
          durationInFrames={450}
          fps={30}
          compositionWidth={f.width}
          compositionHeight={f.height}
          style={{ width: "100%", display: "block" }}
          controls
          autoPlay
          loop
          clickToPlay
          spaceKeyToPlayOrPause
          acknowledgeRemotionLicense
        />
      </div>

      <footer style={{ marginTop: 20, textAlign: "center", fontSize: 12, opacity: 0.55, lineHeight: 1.5 }}>
        Built with Remotion. To render mp4:<br />
        <code style={{ background: "#1a1a22", padding: "2px 6px", borderRadius: 4 }}>
          npx remotion render CashClownsPromo
        </code>
      </footer>
    </div>
  );
};
